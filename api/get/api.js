// Cloudflare Worker script - Deploy to workers.dev
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const query = url.searchParams.get('q');
        const method = url.searchParams.get('method') || 'auto';
        
        // CORS headers
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Cache-Control': 'public, max-age=3600'
        };
        
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers });
        }
        
        if (!query) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'Missing "q" parameter',
                example: '/?q=jupiter',
                timestamp: new Date().toISOString()
            }), { headers, status: 400 });
        }
        
        try {
            // Cache for 1 hour
            const cacheKey = `cosmotalker:${query}:${method}`;
            const cached = await env.KV_NAMESPACE.get(cacheKey);
            
            if (cached) {
                return new Response(cached, { headers });
            }
            
            // Call your Python backend or use a cached response
            // For demo, return mock data (replace with actual API call)
            const mockData = {
                status: 'success',
                data: {
                    name: query.charAt(0).toUpperCase() + query.slice(1),
                    type: 'Planet',
                    distance_from_sun: 'Varies',
                    fun_fact: `Interesting facts about ${query}`
                },
                query: query,
                method: method,
                timestamp: new Date().toISOString(),
                source: 'cloudflare-worker'
            };
            
            const jsonResponse = JSON.stringify(mockData);
            
            // Cache the response
            await env.KV_NAMESPACE.put(cacheKey, jsonResponse, {
                expirationTtl: 3600
            });
            
            return new Response(jsonResponse, { headers });
            
        } catch (error) {
            return new Response(JSON.stringify({
                status: 'error',
                message: error.message,
                query: query
            }), { headers, status: 500 });
        }
    }
};
