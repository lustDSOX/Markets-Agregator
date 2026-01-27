import asyncio
import json
from curl_cffi import requests
from urllib.parse import urlencode

# ALL FILTERS
async def get_wb_all_filters(query):
    params = {
        "ab_testing": "false",
        "appType": 1,
        "curr": "rub",
        "dest": "12358536", #заглушка
        "hide_dtype": "13;14",
        "lang": "ru",
        "query": query,
        "resultset": "filters",
        "spp":"30",
        "suppressSpellcheck":"false"
    }

    url = f"https://www.wildberries.ru/__internal/search/exactmatch/ru/common/v18/search?"

    # Using curl_cffi requests instead of httpx
    # curl_cffi requests is synchronous, so we run it in a thread pool
    loop = asyncio.get_event_loop()
    try:
        response = await loop.run_in_executor(None, lambda: requests.get(url, params=params, impersonate="chrome110"))
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            print("Too many requests. Waiting before retry...")
            await asyncio.sleep(5)  # Wait 5 seconds before retry
            response = await loop.run_in_executor(None, lambda: requests.get(url, params=params, impersonate="chrome110"))
            response.raise_for_status()
            data = response.json()
        else:
            raise

    filters = data.get("data",[]).get("filters",[])
    result = [
        item for item in filters 
        if item.get("key") not in {"fnds", "fpremiumuser","faction"}
    ]

    return result

# FULL ONE FILTER
async def get_wb_filter(query,filter):
    params = {
        "ab_testing": "false",
        "appType": 1,
        "curr": "rub",
        "dest": "12358536", #заглушка
        "filters": filter,
        "hide_dtype": "13;14",
        "lang": "ru",
        "query": query,
        "resultset": "filters",
        "spp":"30",
        "suppressSpellcheck":"false"
    }

    url = f"https://search.wb.ru/exactmatch/ru/common/v14/search?"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }

    # Using curl_cffi requests instead of httpx
    # curl_cffi requests is synchronous, so we run it in a thread pool
    loop = asyncio.get_event_loop()
    try:
        response = await loop.run_in_executor(None, lambda: requests.get(url, params=params, headers=headers, impersonate="chrome110"))
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            print("Too many requests. Waiting before retry...")
            await asyncio.sleep(5)  # Wait 5 seconds before retry
            response = await loop.run_in_executor(None, lambda: requests.get(url, params=params, headers=headers, impersonate="chrome110"))
            response.raise_for_status()
            data = response.json()
        else:
            raise

    result = data.get("data",[]).get("filters",[])[0].get("items",[])
    return result

if __name__ == "__main__":
    query = "футболка"
    filter = "ffbrand"
    async def main():
        try:
            parsed_all = await get_wb_all_filters(query)
            await asyncio.sleep(1)  # Add delay between requests
            parsed_one = await get_wb_filter(query,filter)
            with open(f"wildberries_{query}.json", "w", encoding="utf-8") as f:
                json.dump(parsed_all, f, ensure_ascii=False, indent=2)
                print(f"Сохранены все фильтры в wildberries_{query}.json")
            with open(f"wildberries_{filter}.json", "w", encoding="utf-8") as f:
                json.dump(parsed_one, f, ensure_ascii=False, indent=2)
                print(f"Сохранены один полный фильтр в wildberries_{filter}.json")
        except Exception as e:
            print(f"Error occurred: {e}")

    asyncio.run(main())
