import requests
import time
import json

def ask_cosmotalker(question, max_retries=5, initial_wait=10):
    """
    Query CosmoTalker API with extended retry logic
    """
    url = "https://bhuvanesh-m-dev.github.io/cosmotalker/api/get/"
    params = {"q": question}
    
    print(f"🔭 Querying CosmoTalker: '{question}'")
    print("⏳ First request may take 30-60 seconds (loading Pyodide)...")
    
    for attempt in range(max_retries):
        try:
            wait_time = initial_wait * (attempt + 1)
            print(f"\n📡 Attempt {attempt + 1}/{max_retries} (waiting {wait_time}s)...")
            time.sleep(wait_time)
            
            response = requests.get(url, params=params, timeout=45)
            
            # Try to parse JSON from response
            try:
                data = response.json()
                if data.get('success'):
                    print("✅ Success!")
                    return data
                elif data.get('error'):
                    print(f"⚠️ API Error: {data['error']}")
                    return data
            except json.JSONDecodeError:
                # Still initializing
                if 'Initializing' in response.text or 'Loading' in response.text:
                    print("🔄 API still initializing...")
                    continue
                else:
                    # Try to extract from HTML
                    import re
                    json_match = re.search(r'<pre>({.*})</pre>', response.text, re.DOTALL)
                    if json_match:
                        data = json.loads(json_match.group(1))
                        return data
            
        except requests.exceptions.Timeout:
            print(f"⏰ Timeout on attempt {attempt + 1}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    return {
        "success": False,
        "error": "API failed to initialize after multiple retries",
        "suggestion": "Try accessing the URL directly in a browser first to warm up the API"
    }

# Use with warm-up
def warm_up_api():
    """First request to trigger Pyodide loading"""
    print("🔥 Warming up API (this will take ~30 seconds)...")
    return ask_cosmotalker("earth", max_retries=1, initial_wait=2)

# Main execution
if __name__ == "__main__":
    # Optional: Warm up first
    # warm_up_api()
    
    # Your actual query
    result = ask_cosmotalker("venus")
    
    print("\n" + "="*50)
    if result.get("success"):
        print("✅ ANSWER:")
        print(result.get("result", result.get("answer", "No result field")))
    else:
        print("❌ ERROR:", result.get("error"))
        if result.get("suggestion"):
            print("💡", result.get("suggestion"))
    print("="*50)
