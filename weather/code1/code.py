import requests
import json

def get_weather_report(api_key, location):
    """
    Retrieves the current weather report for a given location using weatherapi.com.

    Args:
        api_key (str): Your free API key from weatherapi.com.
        location (str): The name of the city (e.g., "London", "New York").

    Returns:
        dict: A dictionary containing the weather data if the request is successful,
              otherwise a dictionary with an error message.
    """
    base_url = "http://api.weatherapi.com/v1/current.json"
    params = {
        "key": api_key,
        "q": location
    }

    try:
        # Send a GET request to the WeatherAPI
        response = requests.get(base_url, params=params)
        
        # Raise an exception for bad status codes (4xx or 5xx)
        response.raise_for_status()

        # Parse the JSON response
        weather_data = response.json()
        
        # Extract relevant information
        current_weather = weather_data.get("current", {})
        location_info = weather_data.get("location", {})

        if not current_weather or not location_info:
            return {"error": "Could not retrieve complete weather data."}

        # Structure the report
        report = {
            "location": location_info.get("name"),
            "region": location_info.get("region"),
            "country": location_info.get("country"),
            "localtime": location_info.get("localtime"),
            "temperature_c": current_weather.get("temp_c"),
            "temperature_f": current_weather.get("temp_f"),
            "condition": current_weather.get("condition", {}).get("text"),
            "wind_kph": current_weather.get("wind_kph"),
            "humidity": current_weather.get("humidity"),
            "last_updated": current_weather.get("last_updated")
        }
        
        return report

    except requests.exceptions.HTTPError as http_err:
        # Handle HTTP errors (e.g., 401 for invalid API key, 400 for bad location)
        if response.status_code == 401:
            return {"error": "Authentication error. Please check your API key."}
        elif response.status_code == 400:
             return {"error": f"Bad request. The location '{location}' might not be found."}
        else:
            return {"error": f"HTTP error occurred: {http_err}"}
    except requests.exceptions.RequestException as req_err:
        # Handle other request errors (e.g., network issues)
        return {"error": f"An error occurred: {req_err}"}
    except json.JSONDecodeError:
        return {"error": "Failed to decode the response from the server."}

# --- Example Usage ---
if __name__ == "__main__":
    # IMPORTANT: Replace "YOUR_API_KEY" with the actual key you get from weatherapi.com
    API_KEY = "YOUR_API_KEY" 
    
    # Check if the API key has been replaced
    if API_KEY == "YOUR_API_KEY":
        print("Please replace 'YOUR_API_KEY' with your actual API key from weatherapi.com")
    else:
        location_to_check = "Paris"
        weather_report = get_weather_report(API_KEY, location_to_check)

        # Print the report in a readable format
        if "error" in weather_report:
            print(f"Error: {weather_report['error']}")
        else:
            print("-" * 30)
            print(f"Weather Report for {weather_report['location']}, {weather_report['country']}")
            print("-" * 30)
            print(f"Temperature: {weather_report['temperature_c']}°C / {weather_report['temperature_f']}°F")
            print(f"Condition: {weather_report['condition']}")
            print(f"Wind Speed: {weather_report['wind_kph']} kph")
            print(f"Humidity: {weather_report['humidity']}%")
            print(f"Local Time: {weather_report['localtime']}")
            print(f"Last Updated: {weather_report['last_updated']}")
            print("-" * 30)
