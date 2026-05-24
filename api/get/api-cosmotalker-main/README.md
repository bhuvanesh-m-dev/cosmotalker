# 🌌 CosmoTalker API

Pure JSON API for cosmic data – Get information about planets, stars, and space objects instantly. Powered by CosmoTalker v2.62.

## 🚀 Base URL

```text
https://cosmotalker.onrender.com
```

## 📡 API Endpoint

**GET** `/api/get`

Returns information about a celestial body or space object.

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `q` | string | ✅ Yes | Planet name, star name, or space object |

### Example Request

```text
https://cosmotalker.onrender.com/api/get?q=jupiter
```

### Example Success Response

```json
{
  "status": "success",
  "data": "Jupiter is the largest planet in our solar system...",
  "query": "jupiter",
  "version": "2.62",
  "timestamp": "2026-05-24T10:30:00.000Z"
}
```

### Example Error Response

```json
{
  "status": "error",
  "message": "No data found for 'invalid'",
  "query": "invalid",
  "timestamp": "2026-05-24T10:30:00.000Z"
}
```

## 📚 Usage Examples

### cURL

```bash
curl "https://cosmotalker.onrender.com/api/get?q=saturn"
```

### Python

```python
import requests

response = requests.get("https://cosmotalker.onrender.com/api/get?q=mars")
data = response.json()
print(data["data"])
```

### JavaScript

```javascript
fetch("https://cosmotalker.onrender.com/api/get?q=jupiter")
  .then(res => res.json())
  .then(data => console.log(data.data));
```

### Node.js (axios)

```javascript
const axios = require("axios");

async function getPlanet() {
  const response = await axios.get("https://cosmotalker.onrender.com/api/get?q=earth");
  console.log(response.data.data);
}
getPlanet();
```

### PHP

```php
<?php
$data = file_get_contents("https://cosmotalker.onrender.com/api/get?q=venus");
$result = json_decode($data, true);
echo $result['data'];
?>
```

## 🧪 Test Live Endpoints

| Query | URL |
|---|---|
| Mars | [cosmotalker.onrender.com/api/get?q=mars](https://cosmotalker.onrender.com/api/get?q=mars) |
| Jupiter | [cosmotalker.onrender.com/api/get?q=jupiter](https://cosmotalker.onrender.com/api/get?q=jupiter) |
| Saturn | [cosmotalker.onrender.com/api/get?q=saturn](https://cosmotalker.onrender.com/api/get?q=saturn) |
| Earth | [cosmotalker.onrender.com/api/get?q=earth](https://cosmotalker.onrender.com/api/get?q=earth) |

## 🌍 Supported Queries

- **Planets:** Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
- **Stars:** Sun, Sirius, Betelgeuse, etc.
- **Galaxies:** Milky Way, Andromeda
- **Space Objects:** Black hole, Nebula, Moon

## ⚙️ Technical Details

| Item | Value |
|---|---|
| Framework | Flask |
| Library | CosmoTalker v2.62 |
| Output Format | Pure JSON |
| CORS | Enabled (call from any domain) |
| Hosting | Render.com |

## ⏱️ Performance Note

Render's free tier sleeps after 15 minutes of inactivity:

- **First request after sleep:** ~15-30 seconds (wake-up)
- **Subsequent requests:** ~200-500ms

For production use, consider adding a free uptime monitor (like UptimeRobot) to keep it awake.

## 🎯 Response Format

All responses follow this structure:

```json
{
  "status": "success|error",
  "data": "The requested information",
  "query": "your query",
  "version": "2.62",
  "timestamp": "ISO 8601 timestamp"
}
```

## 📦 Install CosmoTalker Locally

Want to use CosmoTalker directly in your Python project?

```bash
pip install cosmotalker==2.62
```

```python
import cosmotalker as ct
print(ct.get("jupiter"))
```

## 🤝 Support

- **GitHub:** [bhuvanesh-m-dev/cosmotalker](https://github.com/bhuvanesh-m-dev/cosmotalker)
- **PyPI:** [cosmotalker](https://pypi.org/project/cosmotalker/)

## 📄 License

MIT License - Free for personal and commercial use

Made with ❤️ by CosmoTools | GitHub
