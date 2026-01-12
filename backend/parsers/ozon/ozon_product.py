import os
import re
import json
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service

def create_stealth_driver():
    user_agent = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 YaBrowser/25.4.0.0 Safari/537.36"
    )
    options = uc.ChromeOptions()
    
    options.add_argument("--headless=new")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-web-security")
    options.add_argument(f"--user-agent={user_agent}")

    path = os.path.join(os.getcwd(), "chromedriver")
    service = Service(path)
    
    print("Start driver")
    driver = uc.Chrome(service=service, options=options)
    print("Driver starting")
    driver.get("https://www.ozon.ru/")
    try:
        print("wait layout")
        wait = WebDriverWait(driver,10)
        wait.until(EC.presence_of_element_located((By.ID, "layoutPage")))
        print(f"layout load")
    except:
        print(f"!!!10 sec not away layout!!!")
    return driver

def clean_text(text: str) -> str:
    return re.sub(r"[^\d\.,]+", "", text or "")

def find_tile_widget(widgets):
    for w in widgets:
        if w.get('component') == 'tileGridDesktop':
            return w
        for ph in w.get('placeholders', []):
            result = find_tile_widget(ph.get('widgets', []))
            if result:
                return result
    return None

def fetch_product_json(driver, page, query = "", sort="price"):
    #SORT ===== price_desc, price, rating
    if page == 1:
        url = f"https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=%2Fcategory%2Fodezhda-obuv-i-aksessuary-7500%2F&from_global=true&text={query}&sorting={sort}"
    else:
        url = page
    script = f"""
        return fetch("{url}", {{
            method: 'GET',
            credentials: 'include'
        }}).then(res => res.text());
    """
    raw_response = driver.execute_script(script)
    json_data = json.loads(raw_response)
    tile_widget = find_tile_widget(json_data['layout'])
    if not tile_widget:
        print("Tile widget not found")
        return []
    state_id = tile_widget['stateId']
    state_data = json.loads(json_data['widgetStates'][state_id])
    items = state_data.get('items', [])
    records = []
    for item in items:
        link = "https://www.ozon.ru" + item.get('action').get("link")
        try:
            main_state = item.get("mainState")
            if not main_state:
                continue

            mainState_price = main_state[0].get("priceV2")
            mainState_len = len(main_state)
            if main_state[mainState_len-1].get("type") == "textAtom":
                reviewRating = 0.0
                count_feedbacks = 0
                name = main_state[mainState_len-1].get("textAtom", {}).get("text")
            else:
                mainState_rating = main_state[mainState_len-1].get("labelList", {}).get("items", [])
                reviewRating = float(clean_text(mainState_rating[0].get("title")))
                count_feedbacks = float(clean_text(mainState_rating[1].get("title")))
                name = main_state[mainState_len-2].get("textAtom", {}).get("text")
            discount = mainState_price.get('discount')
            discount = discount.replace("−", "-")
            discount = discount.replace("%", "")
            rec = {
                'name': name,
                'brand': item.get('brandLogo', {}).get('logo') if item.get('brandLogo') else None,
                'reviewRating': reviewRating,
                'count_feedbacks': count_feedbacks,
                'basic_price': float(clean_text(mainState_price.get("price")[1].get('text'))),
                'product_price': float(clean_text(mainState_price.get("price")[0].get("text"))),
                'discount_percent': float(discount),
                'images': [
                    img.get('image').get("link")
                    for img in item.get('tileImage').get("items", [])
                ],
                'link': link,
                'store': 'ozon'
            }
            records.append(rec)
        except Exception as e:
            print(f"Error on item {link}: {e}")
    return records

async def parse_ozon(driver, page, query = "", sort="price"):
    return fetch_product_json(driver, page, query, sort)

def main(query: str):
    driver = create_stealth_driver()
    try:
        data = fetch_product_json(driver, 1, query, "pride_desk")

        with open("ozon_data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print("Данные успешно сохранены в ozon_data.json")
    except:
        print(NameError)
    finally:
        driver.quit()
        print("Driver is quit")

if __name__ == "__main__":
    main("футболка")
