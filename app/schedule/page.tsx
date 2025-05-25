'use client'

import Link from 'next/link'
import { useState } from 'react'

// Define the MRT Jakarta stations with line/branch information
// Added line property: "blue" for main line, "red" for east branch, "green" for west branch
const stations = [
  // Main North-South Line (Blue Line) - Lebak Bulus to Bundaran HI  { id: 1, name: "Lebak Bulus Grab", city: "Jakarta Selatan", line: "blue" },
  { id: 2, name: "Fatmawati", city: "Jakarta Selatan", line: "blue" },
  { id: 3, name: "Cipete Raya", city: "Jakarta Selatan", line: "blue" },
  { id: 4, name: "Haji Nawi", city: "Jakarta Selatan", line: "blue" },
  { id: 5, name: "Blok A", city: "Jakarta Selatan", line: "blue" },
  { id: 6, name: "Blok M BCA", city: "Jakarta Selatan", line: "blue" },
  { id: 7, name: "ASEAN", city: "Jakarta Selatan", line: "blue", isTransfer: true, connects: ["green"] },
  { id: 8, name: "Senayan", city: "Jakarta Selatan", line: "blue" },
  { id: 9, name: "Istora Mandiri", city: "Jakarta Pusat", line: "blue", isTransfer: true, connects: ["red"] },
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

// Group stations by line for easier rendering
const lineStations = {
  blue: stations.filter(station => station.line === "blue"),
  red: stations.filter(station => station.line === "red"),
  green: stations.filter(station => station.line === "green"),
}

// Helper function to get transfer stations
const transferStations = stations.filter(station => station.isTransfer);

// Define train schedules - multiple trains running throughout the day on different lines
// Each train has a trainNumber, line, direction, and schedule with times at each station
const trainSchedules = [
  // Blue Line - Northbound trains (Lebak Bulus to Bundaran HI)
  { 
    trainNumber: "BL-N001",
    line: "blue",
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
    trainNumber: "BL-N002",
    line: "blue",
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
  
  // Blue Line - Southbound trains (Bundaran HI to Lebak Bulus)
  { 
    trainNumber: "BL-S001",
    line: "blue",
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
    trainNumber: "BL-S002",
    line: "blue",
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
  
  // Red Line - Eastbound (from Istora Mandiri to Kemanggisan)
  {
    trainNumber: "RL-E001",
    line: "red",
    direction: "eastbound",
    schedule: [
      { stationId: 9, time: "05:15" },  // Transfer at Istora Mandiri
      { stationId: 14, time: "05:19" },
      { stationId: 15, time: "05:22" },
      { stationId: 16, time: "05:25" },
      { stationId: 17, time: "05:28" },
    ]
  },
  {
    trainNumber: "RL-E002",
    line: "red",
    direction: "eastbound",
    schedule: [
      { stationId: 9, time: "05:45" },  // Transfer at Istora Mandiri
      { stationId: 14, time: "05:49" },
      { stationId: 15, time: "05:52" },
      { stationId: 16, time: "05:55" },
      { stationId: 17, time: "05:58" },
    ]
  },
  
  // Red Line - Westbound (from Kemanggisan to Istora Mandiri)
  {
    trainNumber: "RL-W001",
    line: "red", 
    direction: "westbound",
    schedule: [
      { stationId: 17, time: "05:00" },
      { stationId: 16, time: "05:03" },
      { stationId: 15, time: "05:06" },
      { stationId: 14, time: "05:09" },
      { stationId: 9, time: "05:13" },  // Transfer at Istora Mandiri
    ]
  },
  {
    trainNumber: "RL-W002",
    line: "red",
    direction: "westbound",
    schedule: [
      { stationId: 17, time: "05:30" },
      { stationId: 16, time: "05:33" },
      { stationId: 15, time: "05:36" },
      { stationId: 14, time: "05:39" },
      { stationId: 9, time: "05:43" },  // Transfer at Istora Mandiri
    ]
  },
  
  // Green Line - Southbound (from ASEAN to Lebak Bulus 2)
  {
    trainNumber: "GL-S001",
    line: "green",
    direction: "southbound",
    schedule: [
      { stationId: 7, time: "05:20" },  // Transfer at ASEAN
      { stationId: 18, time: "05:23" },
      { stationId: 19, time: "05:26" },
      { stationId: 20, time: "05:30" },
      { stationId: 21, time: "05:33" },
    ]
  },
  {
    trainNumber: "GL-S002",
    line: "green",
    direction: "southbound",
    schedule: [
      { stationId: 7, time: "05:50" },  // Transfer at ASEAN
      { stationId: 18, time: "05:53" },
      { stationId: 19, time: "05:56" },
      { stationId: 20, time: "06:00" },
      { stationId: 21, time: "06:03" },
    ]
  },
  
  // Green Line - Northbound (from Lebak Bulus 2 to ASEAN)
  {
    trainNumber: "GL-N001",
    line: "green",
    direction: "northbound",
    schedule: [
      { stationId: 21, time: "05:00" },
      { stationId: 20, time: "05:03" },
      { stationId: 19, time: "05:07" },
      { stationId: 18, time: "05:10" },
      { stationId: 7, time: "05:13" },  // Transfer at ASEAN
    ]
  },
  {
    trainNumber: "GL-N002",
    line: "green",
    direction: "northbound",
    schedule: [
      { stationId: 21, time: "05:30" },
      { stationId: 20, time: "05:33" },
      { stationId: 19, time: "05:37" },
      { stationId: 18, time: "05:40" },
      { stationId: 7, time: "05:43" },  // Transfer at ASEAN
    ]
  },
]

export default function SchedulePage() {
  const [selectedLine, setSelectedLine] = useState("blue") // Default to blue line
  const [selectedDirection, setSelectedDirection] = useState("northbound") // Default direction
  
  // Get station name by ID
  const getStationNameById = (id: number) => {
    const station = stations.find(s => s.id === id)
    return station ? station.name : ""
  }
  
  // Get line color class
  const getLineColorClass = (line: string) => {
    switch(line) {
      case "blue": return "bg-blue-500";
      case "red": return "bg-red-500";
      case "green": return "bg-green-500";
      default: return "bg-gray-500";
    }
  }
  
  // Get direction label based on line and direction
  const getDirectionLabel = (line: string, direction: string) => {
    if (line === "blue") {
      return direction === "northbound" ? "Northbound (Lebak Bulus → Bundaran HI)" : "Southbound (Bundaran HI → Lebak Bulus)";
    } else if (line === "red") {
      return direction === "eastbound" ? "Eastbound (Istora Mandiri → Kemanggisan)" : "Westbound (Kemanggisan → Istora Mandiri)";
    } else if (line === "green") {
      return direction === "northbound" ? "Northbound (Lebak Bulus 2 → ASEAN)" : "Southbound (ASEAN → Lebak Bulus 2)";
    }
    return "";
  }
  
  // Get line label
  const getLineLabel = (line: string) => {
    switch(line) {
      case "blue": return "Blue Line (North-South)";
      case "red": return "Red Line (East Branch)";
      case "green": return "Green Line (West Branch)";
      default: return "";
    }
  }
  
  // Get available directions for selected line
  const getAvailableDirections = (line: string) => {
    switch(line) {
      case "blue": return ["northbound", "southbound"];
      case "red": return ["eastbound", "westbound"];
      case "green": return ["northbound", "southbound"];
      default: return [];
    }
  }
  
  // Update direction when line changes to ensure valid direction for the line
  const handleLineChange = (line: string) => {
    setSelectedLine(line);
    
    // Set default direction for the selected line
    const directions = getAvailableDirections(line);
    if (directions.length > 0 && !directions.includes(selectedDirection)) {
      setSelectedDirection(directions[0]);
    }
  }
  
  // Filter trains by selected line and direction
  const filteredTrains = trainSchedules.filter(
    train => train.line === selectedLine && train.direction === selectedDirection
  );
  
  // Get stations for the selected line
  const lineStationsList = lineStations[selectedLine as keyof typeof lineStations] || [];
  
  // Determine which stations to show in the table
  const stationsToShow = selectedDirection === "southbound" || selectedDirection === "westbound" 
    ? [...lineStationsList].reverse() 
    : lineStationsList;
  
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
          
          {/* Line Selector */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button 
                type="button" 
                className={`px-4 py-2 text-sm font-medium ${
                  selectedLine === "blue" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-300 rounded-l-lg`}
                onClick={() => handleLineChange("blue")}
              >
                Blue Line
              </button>
              <button 
                type="button" 
                className={`px-4 py-2 text-sm font-medium ${
                  selectedLine === "red" 
                    ? "bg-red-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border-t border-b border-gray-300`}
                onClick={() => handleLineChange("red")}
              >
                Red Line
              </button>
              <button 
                type="button" 
                className={`px-4 py-2 text-sm font-medium ${
                  selectedLine === "green" 
                    ? "bg-green-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-300 rounded-r-lg`}
                onClick={() => handleLineChange("green")}
              >
                Green Line
              </button>
            </div>
          </div>
          
          {/* Direction Selector - dynamically shows options based on selected line */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              {getAvailableDirections(selectedLine).map((direction, index) => (
                <button 
                  key={direction}
                  type="button" 
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedDirection === direction 
                      ? selectedLine === "blue" ? "bg-blue-600 text-white" 
                        : selectedLine === "red" ? "bg-red-600 text-white" 
                        : "bg-green-600 text-white" 
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } border border-gray-300 ${
                    index === 0 ? "rounded-l-lg" : ""
                  } ${
                    index === getAvailableDirections(selectedLine).length - 1 ? "rounded-r-lg" : ""
                  }`}
                  onClick={() => setSelectedDirection(direction)}
                >
                  {getDirectionLabel(selectedLine, direction)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Line Info */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-black mb-2">{getLineLabel(selectedLine)}</h3>
            <p className="text-gray-700">
              {selectedLine === "blue" && "Main north-south corridor connecting Lebak Bulus to Bundaran HI with transfers to Red and Green lines."}
              {selectedLine === "red" && "East branch connecting Istora Mandiri to Kemanggisan. Transfer at Istora Mandiri for the Blue Line."}
              {selectedLine === "green" && "West branch connecting ASEAN to Lebak Bulus 2. Transfer at ASEAN for the Blue Line."}
            </p>
          </div>
          
          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-black">
              <thead>
                <tr className={selectedLine === "blue" ? "bg-blue-100" : selectedLine === "red" ? "bg-red-100" : "bg-green-100"}>
                  <th className={`border border-gray-300 p-2 sticky left-0 z-10 ${
                    selectedLine === "blue" ? "bg-blue-100" : selectedLine === "red" ? "bg-red-100" : "bg-green-100"
                  }`}>Station</th>
                  {filteredTrains.map(train => (
                    <th key={train.trainNumber} className="border border-gray-300 p-2 min-w-[100px]">
                      {train.trainNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stationsToShow.map(station => (
                  <tr key={station.id} className={station.id % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="border border-gray-300 p-2 font-medium sticky left-0 z-10" style={{ backgroundColor: station.id % 2 === 0 ? "#f9fafb" : "#fff" }}>
                      {station.name}
                      <span className="block text-xs text-gray-500">{station.city}</span>
                      {station.isTransfer && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 mt-1">
                          Transfer
                        </span>
                      )}
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
                ))}
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
              <li>Transfer times between lines may vary. Allow additional time when planning transfers.</li>
            </ul>
          </div>
        </div>
        
        {/* Route Map */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-black">MRT Jakarta Network Map</h2>
          
          {/* Network Map Visualization */}
          <div className="relative">
            {/* Blue Line (Main) */}
            <div className="absolute left-8 top-[65px] bottom-[300px] w-1 bg-blue-500"></div>
              {/* Red Line Branch */}
            <div className="absolute left-[390px] top-[783px] bottom-[380px] w-1 bg-red-500"></div>
            
            {/* Green Line Branch */}
            <div className="absolute left-[650px] top-[565px] bottom-[250px] w-1 bg-green-500"></div>
            
            {/* Blue Line Stations */}
            <div className="mt-4 mb-10">
              <div className="mb-4 flex items-center">
                <span className="font-bold text-black">Blue Line (North-South)</span>
              </div>
            </div>
            
            {lineStations.blue.map((station, index) => (
              <div key={station.id} className="ml-8 relative pb-8">
                <div className={`absolute left-[-29px] w-[17px] h-[17px] bg-white border-4 ${
                  station.isTransfer ? "border-purple-500" : "border-blue-500"
                } rounded-full`}></div>
                <div className="pl-6">
                  <h3 className="text-lg font-bold text-black">{station.name}</h3>
                  <p className="text-sm text-gray-600">{station.city}</p>
                  
                  {/* Show transfer information */}
                  {station.isTransfer && (
                    <div className="mt-1">
                      {station.connects && station.connects.includes("red") && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 mr-1">
                          Transfer to Red Line
                        </span>
                      )}
                      {station.connects && station.connects.includes("green") && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Transfer to Green Line
                        </span>
                      )}
                    </div>
                  )}
                  
                  {index < lineStations.blue.length - 1 && (
                    <p className="text-xs text-gray-500">3 minutes to next station</p>
                  )}
                    {/* Branch indicator for Istora Mandiri (connection to Red Line) */}
                  {station.id === 9 && (
                    <div className="absolute left-[160px] top-[20px] border-t-2 border-dashed border-red-500 w-[200px]"></div>
                  )}
                  
                  {/* Branch indicator for ASEAN (connection to Green Line) */}
                  {station.id === 7 && (
                    <div className="absolute left-[160px] top-[20px] border-t-2 border-dashed border-green-500 w-[460px]"></div>
                  )}
                </div>
              </div>
            ))}
              {/* Red Line Stations */}
            <div className="ml-[380px] mt-[-500px]">
              <div className="mb-4 flex items-center">
                <span className="font-bold text-black">Red Line (East Branch)</span>
              </div>
              
              {lineStations.red.map((station, index) => (
                <div key={station.id} className="relative pb-8">
                  <div className="absolute left-[-29px] w-[17px] h-[17px] bg-white border-4 border-red-500 rounded-full"></div>
                  <div className="pl-6">
                    <h3 className="text-lg font-bold text-black">{station.name}</h3>
                    <p className="text-sm text-gray-600">{station.city}</p>
                    {index < lineStations.red.length - 1 && (
                      <p className="text-xs text-gray-500">3 minutes to next station</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Green Line Stations */}
            <div className="ml-[650px] mt-[-250px]">
              <div className="mb-4 flex items-center">
                <span className="absolute left-[660px] font-bold text-black">Green Line (West Branch)</span>
              </div>
              
              {lineStations.green.map((station, index) => (
                <div key={station.id} className="relative pb-8">
                  <div className="absolute left-[-29px] w-[17px] h-[17px] bg-white border-4 border-green-500 rounded-full"></div>
                  <div className="pl-6">
                    <h3 className="text-lg font-bold text-black">{station.name}</h3>
                    <p className="text-sm text-gray-600">{station.city}</p>
                    {index < lineStations.green.length - 1 && (
                      <p className="text-xs text-gray-500">3 minutes to next station</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="font-bold text-lg text-black mb-2">Network Information</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span> Blue Line: Main north-south corridor with 13 stations</li>
                <li><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span> Red Line: East branch with 4 stations, connecting at Istora Mandiri</li>
                <li><span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span> Green Line: West branch with 4 stations, connecting at ASEAN</li>
                <li><span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2"></span> Transfer stations: Allow passengers to change between lines</li>
              </ul>
            </div>
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