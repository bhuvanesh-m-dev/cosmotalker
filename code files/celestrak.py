import requests
import json
from datetime import datetime, timezone, timedelta

def celestrak(group="stations", format="json"):
    url = f"https://celestrak.org/NORAD/elements/gp.php?GROUP={group}&FORMAT={format}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        
        # Convert EPOCH to IST (Indian Standard Time)
        ist_offset = timedelta(hours=5, minutes=30)
        for item in data:
            if "EPOCH" in item:
                try:
                    utc_time = datetime.strptime(item["EPOCH"], "%Y-%m-%dT%H:%M:%S.%fZ")
                except ValueError:
                    utc_time = datetime.strptime(item["EPOCH"], "%Y-%m-%dT%H:%M:%S.%f")
                ist_time = utc_time.replace(tzinfo=timezone.utc) + ist_offset
                item["EPOCH_IST"] = ist_time.strftime("%d/%m/%Y %H:%M:%S IST")
        
        return json.dumps(data, indent=4)  # Return JSON string
    
    return json.dumps({"error": f"Failed to fetch data, status code: {response.status_code}"}, indent=4)
