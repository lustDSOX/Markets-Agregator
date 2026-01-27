import asyncio
import json
from curl_cffi import requests
from urllib.parse import urlencode

def get_basket_number(s: int) -> str:
    if 0 <= s <= 143:
        return "01"
    elif s <= 287:
        return "02"
    elif s <= 431:
        return "03"
    elif s <= 719:
        return "04"
    elif s <= 1007:
        return "05"
    elif s <= 1061:
        return "06"
    elif s <= 1115:
        return "07"
    elif s <= 1169:
        return "08"
    elif s <= 1313:
        return "09"
    elif s <= 1601:
        return "10"
    elif s <= 1655:
        return "11"
    elif s <= 1919:
        return "12"
    elif s <= 2045:
        return "13"
    elif s <= 2189:
        return "14"
    elif s <= 2405:
        return "15"
    elif s <= 2621:
        return "16"
    elif s <= 2837:
        return "17"
    elif s <= 3053:
        return "18"
    elif s <= 3269:
        return "19"
    elif s <= 3485:
        return "20"
    elif s <= 3701:
        return "21"
    elif s <= 3917:
        return "22"
    elif s <= 4133:
        return "23"
    elif s <= 4349:
        return "24"
    elif s <= 4565:
        return "25"
    elif s <= 4877:
        return "26"
    elif s <= 5189:
        return "27"
    elif s <= 5501:
        return "28"
    elif s <= 5813:
        return "29"
    elif s <= 6125:
        return "30"
    elif s <= 6437:
        return "31"
    elif s <= 6749:
        return "32"
    elif s <= 7061:
        return "33"
    elif s <= 7373:
        return "34"
    elif s <= 7685:
        return "35"
    elif s <= 7997:
        return "36"
    elif s <= 8309:
        return "37"
    else:
        return "38"

async def parse_wildberries(query, page, sort):
    params = {
        "ab_testing": "false",
        "appType": 1,
        "curr": "rub",
        "dest": "12358536",
        # "hide_dtype": 9,
        "lang": "ru",
        "page": page,
        "query": query,
        "resultset": "catalog",
        "sort":sort #priceup, pricedown, rate
    }

    url = f"https://www.wildberries.ru/__internal/search/exactmatch/ru/common/v18/search?ab_vector_search=e5_base&appType=1&curr=rub&dest=12358536&hide_dtype=9&hide_vflags=4294967296&inheritFilters=false&lang=ru&query=%D1%84%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D0%BA%D0%B0+%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%B0%D1%8F&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false&uclusters=1"

    try:
        # Using curl_cffi instead of httpx
        # Run the synchronous request in a thread pool to maintain async interface
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: requests.get(url, impersonate="chrome110")
        )
        
        # Check if we got a 429 error (rate limiting)
        if response.status_code == 429:
            print("Rate limited by Wildberries. Returning empty results.")
            return []
        
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Error fetching data from Wildberries: {e}")
        return []

    products = data.get("products", [])
    result = []

    for product in products:
        product_id = product.get("id")
        pics = product.get("pics", 0)
        sizes = product.get("sizes", [])

        if not sizes:
            continue

        price_info = sizes[0].get("price", {})
        basic_price = price_info.get("basic", 0) / 100
        product_price = price_info.get("product", 0) / 100
        discount_percent = round((1 - product_price / basic_price) * 100, 2) if basic_price else 0

        vol = product_id // 100000
        part = product_id // 1000
        basket = get_basket_number(vol)
        base_url = f"https://basket-{basket}.wbbasket.ru/vol{vol}/part{part}/{product_id}/images/big"

        result.append({
            "name": product.get("name"),
            "brand": product.get("brand"),
            "reviewRating": product.get("reviewRating"),
            "count_feedbacks": product.get("feedbacks"),
            "basic_price": basic_price,
            "product_price": product_price,
            "discount_percent": discount_percent,
            "images": [f"{base_url}/{i}.webp" for i in range(1, pics + 1)],
            "link": f"https://www.wildberries.ru/catalog/{product.get("id")}/detail.aspx",
            "store": "wildberries"
        })
    return result

if __name__ == "__main__":
    query = "футболка"
    async def main():
        parsed_data = await parse_wildberries(query, 1, "priceup")
        with open(f"wildberries_{query}.json", "w", encoding="utf-8") as f:
            json.dump(parsed_data, f, ensure_ascii=False, indent=2)
        print(f"Сохранено {len(parsed_data)} товаров в wildberries_{query}.json")

    asyncio.run(main())
