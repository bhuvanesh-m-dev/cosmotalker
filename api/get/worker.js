/**
 * CosmoTalker Web Worker
 * Keeps Pyodide running persistently for faster API responses
 * Handles stateless JSON API calls
 */

let pyodide = null;
let isInitialized = false;
let initializationPromise = null;
let pendingRequests = new Map();
let requestId = 0;

// Initialize Pyodide when worker starts
initializePyodide();

async function initializePyodide() {
    if (initializationPromise) return initializationPromise;
    
    initializationPromise = (async () => {
        self.postMessage({ 
            type: 'status', 
            status: 'initializing', 
            message: 'Loading Pyodide...' 
        });

        try {
            // Import scripts (worker doesn't have DOM, so we need to import dynamically)
            importScripts('https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js');
            
            pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/",
                stdout: (text) => {
                    self.postMessage({ 
                        type: 'log', 
                        level: 'stdout', 
                        message: text 
                    });
                },
                stderr: (text) => {
                    self.postMessage({ 
                        type: 'log', 
                        level: 'stderr', 
                        message: text 
                    });
                }
            });

            self.postMessage({ 
                type: 'status', 
                status: 'loading_packages', 
                message: 'Loading micropip...' 
            });

            await pyodide.loadPackage("micropip");
            const micropip = pyodide.pyimport("micropip");

            self.postMessage({ 
                type: 'status', 
                status: 'installing', 
                message: 'Installing CosmoTalker...' 
            });

            // Install CosmoTalker and dependencies
            await micropip.install(["cosmodb", "cosmotalker==2.62", "requests", "pytz"]);

            self.postMessage({ 
                type: 'status', 
                status: 'configuring', 
                message: 'Configuring Python environment...' 
            });

            // Setup Python environment with mocked GUI modules
            await pyodide.runPythonAsync(`
import sys
import types
import json
from typing import Any, Dict, Union

# Mock tkinter and other GUI modules for browser environment
mock_modules = ['tkinter', 'tkinter.messagebox', 'tkinter.ttk', 'customtkinter']
for module in mock_modules:
    sys.modules[module] = types.ModuleType(module)

import cosmotalker as ct

class CosmoTalkerAPI:
    """API wrapper for CosmoTalker that returns JSON-serializable data"""
    
    @staticmethod
    def get_data(query: str, method: str = 'auto') -> Dict[str, Any]:
        """
        Universal method to get cosmic data
        
        Args:
            query: Search term (planet name, star name, etc.)
            method: 'auto', 'planet_info', 'search', 'get', 'fun_fact'
        
        Returns:
            Dictionary with status and data
        """
        result = None
        used_method = method
        
        try:
            if method == 'auto' or method == 'planet_info':
                if hasattr(ct, 'planet_info'):
                    result = ct.planet_info(query)
                    if result:
                        used_method = 'planet_info'
            
            if (not result or result == {}) and (method == 'auto' or method == 'search'):
                if hasattr(ct, 'search'):
                    result = ct.search(query)
                    if result:
                        used_method = 'search'
            
            if (not result or result == {}) and (method == 'auto' or method == 'get'):
                if hasattr(ct, 'get'):
                    result = ct.get(query)
                    if result:
                        used_method = 'get'
            
            if (not result or result == {}) and (method == 'auto' or method == 'fun_fact'):
                if hasattr(ct, 'get_fun_fact'):
                    result = ct.get_fun_fact(query)
                    if result:
                        used_method = 'fun_fact'
            
            if not result or result == {}:
                return {
                    'status': 'error',
                    'message': f'No data found for "{query}"',
                    'query': query,
                    'suggestions': ['Try: Earth, Mars, Jupiter, Saturn, black hole, Andromeda']
                }
            
            # Convert non-serializable objects
            if hasattr(result, '__dict__'):
                result = result.__dict__
            
            return {
                'status': 'success',
                'data': result,
                'query': query,
                'method': used_method,
                'timestamp': str(__import__('datetime').datetime.now())
            }
        
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e),
                'query': query,
                'method': method
            }
    
    @staticmethod
    def get_planet_list() -> Dict[str, Any]:
        """Get list of available planets"""
        try:
            if hasattr(ct, 'get_all_planets'):
                planets = ct.get_all_planets()
                return {
                    'status': 'success',
                    'data': planets,
                    'count': len(planets) if planets else 0
                }
            return {
                'status': 'error',
                'message': 'get_all_planets not available'
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    @staticmethod
    def validate_query(query: str) -> Dict[str, Any]:
        """Validate if query will return results without full execution"""
        try:
            # Quick validation
            if not query or len(query.strip()) < 2:
                return {
                    'status': 'error',
                    'message': 'Query too short (minimum 2 characters)',
                    'valid': False
                }
            
            return {
                'status': 'success',
                'valid': True,
                'query': query
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

# Initialize API
api = CosmoTalkerAPI()
print("✅ CosmoTalker API ready in worker")
print(f"📦 CosmoTalker version: {getattr(ct, '__version__', 'unknown')}")
            `);

            isInitialized = true;
            self.postMessage({ 
                type: 'status', 
                status: 'ready', 
                message: 'API ready',
                ready: true 
            });

        } catch (error) {
            self.postMessage({ 
                type: 'error', 
                status: 'failed', 
                message: error.message 
            });
            throw error;
        }
    })();
    
    return initializationPromise;
}

