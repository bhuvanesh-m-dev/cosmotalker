import requests
import json
from datetime import datetime
import pytz 

def spacex():

    response = requests.get("https://api.spacexdata.com/v4/launches/upcoming")

    if response.status_code == 200:
        data = response.json()
        ist = pytz.timezone("Asia/Kolkata") 
        formatted_data = []
        for launch in data:
            details = "\nLaunch Details:"
            for key, value in launch.items():
                if value:  
                    if key == "date_utc":
                        
                        utc_time = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
                        ist_time = utc_time.replace(tzinfo=pytz.utc).astimezone(ist)
                        value = ist_time.strftime("%Y-%m-%d %I:%M %p IST")  
                        key = "Launch Date & Time (IST)"

                    details += f"\n{key}: {value}"

            formatted_data.append(details)

        return "\n\n".join(formatted_data)
    else:
        return "Failed to fetch SpaceX data."
