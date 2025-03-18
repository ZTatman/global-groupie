from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
cors = CORS(app, origins="*")

def build_query_params(request):
    """
    Build a dictionary of query parameters from a Flask request object.
    
    Args:
        request: Flask request object containing query parameters
        
    Returns:
        dict: Dictionary of non-None query parameters
    """
    params = {}
    for key, value in request.args.items():
        if value is not None:
            params[key] = value
    return params


@app.route("/")
def index():
    print("Server running on port 5000...")
    return "Server running on port 5000..."

@app.route("/api/flights", methods=["GET"])
def get_flights():
    """
    Fetch flight data from OpenSky Network API.
    
    Query parameters are passed directly to the OpenSky API.
    Common parameters include: lamin, lamax, lomin, lomax for bounding box.
    
    Returns:
        JSON response with flight data or error information
    """
    try:
        # Get query parameters
        params = build_query_params(request)
        
        # Make request to OpenSky API
        response = requests.get("https://opensky-network.org/api/states/all", params=params, timeout=10)
        
        # Check if request was successful
        response.raise_for_status()
        return jsonify(response.json())
        
    except requests.exceptions.Timeout:
        return jsonify({"error": "Request to OpenSky API timed out"}), 504
    
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Could not connect to OpenSky API"}), 502
    
    except requests.exceptions.HTTPError as e:
        # Handle specific HTTP errors from OpenSky API
        status_code = e.response.status_code
        error_message = f"OpenSky API error: {e.response.text}"
        return jsonify({"error": error_message}), status_code
    
    except Exception as e:
        # Catch any other unexpected errors
        app.logger.error(f"Unexpected error in get_flights: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
    