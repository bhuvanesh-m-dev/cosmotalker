from flask import Flask, request, jsonify
from flask_cors import CORS
import cosmotalker as ct
from datetime import datetime

app = Flask(__name__)
CORS(app)

# This is the MAIN API endpoint - fix the route
@app.route('/api/get', methods=['GET'])
def get_planet_data():
    query = request.args.get('q')
    
    # Debug logging
    print(f"Request received for query: {query}")
    
    if not query:
        return jsonify({
            'status': 'error',
            'message': 'Missing "q" parameter. Use: ?q=planet_name',
            'example': '/api/get?q=mars',
            'timestamp': datetime.now().isoformat()
        }), 400
    
    try:
        # Call CosmoTalker's get function
        result = ct.get(query)
        
        return jsonify({
            'status': 'success',
            'data': result,
            'query': query,
            'version': '2.62',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'query': query,
            'timestamp': datetime.now().isoformat()
        }), 500

# Home page
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'name': 'CosmoTalker API',
        'description': 'Get information about planets, stars, and space objects',
        'endpoints': {
            '/api/get': {
                'method': 'GET',
                'parameters': {'q': 'planet_name (required)'},
                'example': '/api/get?q=jupiter'
            }
        },
        'version': '2.62'
    })

# Health check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
