import asyncio
import json
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from ..driver_utils import TabManager, create_stealth_driver

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

def fetch_product_json(driver:uc.Chrome,tabs:TabManager, query, page, sort):
    tabs.switch_to("wb")
    params = {
        "ab_testing": "false",
        "appType": 1,
        "curr": "rub",
        "dest": "12358536",
        "lang": "ru",
        "page": page,
        "query": query,
        "resultset": "catalog",
        "sort": sort  # priceup, pricedown, rate
    }
    
    url_params = "&".join([f"{k}={v}" for k, v in params.items()])
    url = f"https://www.wildberries.ru/__internal/search/exactmatch/ru/common/v18/search?{url_params}"
    
    script = f"""
        return fetch("{url}", {{
            method: 'GET',
            headers: {{
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': 'https://www.wildberries.ru/',
                'X-Requested-With': 'XMLHttpRequest'
            }}
        }}).then(res => res.json());
    """
    
    try:
        data = driver.execute_script(script)
        return data
    except Exception as e:
        print(f"Error fetching data from Wildberries: {e}")
        return {}

def parse_wildberries_selenium(driver:uc.Chrome,tabs:TabManager, query, page, sort):
    data = fetch_product_json(driver, query, page, sort)
    
    if not data:
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
            "link": f"https://www.wildberries.ru/catalog/{product.get('id')}/detail.aspx",
            "store": "wildberries"
        })
    
    return result

if __name__ == "__main__":
    query = "футболка"
    
    def main():
        driver, tabs = create_stealth_driver()
        tabs.switch_to("wb")
        try:
            parsed_data = parse_wildberries_selenium(driver, query, 1, "priceup")
            with open(f"wildberries_{query}_selenium.json", "w", encoding="utf-8") as f:
                json.dump(parsed_data, f, ensure_ascii=False, indent=2)
            print(f"Сохранено {len(parsed_data)} товаров в wildberries_{query}_selenium.json")
        except Exception as e:
            print(f"Error occurred: {e}")
        finally:
            driver.quit()
    
    main()