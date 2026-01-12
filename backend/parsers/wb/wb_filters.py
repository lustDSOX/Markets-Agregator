import asyncio
import json
import httpx
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

    url = f"https://search.wb.ru/exactmatch/ru/common/v14/search?"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()

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

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()

    result = data.get("data",[]).get("filters",[])[0].get("items",[])
    return result

if __name__ == "__main__":
    query = "футболка"
    filter = "ffbrand"
    async def main():
        parsed_all = await get_wb_all_filters(query)
        parsed_one = await get_wb_filter(query,filter)
        with open(f"wildberries_{query}.json", "w", encoding="utf-8") as f:
            json.dump(parsed_all, f, ensure_ascii=False, indent=2)
            print(f"Сохранены все фильтры в wildberries_{query}.json")
        with open(f"wildberries_{filter}.json", "w", encoding="utf-8") as f:
            json.dump(parsed_one, f, ensure_ascii=False, indent=2)
            print(f"Сохранены один полный фильтр в wildberries_{filter}.json")

    asyncio.run(main())
    
