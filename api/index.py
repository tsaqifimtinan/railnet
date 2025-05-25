from flask import Flask, jsonify, request
import heapq
from typing import Dict, List, Tuple

app = Flask(__name__)

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

# Updated Graph with ALL connections
NETWORK_GRAPH = {
    # Blue Line Main Route
    'HI': [('BNR', 1.2)],
    'BNR': [('HI', 1.2), ('DKT', 1.8)],
    'DKT': [('BNR', 1.8), ('STF', 1.5), ('KUN', 2.1), ('PRI', 3.2)],  # Transfer hub
    'STF': [('DKT', 1.5), ('BKS', 1.3)],
    'BKS': [('STF', 1.3), ('IST', 1.1)],
    'IST': [('BKS', 1.1), ('SNY', 1.4)],
    'SNY': [('IST', 1.4), ('SNP', 1.0)],
    'SNP': [('SNY', 1.0), ('ASN', 1.2)],
    'ASN': [('SNP', 1.2), ('BLM', 1.6)],
    'BLM': [('ASN', 1.6), ('BLA', 1.0), ('PAN', 2.3)],  # Transfer to Red line
    'BLA': [('BLM', 1.0), ('FTM', 1.4)],
    'FTM': [('BLA', 1.4), ('CPR', 1.2)],
    'CPR': [('FTM', 1.2), ('HJN', 1.1)],
    'HJN': [('CPR', 1.1), ('CLD', 1.5)],
    'CLD': [('HJN', 1.5), ('LEB', 1.8)],
    'LEB': [('CLD', 1.8)],
    
    # Red Line (East Branch)
    'KUN': [('DKT', 2.1), ('PAN', 1.9)],
    'PAN': [('KUN', 1.9), ('BLM', 2.3), ('CKK', 1.7)],
    'CKK': [('PAN', 1.7), ('CLW', 1.4)],
    'CLW': [('CKK', 1.4)],
    
    # Green Line (West Branch)
    'PRI': [('DKT', 3.2)]
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
    return "<p>Hello, World!</p>"

@app.route("/api/shortest-route", methods=['POST'])
def find_shortest_route():
    """
    Find shortest route between two stations using Dijkstra's algorithm
    """
    data = request.get_json()
    start_station = data.get('from')
    end_station = data.get('to')
    
    if not start_station or not end_station:
        return jsonify({"error": "Missing 'from' or 'to' station"}), 400
    
    if start_station not in NETWORK_GRAPH or end_station not in NETWORK_GRAPH:
        return jsonify({"error": "Invalid station code"}), 400
    
    # Find shortest path by distance
    shortest_path, distance = dijkstra_shortest_path(NETWORK_GRAPH, start_station, end_station)
    
    # Find path with minimum transfers
    min_transfer_path, transfers = bfs_min_transfers(NETWORK_GRAPH, start_station, end_station)
    
    if not shortest_path:
        return jsonify({"error": "No route found"}), 404
    
    # Calculate travel time (assume 3 min between stations + 2 min per transfer)
    travel_time = (len(shortest_path) - 1) * 3 + max(0, len(shortest_path) - 2) * 2
    
    # Calculate price based on distance (IDR 3000 base + IDR 2000 per km)
    price = 3000 + int(distance * 2000)
    
    return jsonify({
        "route": {
            "from": {"code": start_station, "name": STATIONS[start_station]},
            "to": {"code": end_station, "name": STATIONS[end_station]},
            "shortest_distance": {
                "path": shortest_path,
                "stations": [STATIONS[code] for code in shortest_path],
                "distance_km": round(distance, 2),
                "travel_time_minutes": travel_time,
                "price_idr": price
            },
            "min_transfers": {
                "path": min_transfer_path,
                "stations": [STATIONS[code] for code in min_transfer_path],
                "transfers": transfers,
                "travel_time_minutes": (len(min_transfer_path) - 1) * 3 + transfers * 2
            }
        },
        "algorithm_used": ["Dijkstra (shortest distance)", "BFS (minimum transfers)"]
    })

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

if __name__ == '__main__':
    app.run(debug=True)