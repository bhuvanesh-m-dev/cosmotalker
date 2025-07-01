import requests
import webbrowser
import os

def fetch_nasa_apod(api_key, date=None):
    """
    Fetches the Astronomy Picture of the Day (APOD) from NASA's API.
    
    Parameters:
        api_key (str): Your NASA API key.
        date (str, optional): The date in YYYY-MM-DD format for which APOD is requested.
    
    Returns:
        dict: The JSON response containing APOD details.
    """
    url = f"https://api.nasa.gov/planetary/apod?api_key={api_key}"
    if date:
        url += f"&date={date}"
    
    try:
        response = requests.get(url)
        print(f"Response Status Code: {response.status_code}") 
        
        if response.status_code == 200:
            data = response.json()
            print(f"NASA APOD Response: {data}")  
            return data
        else:
            print("Failed to retrieve APOD. Check API key and date format.")
            return None
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from NASA API: {e}")
        return None

def apod(api_key="kdtw***************************283Dj", date=None):
    """
    Fetches APOD data for a given date (or today's APOD if no date is provided).
    Opens the APOD URL in a web browser if available.
    """
    if not api_key or api_key == "bhuvanesh API":
        api_key = os.getenv("NASA_API_KEY")  
        if not api_key:
            print("Error: No API key provided. Set an API key via function argument or environment variable.")
            return None
    
    apod_data = fetch_nasa_apod(api_key, date)
    
    if not apod_data:
        print("No data received from NASA API.")
        return None
    
    if "url" in apod_data:
        print(f"Opening URL: {apod_data['url']}")  
        success = webbrowser.open(apod_data["url"])
        
        if not success:
            print(f"Failed to open the web browser. Please open this link manually: {apod_data['url']}")
        
        return apod_data
    
    print("No image URL found in the API response.")
    return None
