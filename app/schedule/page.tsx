'use client'

import Link from 'next/link'
import { useState } from 'react'

// Define the MRT Jakarta stations
const stations = [
  { id: 1, name: "Lebak Bulus Grab", city: "Jakarta Selatan" },
  { id: 2, name: "Fatmawati", city: "Jakarta Selatan" },
  { id: 3, name: "Cipete Raya", city: "Jakarta Selatan" },
  { id: 4, name: "Haji Nawi", city: "Jakarta Selatan" },
  { id: 5, name: "Blok A", city: "Jakarta Selatan" },
  { id: 6, name: "Blok M BCA", city: "Jakarta Selatan" },
  { id: 7, name: "ASEAN", city: "Jakarta Selatan" },
  { id: 8, name: "Senayan", city: "Jakarta Selatan" },
  { id: 9, name: "Istora Mandiri", city: "Jakarta Pusat" },
  { id: 10, name: "Bendungan Hilir", city: "Jakarta Pusat" },
  { id: 11, name: "Setiabudi Astra", city: "Jakarta Pusat" },
  { id: 12, name: "Dukuh Atas BNI", city: "Jakarta Pusat" },
  { id: 13, name: "Bundaran HI", city: "Jakarta Pusat" },
]

// Define train schedules - multiple trains running throughout the day
// Each train has a trainNumber, direction (northbound/southbound), and schedule with times at each station
const trainSchedules = [
  // Northbound trains (Lebak Bulus to Bundaran HI)
  { 
    trainNumber: "MRT-N001",
    direction: "northbound",
    schedule: [
      { stationId: 1, time: "05:00" },
      { stationId: 2, time: "05:03" },
      { stationId: 3, time: "05:06" },
      { stationId: 4, time: "05:09" },
      { stationId: 5, time: "05:12" },
      { stationId: 6, time: "05:15" },
      { stationId: 7, time: "05:18" },
      { stationId: 8, time: "05:21" },
      { stationId: 9, time: "05:24" },
      { stationId: 10, time: "05:27" },
      { stationId: 11, time: "05:30" },
      { stationId: 12, time: "05:33" },
      { stationId: 13, time: "05:36" },
    ]
  },
  { 
    trainNumber: "MRT-N002",
    direction: "northbound",
    schedule: [
      { stationId: 1, time: "05:30" },
      { stationId: 2, time: "05:33" },
      { stationId: 3, time: "05:36" },
      { stationId: 4, time: "05:39" },
      { stationId: 5, time: "05:42" },
      { stationId: 6, time: "05:45" },
      { stationId: 7, time: "05:48" },
      { stationId: 8, time: "05:51" },
      { stationId: 9, time: "05:54" },
      { stationId: 10, time: "05:57" },
      { stationId: 11, time: "06:00" },
      { stationId: 12, time: "06:03" },
      { stationId: 13, time: "06:06" },
    ]
  },
  { 
    trainNumber: "MRT-N003",
    direction: "northbound",
    schedule: [
      { stationId: 1, time: "06:00" },
      { stationId: 2, time: "06:03" },
      { stationId: 3, time: "06:06" },
      { stationId: 4, time: "06:09" },
      { stationId: 5, time: "06:12" },
      { stationId: 6, time: "06:15" },
      { stationId: 7, time: "06:18" },
      { stationId: 8, time: "06:21" },
      { stationId: 9, time: "06:24" },
      { stationId: 10, time: "06:27" },
      { stationId: 11, time: "06:30" },
      { stationId: 12, time: "06:33" },
      { stationId: 13, time: "06:36" },
    ]
  },
  { 
    trainNumber: "MRT-N004",
    direction: "northbound",
    schedule: [
      { stationId: 1, time: "06:30" },
      { stationId: 2, time: "06:33" },
      { stationId: 3, time: "06:36" },
      { stationId: 4, time: "06:39" },
      { stationId: 5, time: "06:42" },
      { stationId: 6, time: "06:45" },
      { stationId: 7, time: "06:48" },
      { stationId: 8, time: "06:51" },
      { stationId: 9, time: "06:54" },
      { stationId: 10, time: "06:57" },
      { stationId: 11, time: "07:00" },
      { stationId: 12, time: "07:03" },
      { stationId: 13, time: "07:06" },
    ]
  },
  
  // Southbound trains (Bundaran HI to Lebak Bulus)
  { 
    trainNumber: "MRT-S001",
    direction: "southbound",
    schedule: [
      { stationId: 13, time: "05:00" },
      { stationId: 12, time: "05:03" },
      { stationId: 11, time: "05:06" },
      { stationId: 10, time: "05:09" },
      { stationId: 9, time: "05:12" },
      { stationId: 8, time: "05:15" },
      { stationId: 7, time: "05:18" },
      { stationId: 6, time: "05:21" },
      { stationId: 5, time: "05:24" },
      { stationId: 4, time: "05:27" },
      { stationId: 3, time: "05:30" },
      { stationId: 2, time: "05:33" },
      { stationId: 1, time: "05:36" },
    ]
  },
  { 
    trainNumber: "MRT-S002",
    direction: "southbound",
    schedule: [
      { stationId: 13, time: "05:30" },
      { stationId: 12, time: "05:33" },
      { stationId: 11, time: "05:36" },
      { stationId: 10, time: "05:39" },
      { stationId: 9, time: "05:42" },
      { stationId: 8, time: "05:45" },
      { stationId: 7, time: "05:48" },
      { stationId: 6, time: "05:51" },
      { stationId: 5, time: "05:54" },
      { stationId: 4, time: "05:57" },
      { stationId: 3, time: "06:00" },
      { stationId: 2, time: "06:03" },
      { stationId: 1, time: "06:06" },
    ]
  },
  { 
    trainNumber: "MRT-S003",
    direction: "southbound",
    schedule: [
      { stationId: 13, time: "06:00" },
      { stationId: 12, time: "06:03" },
      { stationId: 11, time: "06:06" },
      { stationId: 10, time: "06:09" },
      { stationId: 9, time: "06:12" },
      { stationId: 8, time: "06:15" },
      { stationId: 7, time: "06:18" },
      { stationId: 6, time: "06:21" },
      { stationId: 5, time: "06:24" },
      { stationId: 4, time: "06:27" },
      { stationId: 3, time: "06:30" },
      { stationId: 2, time: "06:33" },
      { stationId: 1, time: "06:36" },
    ]
  },
  { 
    trainNumber: "MRT-S004",
    direction: "southbound",
    schedule: [
      { stationId: 13, time: "06:30" },
      { stationId: 12, time: "06:33" },
      { stationId: 11, time: "06:36" },
      { stationId: 10, time: "06:39" },
      { stationId: 9, time: "06:42" },
      { stationId: 8, time: "06:45" },
      { stationId: 7, time: "06:48" },
      { stationId: 6, time: "06:51" },
      { stationId: 5, time: "06:54" },
      { stationId: 4, time: "06:57" },
      { stationId: 3, time: "07:00" },
      { stationId: 2, time: "07:03" },
      { stationId: 1, time: "07:06" },
    ]
  },
]

