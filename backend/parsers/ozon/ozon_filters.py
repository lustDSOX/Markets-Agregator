import os
import re
import json
from typing import Any, Dict, List, Optional
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from ..driver_utils import create_stealth_driver

def _filters_state(ozon_json: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    ws = ozon_json.get("widgetStates", {})
    for k, v in ws.items():
        if k.startswith("filtersDesktop"):
            return json.loads(v) if isinstance(v, str) else v
    return None

def _coerce_id(val: Any):
    if isinstance(val, str):
        s = val.strip()
        if ";" in s or s == "":
            return val
        if s.lstrip("-").isdigit():
            try:
                return int(s)
            except:
                return val
        return val
    try:
        return int(val)
    except:
        return val

def _parse_delivery_hours(label: str) -> Optional[int]:
    if not label:
        return None
    t = label.lower().strip()

    if "неважн" in t:
        return None

    if "сегодня" in t:
        return 24
    if "завтра" in t:
        return 48

    m = re.search(r"(?:от\s*)?(\d+)\s*час", t)
    if m:
        return int(m.group(1))

    m = re.search(r"до\s*(\d+)\s*д(ень|ня|ней)", t)
    if m:
        return int(m.group(1)) * 24

    m = re.search(r"до\s*(\d+)\s*сут", t)
    if m:
        return int(m.group(1)) * 24

    m = re.search(r"(\d+)\s*час", t)
    if m:
        return int(m.group(1))

    return None

def extract_ozon_filters(ozon_json: Dict[str, Any]) -> Dict[str, Any]:
    """
    Возвращает:
    {
      "base": {
        "price": {"name", "key":"currency_price", "min", "max},
        "delivery": {
            "name", "key":"delivery",
            "minTime", "maxTime",           # в часах
            "items": [                      # сохраняем все опции с исходным key
                {"id": <orig key>, "name": <label>, "hours": <int|None>}
            ]
        }
      },
      "current": [
        # обычные фильтры, булевые как toggle, у 'show all' -> fullKey = <orig key>
      ]
    }
    """
    state = _filters_state(ozon_json)
    if not state:
        return {"base": {}, "current": []}

    base: Dict[str, Any] = {}
    current: List[Dict[str, Any]] = []

    for section in state.get("sections", []):
        for f in section.get("filters", []):
            ftype = f.get("type")
            fkey  = f.get("key")

            # price
            if ftype == "multipleRangesFilter" and fkey == "currency_price":
                rng = (f.get("multipleRangesFilter") or {}).get("rangeFilter") or {}
                title = (rng.get("title") or "Цена").strip()
                base["price"] = {
                    "name": title,
                    "key": fkey,
                    "min": rng.get("minValue"),
                    "max": rng.get("maxValue")
                }
                continue

            if ftype == "checkboxesFilter" and fkey == "delivery":
                cfg = f.get("checkboxesFilter") or {}
                title = (cfg.get("title") or fkey or "").strip()

                items_raw = []
                for sec2 in cfg.get("sections", []):
                    for it in sec2.get("items", []):
                        label = (it.get("title") or {}).get("text") or ""
                        item_key = it.get("key")
                        hours = _parse_delivery_hours(label)

                hours_list = [it["hours"] for it in items_raw if isinstance(it["hours"], int)]
                base["delivery"] = {
                    "name": title,
                    "key": fkey,
                    "minTime": min(hours_list) if hours_list else None,
                    "maxTime": max(hours_list) if hours_list else None,
                }
                continue

            # toggle
            if ftype == "boolFilter":
                title = (f.get("boolFilter", {}).get("title") or fkey or "").strip()
                current.append({
                    "name": title,
                    "key": fkey,
                    "type": "toggle",
                    "items": [{"id": 1, "name": "Да"}],
                })
                continue

            # checkbox/radio
            if ftype == "checkboxesFilter":
                cfg = f.get("checkboxesFilter") or {}
                title = (cfg.get("title") or fkey or "").strip()
                items = []
                for sec2 in cfg.get("sections", []):
                    for it in sec2.get("items", []):
                        text = (it.get("title") or {}).get("text")
                        if text:
                            items.append({"id": _coerce_id(it.get("key")), "name": text})

                block = {
                    "name": title,
                    "key": fkey,
                    "maxselect": 1 if (cfg.get("isRadio") or f.get("isRadio")) else 20,
                    "items": items
                }
                if (cfg.get("openingButtons") or {}).get("showAllButton"):
                    block["fullKey"] = fkey
                current.append(block)
                continue

            # color
            if ftype == "colorFilter":
                cfg = f.get("colorFilter") or {}
                title = (cfg.get("title") or fkey or "").strip()
                icons = f.get("colorIcons") or cfg.get("colorIcons") or []
                items = [{"id": _coerce_id(c.get("key")), "name": c.get("description") or ""} for c in icons]
                block = {
                    "name": title,
                    "key": fkey,
                    "maxselect": 20,
                    "items": items
                }
                if (cfg.get("openingButtons") or {}).get("showAllButton"):
                    block["fullKey"] = fkey
                current.append(block)
                continue

    return {"base": base, "current": current}



def ozon_all_filters(driver, query):
    url = f"https://www.ozon.ru/api/entrypoint-api.bx/page/json/v2?url=/modal/allFilters/category/odezhda-obuv-i-aksessuary-7500?text={query}"
    
    script = f"""
        return fetch("{url}", {{
            method: 'GET',
            credentials: 'include'
        }}).then(res => res.text());
    """
    raw_response = driver.execute_script(script)
    json_data = json.loads(raw_response)
    data = extract_ozon_filters(json_data)
    return data

def ozon_filter(driver, key, query):
    url = "https://www.ozon.ru/api/composer-api.bx/_action/getCatalogFilterValues"
    payload = {
        "baseLink": f"/category/odezhda-obuv-i-aksessuary-7500/?category_was_predicted=true&deny_category_prediction=true&from_global=true&text={query}",
        "isOpened": "true",
        "key": key
    }

    script = f"""
        return fetch("{url}", {{
            method: 'POST',
            credentials: 'include',
            headers: {{
                'Content-Type': 'application/json'
            }},
            body: JSON.stringify({json.dumps(payload)})
        }}).then(res => res.text());
    """

    raw_response = driver.execute_script(script)
    json_data = json.loads(raw_response)
    data = json_data.get("sections")[0]
    data = data.get("items")
    data = [
        {
            "id": int(item["key"]),
            "name": item["title"]["text"]
        }
        for item in data
    ]
    return data

async def get_ozon_all_filters(driver, query):
    return ozon_all_filters(driver, query)

def main(query: str):
    driver = create_stealth_driver()
    try:
        # data = ozon_all_filters(driver, query)
        data = ozon_filter(driver, "type", query)

        with open("ozon_type.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"Данные успешно сохранены в ozon_{query}.json")
    except:
        print(NameError)
    finally:
        driver.quit()
        print("Driver is quit")

if __name__ == "__main__":
    main("футболка")
