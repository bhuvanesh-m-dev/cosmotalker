# 🌌 CosmoTalker Browser API

Welcome to the **CosmoTalker Client-Side API**. This lightweight JavaScript SDK allows any web developer to run the powerful Python-based CosmoTalker library directly inside their users' browsers—**no backend required!**

Powered by [Pyodide](https://pyodide.org/), this API fetches real-time space data, planetary facts, and SpaceX launch info natively in the browser via WebAssembly.

## 🚀 Quick Start

**1. Include the Script**  
Add this to your HTML `<head>`:
```html
<script src="https://bhuvanesh-m-dev.github.io/cosmotalker/api/cosmo-api.js"></script>
```

**2. Call the API**  
All methods return a Promise that resolves to JSON data.
```javascript
async function getSpaceData() {
    const response = await CosmoAPI.planetInfo("Saturn");
    if (response.status === "success") {
        console.log(response.data);
    } else {
        console.error(response.message);
    }
}
```

## 📚 Available Methods
- `CosmoAPI.search(query)`
- `CosmoAPI.planetInfo(planetName)`
- `CosmoAPI.get(topic)`
- `CosmoAPI.getFunFact()`
- `CosmoAPI.spacex()`
- `CosmoAPI.celestrak()`
- `CosmoAPI.wiki(topic)`
- `CosmoAPI.execute(pythonCode)`

## 📖 Documentation & Demo

- **Documentation**: Open `how-to-use-the-CosmoTalker-api.html` in your browser for a full integration guide.
- **Interactive Demo**: Open `index.html` to test the API directly from a graphical interface.
- **Chatbot Demo**: Open `space-chat.html` to see a space-themed chatbot powered by CosmoTalker!
