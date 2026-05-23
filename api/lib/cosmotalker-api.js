/**
 * CosmoTalker API Client
 * High-performance client using Web Worker
 */

class CosmoTalkerClient {
    constructor(apiUrl = 'https://bhuvanesh-m-dev.github.io/cosmotalker/api/get/') {
        this.apiUrl = apiUrl;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Direct fetch API call (no worker)
     */
    async fetchQuery(query, method = 'auto') {
        try {
            const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(query)}&method=${method}`);
            const text = await response.text();
            
            // Extract JSON from response
            const preMatch = text.match(/<pre>([\s\S]*?)<\/pre>/);
            if (preMatch) {
                return JSON.parse(preMatch[1]);
            }
            
            throw new Error('Invalid response format');
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                query: query
            };
        }
    }

    /**
     * Get planet information with caching
     */
    async getPlanet(planetName, useCache = true) {
        const cacheKey = `planet:${planetName}`;
        
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        const result = await this.fetchQuery(planetName, 'planet_info');
        
        if (useCache && result.status === 'success') {
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
        }
        
        return result;
    }

    /**
     * Search space objects
     */
    async search(searchTerm, useCache = true) {
        const cacheKey = `search:${searchTerm}`;
        
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }
        
        const result = await this.fetchQuery(searchTerm, 'search');
        
        if (useCache && result.status === 'success') {
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
        }
        
        return result;
    }

    /**
     * Batch multiple queries
     */
    async batchQueries(queries) {
        const promises = queries.map(q => this.fetchQuery(q.query, q.method));
        return Promise.all(promises);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmoTalkerClient;
}

// Browser global
if (typeof window !== 'undefined') {
    window.CosmoTalkerAPI = CosmoTalkerClient;
}