export default function SchedulePage() {
  const [selectedDirection, setSelectedDirection] = useState("northbound") // Default to northbound
  
  // Get station name by ID
  const getStationNameById = (id: number) => {
    const station = stations.find(s => s.id === id)
    return station ? station.name : ""
  }
  
  // Filter trains by selected direction
  const filteredTrains = trainSchedules.filter(train => train.direction === selectedDirection)
  
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="w-full bg-blue-700 text-white py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bold mr-2">🚄</div>
          <h1 className="text-2xl font-bold">Railnet</h1>
        </Link>
        <div className="hidden sm:flex space-x-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/schedule" className="font-bold">Schedule</Link>
          <Link href="/tickets" className="hover:underline">Tickets</Link>
          <Link href="#" className="hover:underline">Help</Link>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="w-full max-w-6xl px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-black text-center">MRT Jakarta Train Schedule</h1>
          
          {/* Direction Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button 
                type="button" 
                className={`px-4 py-2 text-sm font-medium ${
                  selectedDirection === "northbound" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-300 rounded-l-lg`}
                onClick={() => setSelectedDirection("northbound")}
              >
                Northbound (Lebak Bulus → Bundaran HI)
              </button>
              <button 
                type="button" 
                className={`px-4 py-2 text-sm font-medium ${
                  selectedDirection === "southbound" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-300 rounded-r-lg`}
                onClick={() => setSelectedDirection("southbound")}
              >
                Southbound (Bundaran HI → Lebak Bulus)
              </button>
            </div>
          </div>
          
          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-black">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-gray-300 p-2 sticky left-0 bg-blue-100 z-10">Station</th>
                  {filteredTrains.map(train => (
                    <th key={train.trainNumber} className="border border-gray-300 p-2 min-w-[100px]">
                      {train.trainNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedDirection === "northbound" ? (
                  // Northbound stations (Lebak Bulus to Bundaran HI)
                  stations.map(station => (
                    <tr key={station.id} className={station.id % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="border border-gray-300 p-2 font-medium sticky left-0 z-10" style={{ backgroundColor: station.id % 2 === 0 ? "#f9fafb" : "#fff" }}>
                        {station.name}
                        <span className="block text-xs text-gray-500">{station.city}</span>
                      </td>
                      {filteredTrains.map(train => {
                        const stationSchedule = train.schedule.find(s => s.stationId === station.id)
                        return (
                          <td key={`${train.trainNumber}-${station.id}`} className="border border-gray-300 p-2 text-center">
                            {stationSchedule ? stationSchedule.time : "-"}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                ) : (
                  // Southbound stations (Bundaran HI to Lebak Bulus)
                  [...stations].reverse().map(station => (
                    <tr key={station.id} className={station.id % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="border border-gray-300 p-2 font-medium sticky left-0 z-10" style={{ backgroundColor: station.id % 2 === 0 ? "#f9fafb" : "#fff" }}>
                        {station.name}
                        <span className="block text-xs text-gray-500">{station.city}</span>
                      </td>
                      {filteredTrains.map(train => {
                        const stationSchedule = train.schedule.find(s => s.stationId === station.id)
                        return (
                          <td key={`${train.trainNumber}-${station.id}`} className="border border-gray-300 p-2 text-center">
                            {stationSchedule ? stationSchedule.time : "-"}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p className="mb-2"><strong>Notes:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Schedules may vary on weekends and public holidays</li>
              <li>Trains arrive every 5-10 minutes during peak hours (6:30 AM - 9:00 AM and 4:30 PM - 7:00 PM)</li>
              <li>The first train departs at 5:00 AM and the last train departs at 11:00 PM</li>
              <li>Please arrive at the station at least 5 minutes before the scheduled departure time</li>
            </ul>
          </div>
        </div>
        
        {/* Route Map */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-black">MRT Jakarta Route</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-500"></div>
            
            {/* Stations on the route */}
            {stations.map((station, index) => (
              <div key={station.id} className="ml-8 relative pb-8">
                <div className="absolute left-[-29px] w-[17px] h-[17px] bg-white border-4 border-blue-500 rounded-full"></div>
                <div className="pl-6">
                  <h3 className="text-lg font-bold text-black">{station.name}</h3>
                  <p className="text-sm text-gray-600">{station.city}</p>
                  {index < stations.length - 1 && (
                    <p className="text-xs text-gray-500">3 minutes to next station</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-8 px-4 mt-auto">
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
    </main>
  )
}