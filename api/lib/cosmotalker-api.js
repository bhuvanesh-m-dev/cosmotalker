/**
 * CosmoTalker API Wrapper
 * Provides a clean interface to the CosmoTalker API
 */

class CosmoTalkerAPI {
    constructor(baseURL = 'https://bhuvanesh-m-dev.github.io/cosmotalker/api/get/') {
        this.baseURL = baseURL;
    }

    /**
     * Query the CosmoTalker API
     * @param {string} query - Planet name, star name, or search term
     * @returns {Promise<Object>} JSON response
     */
    async query(query) {
        try {
            const response = await fetch(`${this.baseURL}?q=${encodeURIComponent(query)}`);
            const text = await response.text();
            
            // Extract JSON from the HTML response
            const jsonMatch = text.match(/<pre>([\s\S]*?)<\/pre>/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
            }
            return { status: 'error', message: 'Invalid response format' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    /**
     * Get planet information
     * @param {string} planetName 
     * @returns {Promise<Object>}
     */
    async getPlanet(planetName) {
        return this.query(planetName);
    }

    /**
     * Search space objects
     * @param {string} searchTerm 
     * @returns {Promise<Object>}
     */
    async search(searchTerm) {
        return this.query(searchTerm);
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmoTalkerAPI;
}
