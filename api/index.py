from flask import Flask, jsonify, request
import heapq
import json
from typing import Dict, List, Tuple
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

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

Coordinate = {
    # Blue Line
    'LEB' : [-6.289466, 106.775698],
    'FTM' : [-6.292629, 106.793874],
    'CPR' : [-6.278277, 106.797300],
    'HJN' : [-6.266708, 106.797292],
    'BLA' : [-6.255783, 106.797181],
    'BLM' : [-6.244499, 106.798162],
    'ASN' : [-6.238568, 106.798449],
    'SNY' : [-6.226890, 106.802520],
    'IST' : [-6.222479, 106.808653],
    'BKS' : [-6.215117, 106.818047],
    'STF' : [-6.208949, 106.821624],
    'DKT' : [-6.200866, 106.822793],
    'BNR' : [-6.191977, 106.822891], 
    
    # Red Line
    'TAN' : [-6.162204, 106.789709],
    'CEN' : [-6.161278, 106.771616], 
    'TAD' : [-6.155477, 106.801386],
    'KEM' : [-6.189369, 106.796936],
    
    # Green Line
    'PAL' : [-6.206899, 106.797689],
    'KBL' : [-6.236658, 106.782808],
    'PON' : [-6.267074, 106.783752], 
    'LB2' : [-6.299031, 106.763768]
}

def euclidean_distance(start: str, end: str) -> float:
    if start not in Coordinate or end not in Coordinate:
        return 0
    
    lat1, lon1 = Coordinate[start]
    lat2, lon2 = Coordinate[end]
    
    # Calculate differences in latitude and longitude
    # 1 degree latitude is approximately 111 km
    
    lat_diff_km = (lat2-lat1) * 111
    
    # 1 degree longitude varies by latitude, so we use the average latitude
    # to calculate the distance in km
    
    avg_lat = (lat1 + lat2) / 2
    import math
    lon_diff_km = (lon2-lon1) * (111 * math.cos(math.radians(avg_lat)))
    
    #Calculate Euclidean distance
    distance = math.sqrt(lat_diff_km**2 + lon_diff_km**2)
    
    return distance

# Updated Graph with only stations from the STATIONS dictionary
NETWORK_GRAPH = {
    # Blue Line Main Route
    'BNR': [('DKT', euclidean_distance('BNR', 'DKT'))],
    'DKT': [('BNR', euclidean_distance('DKT', 'BNR')), ('STF', euclidean_distance('DKT', 'STF'))],
    'STF': [('DKT', euclidean_distance('STF', 'DKT')), ('BKS', euclidean_distance('STF', 'BKS'))],
    'BKS': [('STF', euclidean_distance('BKS', 'STF')), ('IST', euclidean_distance('BKS', 'IST'))],
    'IST': [('BKS', euclidean_distance('IST', 'BKS')), ('SNY', euclidean_distance('IST', 'SNY')), ('TAN', euclidean_distance('IST', 'TAN'))],  # Added connection to Red Line
    'SNY': [('IST', euclidean_distance('SNY', 'IST')), ('ASN', euclidean_distance('SNY', 'ASN'))],
    'ASN': [('SNY', euclidean_distance('ASN', 'SNY')), ('BLM', euclidean_distance('ASN', 'BLM')), ('PAL', euclidean_distance('ASN', 'PAL'))],  # Added connection to Green Line
    'BLM': [('ASN', euclidean_distance('BLM', 'ASN')), ('BLA', euclidean_distance('BLM', 'BLA'))],
    'BLA': [('BLM', euclidean_distance('BLA', 'BLM')), ('FTM', euclidean_distance('BLA', 'FTM'))],
    'FTM': [('BLA', euclidean_distance('FTM', 'BLA')), ('CPR', euclidean_distance('FTM', 'CPR'))],
    'CPR': [('FTM', euclidean_distance('CPR', 'FTM')), ('HJN', euclidean_distance('CPR', 'HJN'))],
    'HJN': [('CPR', euclidean_distance('HJN', 'CPR')), ('LEB', euclidean_distance('HJN', 'LEB'))],
    'LEB': [('HJN', euclidean_distance('LEB', 'HJN'))],
    
    # Red Line (East Branch) - Modified to connect to IST instead of DKT
    'TAN': [('CEN', euclidean_distance('TAN', 'CEN')), ('IST', euclidean_distance('TAN', 'IST'))],  # Added connection to Blue Line (IST)
    'CEN': [('TAN', euclidean_distance('CEN', 'TAN')), ('TAD', euclidean_distance('CEN', 'TAD'))],
    'TAD': [('CEN', euclidean_distance('TAD', 'CEN')), ('KEM', euclidean_distance('TAD', 'KEM'))],
    'KEM': [('TAD', euclidean_distance('KEM', 'TAD'))],  # Removed connection to DKT
    
    # Green Line (West Branch) - Modified to connect to ASN instead of DKT
    'PAL': [('KBL', euclidean_distance('PAL', 'KBL')), ('ASN', euclidean_distance('PAL', 'ASN'))],  # Changed connection from DKT to ASN
    'KBL': [('PAL', euclidean_distance('KBL', 'PAL')), ('PON', euclidean_distance('KBL', 'PON'))],
    'PON': [('KBL', euclidean_distance('PON', 'KBL')), ('LB2', euclidean_distance('PON', 'LB2'))],
    'LB2': [('PON', euclidean_distance('LB2', 'PON'))]
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

# Root route for health check
@app.route("/")
def root():
    """Root endpoint for health check"""
    return jsonify({
        "status": "API is running", 
        "endpoints": ["/api/python", "/api/shortest-route", "/api/network-analysis"]
    })

# This is for local development
if __name__ == '__main__':
    app.run(debug=True, port=5328)