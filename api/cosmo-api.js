/* ═══════════════════════════════════════════════════
   CosmoTalker Client-Side API
   Host at: http://bhuvanesh-m-dev.github.io/cosmotalker/api/cosmo-api.js
   Usage: Exposes global `CosmoAPI` to run Python in-browser
═══════════════════════════════════════════════════ */

window.CosmoAPI = (function() {
    let pyodidePromise = null;

    async function initPyodide() {
        // 1. Load Pyodide script if not present
        if (!window.loadPyodide) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js";
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        // 2. Initialize Pyodide
        const py = await window.loadPyodide();
        await py.loadPackage("micropip");

        // 3. Install CosmoTalker and create an execution wrapper
        await py.runPythonAsync(`
import sys, io, builtins, types, json
import micropip
await micropip.install(["cosmodb", "cosmotalker==2.62", "requests", "pytz"])

# Mock tkinter to prevent import errors in browser
sys.modules['tkinter'] = types.ModuleType('tkinter')
sys.modules['tkinter.messagebox'] = types.ModuleType('tkinter.messagebox')
sys.modules['tkinter.ttk'] = types.ModuleType('tkinter.ttk')
sys.modules['customtkinter'] = types.ModuleType('customtkinter')

import cosmotalker as ct

# Mock image preview so it doesn't crash the browser
class DummyImg:
    def __call__(self, *args, **kwargs):
        print("⚠️ Image preview is not available via the browser API.")
if hasattr(ct, 'img'):
    ct.img = DummyImg()

# Wrapper to execute CosmoTalker and capture printed outputs as JSON
def exec_api(code_str):
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    try:
        exec(code_str)
        output = sys.stdout.getvalue()
        return json.dumps({"status": "success", "data": output.strip()})
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})
    finally:
        sys.stdout = old_stdout
        `);
        return py;
    }

    // Helper to run code and parse the JSON result
    async function runCommand(command) {
        if (!pyodidePromise) {
            pyodidePromise = initPyodide();
        }
        const py = await pyodidePromise;
        const resultJSON = await py.runPythonAsync(`exec_api("""${command}""")`);
        return JSON.parse(resultJSON);
    }

    // Expose the API Methods
    return {
        search: (query) => runCommand(`ct.search('${query}')`),
        planetInfo: (planet) => runCommand(`ct.planet_info('${planet}')`),
        getFunFact: () => runCommand(`ct.get_fun_fact()`),
        spacex: () => runCommand(`ct.spacex()`),
        celestrak: () => runCommand(`ct.celestrak()`),
        wiki: (topic) => runCommand(`ct.wiki('${topic}')`),
        execute: (customCode) => runCommand(customCode) // Advanced usage
    };
})();