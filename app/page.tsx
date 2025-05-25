'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Dummy data for MRT Jakarta stations with line information
const stations = [
  // Main North-South Line (Blue Line)
  { id: 1, name: "Lebak Bulus Grab", city: "Jakarta Selatan", line: "blue" },
  { id: 2, name: "Fatmawati", city: "Jakarta Selatan", line: "blue" },
  { id: 3, name: "Cipete Raya", city: "Jakarta Selatan", line: "blue" },
  { id: 4, name: "Haji Nawi", city: "Jakarta Selatan", line: "blue" },
  { id: 5, name: "Blok A", city: "Jakarta Selatan", line: "blue" },
  { id: 6, name: "Blok M BCA", city: "Jakarta Selatan", line: "blue" },
  { id: 7, name: "ASEAN", city: "Jakarta Selatan", line: "blue", isTransfer: true },
  { id: 8, name: "Senayan", city: "Jakarta Selatan", line: "blue" },
  { id: 9, name: "Istora Mandiri", city: "Jakarta Pusat", line: "blue", isTransfer: true },
  { id: 10, name: "Bendungan Hilir", city: "Jakarta Pusat", line: "blue" },
  { id: 11, name: "Setiabudi Astra", city: "Jakarta Pusat", line: "blue" },
  { id: 12, name: "Dukuh Atas BNI", city: "Jakarta Pusat", line: "blue" },
  { id: 13, name: "Bundaran HI", city: "Jakarta Pusat", line: "blue" },
  
  // East Branch (Red Line)
  { id: 14, name: "Taman Anggrek", city: "Jakarta Barat", line: "red" },
  { id: 15, name: "Central Park", city: "Jakarta Barat", line: "red" },
  { id: 16, name: "Tanjung Duren", city: "Jakarta Barat", line: "red" },
  { id: 17, name: "Kemanggisan", city: "Jakarta Barat", line: "red" },
  
  // West Branch (Green Line)
  { id: 18, name: "Palmerah", city: "Jakarta Selatan", line: "green" },
  { id: 19, name: "Kebayoran Lama", city: "Jakarta Selatan", line: "green" },
  { id: 20, name: "Pondok Indah", city: "Jakarta Selatan", line: "green" },
  { id: 21, name: "Lebak Bulus 2", city: "Jakarta Selatan", line: "green" },
]

// Mapping of station names to station codes (for API)
// TypeScript interface for route information
interface RouteInfo {
  route: {
    from: { code: string; name: string };
    to: { code: string; name: string };
    shortest_distance: {
      path: string[];
      stations: string[];
      distance_km: number;
      travel_time_minutes: number;
      price_idr: number;
    };
    min_transfers: {
      path: string[];
      stations: string[];
      transfers: number;
      travel_time_minutes: number;
    };
  };
  algorithm_used: string[];
}

const stationCodes: Record<string, string> = {
  "Lebak Bulus Grab": "LEB",
  "Fatmawati": "FTM",
  "Cipete Raya": "CPR",
  "Haji Nawi": "HJN",
  "Blok A": "BLA",
  "Blok M BCA": "BLM",
  "ASEAN": "ASN",
  "Senayan": "SNY",
  "Istora Mandiri": "IST",
  "Bendungan Hilir": "BKS",
  "Setiabudi Astra": "STF",
  "Dukuh Atas BNI": "DKT",
  "Bundaran HI": "BNR",
  "Taman Anggrek": "TAN",
  "Central Park": "CEN",
  "Tanjung Duren": "TAD",
  "Kemanggisan": "KEM",
  "Palmerah": "PAL",
  "Kebayoran Lama": "KBL",
  "Pondok Indah": "PON",
  "Lebak Bulus 2": "LB2",
}

