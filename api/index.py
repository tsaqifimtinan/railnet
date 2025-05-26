from flask import Flask, jsonify, request, Response
import heapq
import json
from typing import Dict, List, Tuple
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes with additional settings for Vercel
CORS(app, resources={r"/api/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})

# Jakarta MRT Network Graph (matching your frontend schedule)
STATIONS = {
    # Blue Line (North-South) - matching your schedule page
    'LEB': 'Lebak Bulus Grab',
    'FTM': 'Fatmawati', 
    'CPR': 'Cipete Raya',
    'HJN': 'Haji Nawi',
    'BLA': 'Blok A',
    'BLM': 'Blok M BCA',
    'ASN': 'ASEAN',
    'SNY': 'Senayan',
    'IST': 'Istora Mandiri',
    'BKS': 'Bendungan Hilir',
    'STF': 'Setiabudi Astra',
    'DKT': 'Dukuh Atas BNI',
    'BNR': 'Bundaran HI',
    
    # Red Line (East Branch) - matching your schedule
    'TAN': 'Taman Anggrek',
    'CEN': 'Central Park', 
    'TAD': 'Tanjung Duren',
    'KEM': 'Kemanggisan',
    
    # Green Line (West Branch) - matching your schedule  
    'PAL': 'Palmerah',
    'KBL': 'Kebayoran Lama',
    'PON': 'Pondok Indah', 
    'LB2': 'Lebak Bulus 2'
}

# Updated Graph with only stations from the STATIONS dictionary
NETWORK_GRAPH = {
    # Blue Line Main Route
    'BNR': [('DKT', 1.8)],
    'DKT': [('BNR', 1.8), ('STF', 1.5)],
    'STF': [('DKT', 1.5), ('BKS', 1.3)],
    'BKS': [('STF', 1.3), ('IST', 1.1)],
    'IST': [('BKS', 1.1), ('SNY', 1.4), ('TAN', 2.3)],  # Added connection to Red Line
    'SNY': [('IST', 1.4), ('ASN', 1.2)],
    'ASN': [('SNY', 1.2), ('BLM', 1.6), ('PAL', 1.9)],  # Added connection to Green Line
    'BLM': [('ASN', 1.6), ('BLA', 1.0)],
    'BLA': [('BLM', 1.0), ('FTM', 1.4)],
    'FTM': [('BLA', 1.4), ('CPR', 1.2)],
    'CPR': [('FTM', 1.2), ('HJN', 1.1)],
    'HJN': [('CPR', 1.1), ('LEB', 1.5)],
    'LEB': [('HJN', 1.5)],
    
    # Red Line (East Branch) - Modified to connect to IST instead of DKT
    'TAN': [('CEN', 1.5), ('IST', 2.3)],  # Added connection to Blue Line (IST)
    'CEN': [('TAN', 1.5), ('TAD', 1.3)],
    'TAD': [('CEN', 1.3), ('KEM', 1.2)],
    'KEM': [('TAD', 1.2)],  # Removed connection to DKT
    
    # Green Line (West Branch) - Modified to connect to ASN instead of DKT
    'PAL': [('KBL', 1.8), ('ASN', 1.9)],  # Changed connection from DKT to ASN
    'KBL': [('PAL', 1.8), ('PON', 2.0)],
    'PON': [('KBL', 2.0), ('LB2', 1.7)],
    'LB2': [('PON', 1.7)]
}

def dijkstra_shortest_path(graph: Dict, start: str, end: str) -> Tuple[List[str], float]:
    """
    Implements Dijkstra's algorithm to find shortest path between stations
    Returns: (path_list, total_distance)
    """
    # Priority queue: (distance, current_station, path)
    pq = [(0, start, [start])]
    visited = set()
    distances = {station: float('inf') for station in graph}
    distances[start] = 0
    
    while pq:
        current_dist, current_station, path = heapq.heappop(pq)
        
        if current_station in visited:
            continue
            
        visited.add(current_station)
        
        # Found destination
        if current_station == end:
            return path, current_dist
        
        # Check neighbors
        for neighbor, weight in graph.get(current_station, []):
            if neighbor not in visited:
                new_dist = current_dist + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    new_path = path + [neighbor]
                    heapq.heappush(pq, (new_dist, neighbor, new_path))
    
    return [], float('inf')  # No path found

def bfs_min_transfers(graph: Dict, start: str, end: str) -> Tuple[List[str], int]:
    """
    BFS to find path with minimum transfers (stations)
    Returns: (path_list, number_of_transfers)
    """
    from collections import deque
    
    queue = deque([(start, [start])])
    visited = set([start])
    
    while queue:
        current_station, path = queue.popleft()
        
        if current_station == end:
            return path, len(path) - 1  # transfers = stations - 1
        
        for neighbor, _ in graph.get(current_station, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    
    return [], -1  # No path found

@app.route("/api/python")
def hello_world():
    """Test endpoint to verify API is working"""
    return jsonify({
        "message": "Hello, World!",
        "status": "API is running correctly",
        "serverless": True
    })

@app.route("/api/shortest-route", methods=['POST'])
def find_shortest_route():
    """
    Find shortest route between two stations using Dijkstra's algorithm
    """
    try:
        data = request.get_json()
        start_station = data.get('from')
        end_station = data.get('to')
        
        if not start_station or not end_station:
            return jsonify({"error": "Missing 'from' or 'to' station"}), 400
        
        # Create a reverse mapping from station code to station code in NETWORK_GRAPH
        network_station_map = {code: code for code in NETWORK_GRAPH.keys()}
        
        # Add mapping for station codes in STATIONS that might not exactly match NETWORK_GRAPH
        for code in STATIONS.keys():
            if code not in network_station_map:
                # Try to find a matching station in NETWORK_GRAPH
                for network_code in NETWORK_GRAPH.keys():
                    if network_code == code or network_code.startswith(code):
                        network_station_map[code] = network_code
                        break
        
        # Convert input station codes to network graph codes
        start_network_code = network_station_map.get(start_station, start_station)
        end_network_code = network_station_map.get(end_station, end_station)
        
        if start_network_code not in NETWORK_GRAPH:
            return jsonify({"error": f"Start station code '{start_station}' not found in network"}), 400
        
        if end_network_code not in NETWORK_GRAPH:
            return jsonify({"error": f"End station code '{end_station}' not found in network"}), 400
        
        # Find shortest path by distance
        shortest_path, distance = dijkstra_shortest_path(NETWORK_GRAPH, start_network_code, end_network_code)
        
        # Find path with minimum transfers
        min_transfer_path, transfers = bfs_min_transfers(NETWORK_GRAPH, start_network_code, end_network_code)
        
        if not shortest_path:
            return jsonify({"error": "No route found between specified stations"}), 404
        
        # Calculate travel time (assume 3 min between stations + 2 min per transfer)
        travel_time = (len(shortest_path) - 1) * 3 + max(0, len(shortest_path) - 2) * 2
        
        # Calculate price based on distance (IDR 3000 base + IDR 2000 per km)
        price = 3000 + int(distance * 2000)
        
        # Safe lookup for station names
        def get_station_name(code):
            # Try direct lookup first
            if code in STATIONS:
                return STATIONS[code]
            # Try to find a close match
            for station_code, name in STATIONS.items():
                if station_code in code or code in station_code:
                    return name
            return f"Station {code}"  # Fallback
        
        start_name = get_station_name(start_station)
        end_name = get_station_name(end_station)
        
        # Convert path codes to station names safely
        shortest_path_names = [get_station_name(code) for code in shortest_path]
        min_transfer_names = [get_station_name(code) for code in min_transfer_path]
        
        return jsonify({
            "route": {
                "from": {"code": start_station, "name": start_name},
                "to": {"code": end_station, "name": end_name},
                "shortest_distance": {
                    "path": shortest_path,
                    "stations": shortest_path_names,
                    "distance_km": round(distance, 2),
                    "travel_time_minutes": travel_time,
                    "price_idr": price
                },
                "min_transfers": {
                    "path": min_transfer_path,
                    "stations": min_transfer_names,
                    "transfers": transfers,
                    "travel_time_minutes": (len(min_transfer_path) - 1) * 3 + transfers * 2
                }
            },
            "algorithm_used": ["Dijkstra (shortest distance)", "BFS (minimum transfers)"]
        })
    except Exception as e:
        # Log the error for debugging
        print(f"Error in find_shortest_route: {str(e)}")
        return jsonify({"error": "An internal server error occurred", "details": str(e)}), 500

@app.route("/api/network-analysis", methods=['GET'])
def network_analysis():
    """
    Analyze the entire MRT network using graph algorithms
    """
    # Find network diameter (longest shortest path)
    max_distance = 0
    diameter_path = []
    
    stations = list(NETWORK_GRAPH.keys())
    for i in range(len(stations)):
        for j in range(i + 1, len(stations)):
            path, distance = dijkstra_shortest_path(NETWORK_GRAPH, stations[i], stations[j])
            if distance > max_distance:
                max_distance = distance
                diameter_path = path
    
    # Calculate total network length
    total_length = sum(
        sum(weight for _, weight in connections) 
        for connections in NETWORK_GRAPH.values()
    ) / 2  # Divide by 2 because edges are bidirectional
    
    return jsonify({
        "network_stats": {
            "total_stations": len(NETWORK_GRAPH),
            "total_length_km": round(total_length, 2),
            "network_diameter": {
                "longest_route": diameter_path,
                "distance_km": round(max_distance, 2)
            }
        },
        "algorithms_used": ["Dijkstra (all-pairs shortest path)"]
    })

# This is the correct handler format for Vercel serverless functions with Flask
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """Catch-all route to handle all requests that don't match existing routes"""
    if not path:
        return jsonify({"status": "API is running", "endpoints": ["/api/python", "/api/shortest-route", "/api/network-analysis"]})
    return jsonify({"error": f"Route /{path} not found"}), 404

def handler(event, context):
    """
    This is the serverless function handler for Vercel
    Required for Python serverless functions on Vercel
    """
    payload = json.loads(event['body']) if event.get('body') else {}
    headers = event.get('headers', {})
    path = event.get('path', '')
    method = event.get('httpMethod', 'GET')
    query = event.get('queryStringParameters', {}) or {}
    
    # Create a flask context
    with app.test_request_context(
        path=path,
        method=method,
        headers=headers,
        data=json.dumps(payload) if payload else None,
        query_string=query
    ):
        # Dispatch the request to Flask and get the response
        response = app.full_dispatch_request()
        
        # Convert the response to the format expected by Vercel
        return {
            'statusCode': response.status_code,
            'headers': dict(response.headers),
            'body': response.get_data(as_text=True),
            'isBase64Encoded': False
        }

# This is for local development
if __name__ == '__main__':
    app.run(debug=True, port=5328)