import requests
import time
def wiki(topic):
    try:
        start=time.time()
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "query",
            "format": "json",
            "titles": topic,
            "prop": "extracts",
            "exintro": True,
            "explaintext": True,
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()  # Raises HTTPError for bad responses
        end=time.time()
        time_taken=end-start
        print("Summary fetched in",time_taken,"seconds")

        data = response.json()
        page = next(iter(data["query"]["pages"].values()))

        if "extract" in page and page["extract"]:
            print("\nSummary:\n", page["extract"])
        else:
            print(f"❌ No summary found for '{topic}'. Try another topic.")

    except requests.exceptions.Timeout:
        print("⏳ Request timed out. Please check your internet connection.")
    except requests.exceptions.RequestException as e:
        print(f"❗ Network error: {e}")
    except Exception as e:
        print(f"🚨 Unexpected error: {e}")
