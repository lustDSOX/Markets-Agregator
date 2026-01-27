import heapq
import asyncio
from aiohttp import web
import aiohttp_cors
import parsers.wb.wb_product as wb
import parsers.wb.wb_filters as wb_f
import parsers.ozon.ozon_product as ozon
import parsers.ozon.ozon_filters as ozon_f
from parsers.driver_utils import create_stealth_driver
import uuid

class SearchSession:
    def __init__(self, query, sort_key, stores, sort_map):
        self.id = str(uuid.uuid4())
        self.query = query 
        self.sort_key = sort_key
        self.cursors = {store: 1 for store in stores} 
        self.buffers = {store: [] for store in stores}
        self.heap = []
        self.stores = stores 
        self.sort_map = sort_map 

    async def init_buffers(self):
        tasks = [stores_map[store](self.query, self.cursors[store], self.sort_map[store]) for store in self.stores]
        pages = await asyncio.gather(*tasks, return_exceptions=True)
        for store, page in zip(self.stores, pages):
            if isinstance(page, Exception):
                continue
            self.buffers[store].extend(page)
            self.cursors[store] += 1
            if self.buffers[store]:
                first = self.buffers[store].pop(0)
                heapq.heappush(self.heap, (self.sort_key(first), store, 0, first))

    async def get_batch(self, batch_size):
        result = []
        while len(result) < batch_size and self.heap:
            key, store, idx, elem = heapq.heappop(self.heap)
            result.append(elem)

            if self.buffers[store]:
                nxt = self.buffers[store].pop(0)
                heapq.heappush(self.heap, (self.sort_key(nxt), store, idx + 1, nxt))
            else:
                page = await stores_map[store](self.query, self.cursors[store], self.sort_map[store])
                if not isinstance(page, Exception):
                    self.buffers[store].extend(page)
                    self.cursors[store] += 1
                    if self.buffers[store]:
                        nxt = self.buffers[store].pop(0)
                        heapq.heappush(self.heap, (self.sort_key(nxt), store, 0, nxt))
        return result
    
stores_map = {
    'wildberries': lambda q, p, s: wb.parse_wildberries(q, p, s),
    'ozon': lambda q, p, s: ozon.async_fetch_products(driver=app['ozon_driver'], query=q, page=p, sort=s)
}

# GET SEARCH RESULT
async def handle_search(request):
    query = request.rel_url.query.get('query', '').strip()
    # SORT ---->  price_desc, price_asc, rating
    sort = request.query.get('sort')
    stores = [store for store in request.query.get('stores', '').split(',') if store]

    if sort == 'price_desc':
        sort_key = lambda x: -x.get('product_price', 0)
    elif sort == 'rating':
        sort_key = lambda x: -x.get('reviewRating', 0)
    else:  # by default -> price_asc
        sort_key = lambda x: x.get('product_price', float('inf'))

    # sort for eact store
    sort_map = {
        'ozon': 'price' if sort == 'price_asc' else ('price_desc' if sort == 'price_desc' else 'rating'),
        'wildberries':   'priceup' if sort == 'price_asc' else ('pricedown' if sort == 'price_desc' else 'rate'),
    }

    # Check if there's an existing session and remove it
    existing_session_id = request.query.get('session_id')
    if existing_session_id and existing_session_id in request.app.get('sessions', {}):
        del request.app['sessions'][existing_session_id]

    session = SearchSession(query, sort_key, stores, sort_map)
    await session.init_buffers()
    request.app.setdefault('sessions', {})[session.id] = session
    batch = await session.get_batch(batch_size=30)
    return web.json_response({'session_id': session.id, 'items': batch})

# POST SCROLL NEXT
async def handle_scroll(request):
    session_id = request.rel_url.query.get('session_id','').strip()
    session = request.app.get('sessions', {}).get(session_id)
    if not session:
        return web.json_response({'error': 'Invalid session_id'}, status=400)

    batch = await session.get_batch(batch_size=30)
    return web.json_response({'items': batch})

# GET FULL FILTER
async def handle_get_filter(request):
    query = request.rel_url.query.get('query', '').strip()
    filter = request.rel_url.query.get('filter', '').strip()
    store = request.rel_url.query.get('store', 'wildberries').strip()
    
    if store == 'ozon':
        data = ozon_f.ozon_filter(request.app['ozon_driver'], filter, query)
    else:
        data = await wb_f.get_wb_filter(query, filter)
    
    return web.json_response({'key': filter, 'store': store, 'items': data})

# GET ALL FILTERS BY QUERY
async def handle_get_all_filters(request):
    query = request.rel_url.query.get('query', '').strip()
    store = request.rel_url.query.get('store', '').strip()
    if not store:
        return web.json_response({'error': 'Store parameter is required'}, status=400)
    
    if store == 'ozon':
        data = await ozon_f.get_ozon_all_filters(request.app['ozon_driver'], query)
    else:
        data = await wb_f.get_wb_all_filters(query)
    
    return web.json_response({'key': query, 'store': store, 'items': data})


async def on_startup(app):
    driver = create_stealth_driver()
    app["ozon_driver"] = driver

async def on_cleanup(app):
    driver = app.get("ozon_driver")
    if driver:
        driver.quit()
        print("Driver is quit")

app = web.Application()
app.on_startup.append(on_startup)
app.on_cleanup.append(on_cleanup)

get_route = app.router.add_get('/search', handle_search)
post_route = app.router.add_post('/search/scroll', handle_scroll)
filter_route = app.router.add_get('/filters', handle_get_all_filters)
specific_filter_route = app.router.add_get('/filter', handle_get_filter)

cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers="*",
        allow_headers="*",
        allow_methods=["*"]
    )
})

cors.add(get_route)
cors.add(post_route)
cors.add(filter_route)
cors.add(specific_filter_route)

if __name__ == "__main__":
    web.run_app(app, host="localhost", port=8000)