// Handle incoming API requests
self.onmessage = async function(event) {
    const { id, type, payload } = event.data;
    
    if (!isInitialized) {
        await initializePyodide();
    }
    
    try {
        switch(type) {
            case 'query':
                const result = await handleQuery(payload);
                self.postMessage({ id, type: 'response', result });
                break;
                
            case 'batch':
                const batchResults = await handleBatchQuery(payload);
                self.postMessage({ id, type: 'response', result: batchResults });
                break;
                
            case 'validate':
                const validation = await validateQuery(payload);
                self.postMessage({ id, type: 'response', result: validation });
                break;
                
            case 'health':
                self.postMessage({ 
                    id, 
                    type: 'response', 
                    result: {
                        status: 'healthy',
                        initialized: isInitialized,
                        pyodide: pyodide !== null
                    }
                });
                break;
                
            default:
                self.postMessage({ 
                    id, 
                    type: 'error', 
                    message: `Unknown request type: ${type}` 
                });
        }
    } catch (error) {
        self.postMessage({ 
            id, 
            type: 'error', 
            message: error.message 
        });
    }
};

async function handleQuery(payload) {
    const { query, method = 'auto' } = payload;
    
    if (!query || query.trim() === '') {
        return {
            status: 'error',
            message: 'Missing "query" parameter',
            timestamp: new Date().toISOString()
        };
    }
    
    try {
        const result = await pyodide.runPythonAsync(`
import json
result = api.get_data(${JSON.stringify(query)}, ${JSON.stringify(method)})
json.dumps(result)
        `);
        
        return JSON.parse(result);
    } catch (error) {
        return {
            status: 'error',
            message: error.message,
            query: query
        };
    }
}

async function handleBatchQuery(queries) {
    if (!Array.isArray(queries)) {
        return {
            status: 'error',
            message: 'Batch queries must be an array'
        };
    }
    
    const results = [];
    for (const query of queries) {
        const result = await handleQuery({ query: query.query, method: query.method });
        results.push(result);
    }
    
    return {
        status: 'success',
        results: results,
        count: results.length
    };
}

async function validateQuery(payload) {
    const { query } = payload;
    
    try {
        const result = await pyodide.runPythonAsync(`
import json
result = api.validate_query(${JSON.stringify(query)})
json.dumps(result)
        `);
        
        return JSON.parse(result);
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        };
    }
}