export default function Home() {
  const [fromStation, setFromStation] = useState('')
  const [toStation, setToStation] = useState('')
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Handler for the "From" station selection
  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    setFromStation(selected)
    
    // Check if "From" and "To" are the same
    if (selected === toStation) {
      setError('Departure and arrival stations cannot be the same')
    } else {
      setError('')
    }
  }
  
  // Handler for the "To" station selection
  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    setToStation(selected)
    
    // Check if "From" and "To" are the same
    if (selected === fromStation) {
      setError('Departure and arrival stations cannot be the same')
    } else {
      setError('')
    }
  }  // Handler for search button
  const handleSearch = async () => {
    if (!fromStation || !toStation) {
      setError('Please select both departure and arrival stations')
      return
    }
    
    if (fromStation === toStation) {
      setError('Departure and arrival stations cannot be the same')
      return
    }
    
    if (!selectedDate) {
      setError('Please select a travel date')
      return
    }
    
    setError('')
    
    try {
      setIsLoading(true)
      // Get the station codes for API request
      const fromCode = stationCodes[fromStation]
      const toCode = stationCodes[toStation]
      
      if (!fromCode || !toCode) {
        setError('Station code not found')
        setIsLoading(false)
        return
      }

      console.log(`Sending request: from=${fromCode}, to=${toCode}`)

      // Using fetch API with the correct endpoint
      const response = await fetch('https://railnet.vercel.app//api/shortest-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromCode,
          to: toCode
        }),
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('API error:', errorData)
        throw new Error(`Network response error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json() as RouteInfo
      console.log('Route data received:', data)
      
      setRouteInfo(data)
      setShowRouteModal(true)
    } catch (err: any) {
      console.error('Error in handleSearch:', err)
      setError('Failed to get route information: ' + (err.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }
  
  // Close the route modal
  const closeRouteModal = () => {
    setShowRouteModal(false)
  }
  
  // Function to determine the line color for stations
  const getLineColor = (stationName: string) => {
    const station = stations.find(s => s.name === stationName)
    if (!station) return 'bg-gray-500' // Default
    
    switch(station.line) {
      case 'blue':
        return 'bg-blue-500'
      case 'red':
        return 'bg-red-500'
      case 'green':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="w-full bg-blue-700 text-white py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bold mr-2">🚄</div>
          <h1 className="text-2xl font-bold">Railnet</h1>
        </Link>        <div className="hidden sm:flex space-x-6">
          <Link href="/schedule" className="hover:underline">Schedule</Link>
          <Link href="/route-tickets" className="hover:underline">Route & Tickets</Link>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="w-full bg-blue-800 text-white py-16 px-4 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Travel Across Jakarta with Railnet</h1>
        <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">Fast, reliable, and comfortable inter-city train service</p>
      </div>
      
      {/* Booking Form */}
      <div className="relative -mt-10 w-11/12 max-w-3xl bg-white rounded-lg shadow-xl p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-black">Book Your Train</h2>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">          {/* From Station */}
          <div className="flex-1">
            <label htmlFor="fromStation" className="block text-sm font-medium text-black mb-1">
              From
            </label>
            <select
              id="fromStation"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              value={fromStation}
              onChange={handleFromChange}
              required
            >
              <option value="">Select departure station</option>
              {Object.keys(stationCodes).map((stationName, index) => (
                <option key={index} value={stationName}>
                  {stationName}
                </option>
              ))}
            </select>
          </div>
          
          {/* To Station */}
          <div className="flex-1">
            <label htmlFor="toStation" className="block text-sm font-medium text-black mb-1">
              To
            </label>
            <select
              id="toStation"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              value={toStation}
              onChange={handleToChange}
              required
            >
              <option value="">Select arrival station</option>
              {Object.keys(stationCodes).map((stationName, index) => (
                <option key={index} value={stationName}>
                  {stationName}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Date Selection */}
        <div className="mb-6">
          <label htmlFor="travelDate" className="block text-sm font-medium text-black mb-1">
            Date of Travel
          </label>
          <input
            type="date"
            id="travelDate"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
            required
          />
        </div>
        
        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow transition duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finding Routes...
            </>
          ) : "Search Trains"}
        </button>
      </div>
      
      {/* Features Section */}
      <div className="w-full max-w-6xl px-4 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Why Choose Railnet?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl text-gray-600 font-semibold mb-2">Fast Connections</h3>
            <p className="text-gray-600">High-speed trains connecting major cities with minimal stops and maximum comfort.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl text-gray-600 font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-gray-600">Reduce your carbon footprint by choosing rail travel over cars or planes.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl text-gray-600 font-semibold mb-2 ">Easy Booking</h3>
            <p className="text-gray-600">Simple online booking with flexible tickets and mobile passes.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <div className="text-2xl mr-2">🚄</div>
              <h2 className="text-xl font-bold">Railnet</h2>
            </div>
            <p className="mt-2 text-gray-400">Connecting cities, connecting people.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Company</h3>
              <ul className="space-y-1">
                <li><Link href="#" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Support</h3>
              <ul className="space-y-1">
                <li><Link href="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">FAQs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="space-y-1">
                <li><Link href="#" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Terms</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Accessibility</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Route Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Train Route Information</h2>
                <button 
                  onClick={closeRouteModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="loader"></div>
                </div>
              ) : routeInfo ? (
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">From</p>
                        <p className="font-semibold text-lg text-gray-600">{routeInfo.route.from.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">To</p>
                        <p className="font-semibold text-lg text-gray-600">{routeInfo.route.to.name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Distance</p>
                        <p className="font-semibold text-gray-600">{routeInfo.route.shortest_distance.distance_km} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Travel Time</p>
                        <p className="font-semibold text-gray-600">{routeInfo.route.shortest_distance.travel_time_minutes} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-semibold text-gray-600">IDR {routeInfo.route.shortest_distance.price_idr.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3">Route Path</h3>
                  
                  {/* Shortest Path Visualization */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Shortest Route ({routeInfo.route.shortest_distance.stations.length} stations)</p>
                    <div className="flex flex-col">
                      {routeInfo.route.shortest_distance.stations.map((station, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`${getLineColor(station)} h-6 w-6 rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                            {index + 1} 
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-600">{station}</p>
                            {index < routeInfo.route.shortest_distance.stations.length - 1 && (
                              <div className={`h-8 w-0.5 ml-3 ${getLineColor(station)}`}></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Minimum Transfers Route */}
                  {routeInfo.route.min_transfers.path.length !== routeInfo.route.shortest_distance.path.length && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Alternative Route (Min. Transfers: {routeInfo.route.min_transfers.transfers})</p>
                      <div className="flex flex-col">
                        {routeInfo.route.min_transfers.stations.map((station, index) => (
                          <div key={index} className="flex items-center">
                            <div className={`${getLineColor(station)} h-6 w-6 rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                              {index + 1}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{station}</p>
                              {index < routeInfo.route.min_transfers.stations.length - 1 && (
                                <div className={`h-8 w-0.5 ml-3 ${getLineColor(station)}`}></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 border-t pt-6 flex justify-between">
                    <button 
                      onClick={closeRouteModal}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <Link 
                      href="/route-tickets" 
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Book Tickets
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500">No route information available</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for loader */}
      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}
