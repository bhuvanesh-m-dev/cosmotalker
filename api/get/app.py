from flask import Flask, request, jsonify
from flask_cors import CORS
import cosmotalker as ct
import json

app = Flask(__name__)
CORS(app)  # This allows anyone to call your API

@app.route('/api/get', methods=['GET'])
def get_planet_data():
    # Get the 'q' parameter from URL
    query = request.args.get('q')
    
    # If no query parameter, return error
    if not query:
        return jsonify({
            'status': 'error',
            'message': 'Missing "q" parameter. Use: ?q=planet_name',
            'example': '/api/get?q=mars',
            'timestamp': __import__('datetime').datetime.now().isoformat()
        }), 400
    
    try:
        # Call CosmoTalker's get function
        result = ct.get(query)
        
        # Return pure JSON response
        return jsonify({
            'status': 'success',
            'data': result,
            'query': query,
            'version': '2.62',
            'timestamp': __import__('datetime').datetime.now().isoformat()
        })
        
    except Exception as e:
        # Return error as JSON
        return jsonify({
            'status': 'error',
            'message': str(e),
            'query': query,
            'timestamp': __import__('datetime').datetime.now().isoformat()
        }), 500

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

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'timestamp': __import__('datetime').datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)