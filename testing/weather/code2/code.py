# weatherapi_client.py
import os
import requests
from datetime import datetime
from typing import Optional, Dict, Any

BASE_URL = "https://api.weatherapi.com/v1"

class WeatherAPIError(Exception):
    pass

def _get_api_key() -> str:
    key = os.getenv("WEATHERAPI_KEY")
    if not key:
        raise WeatherAPIError(
            "Missing WEATHERAPI_KEY environment variable. Get a free key at https://www.weatherapi.com/"
        )
    return key

def fetch_current_weather(location: str, aq_i: bool = False, lang: str = "en") -> Dict[str, Any]:
    """
    Fetch current weather for `location`.
    `location` can be: city name, "city,country", postal code, or "lat,lon".
    Returns parsed JSON as Python dict.
    """
    key = _get_api_key()
    endpoint = f"{BASE_URL}/current.json"
    params = {
        "key": key,
        "q": location,
        "aqi": "yes" if aq_i else "no",
        "lang": lang
    }

    try:
        resp = requests.get(endpoint, params=params, timeout=10)
    except requests.RequestException as e:
        raise WeatherAPIError(f"Network error when calling WeatherAPI: {e}") from e

    if resp.status_code != 200:
        # WeatherAPI returns JSON errors; include them for debugging
        try:
            err = resp.json()
        except Exception:
            err = {"status_code": resp.status_code, "text": resp.text}
        raise WeatherAPIError(f"WeatherAPI returned error: {err}")

    return resp.json()

def fetch_forecast(location: str, days: int = 3, hourly: bool = False, lang: str = "en") -> Dict[str, Any]:
    """
    Fetch forecast for `location` for up to allowed days (free tier usually supports several days).
    `days` default 3. Use hourly=True to include hourly details.
    """
    if days < 1 or days > 10:
        raise ValueError("days must be between 1 and 10 (endpoint limit may vary by plan).")

    key = _get_api_key()
    endpoint = f"{BASE_URL}/forecast.json"
    params = {
        "key": key,
        "q": location,
        "days": days,
        "aqi": "no",
        "alerts": "no",
        "lang": lang
    }

    try:
        resp = requests.get(endpoint, params=params, timeout=12)
    except requests.RequestException as e:
        raise WeatherAPIError(f"Network error when calling WeatherAPI: {e}") from e

    if resp.status_code != 200:
        try:
            err = resp.json()
        except Exception:
            err = {"status_code": resp.status_code, "text": resp.text}
        raise WeatherAPIError(f"WeatherAPI returned error: {err}")

    return resp.json()

# Helper to pretty-print a minimal summary for the current weather
def summarize_current(data: Dict[str, Any]) -> str:
    loc = data.get("location", {})
    cur = data.get("current", {})
    name = f"{loc.get('name','')}, {loc.get('country','')}"
    temp_c = cur.get("temp_c")
    condition = cur.get("condition", {}).get("text")
    wind_kph = cur.get("wind_kph")
    humidity = cur.get("humidity")
    last_updated = cur.get("last_updated")
    return (
        f"Location: {name}\n"
        f"Last updated: {last_updated}\n"
        f"Temperature: {temp_c} °C\n"
        f"Condition: {condition}\n"
        f"Wind: {wind_kph} kph\n"
        f"Humidity: {humidity}%\n"
    )

# Example usage (run as script)
if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python weatherapi_client.py <location>")
        print("Example: python weatherapi_client.py \"Chennai\"")
        sys.exit(1)

    loc = sys.argv[1]
    try:
        current = fetch_current_weather(loc)
        print(summarize_current(current))
    except WeatherAPIError as e:
        print("Error:", e)
