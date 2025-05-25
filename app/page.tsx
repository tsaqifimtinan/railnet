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

export default function Home() {
  const [fromStation, setFromStation] = useState('')
  const [toStation, setToStation] = useState('')
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  
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
  }
    // Handler for search button
  const handleSearch = () => {
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
    
    // Navigate to route-tickets page
    window.location.href = '/route-tickets'
    setError('')
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
              {stations.map((station) => (
                <option key={station.id} value={station.name}>
                  {station.name}, {station.city}
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
              {stations.map((station) => (
                <option key={station.id} value={station.name}>
                  {station.name}, {station.city}
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow transition duration-200"
        >
          Search Trains
        </button>
      </div>
      
      {/* Features Section */}
      <div className="w-full max-w-6xl px-4 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Why Choose Railnet?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Fast Connections</h3>
            <p className="text-gray-600">High-speed trains connecting major cities with minimal stops and maximum comfort.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
            <p className="text-gray-600">Reduce your carbon footprint by choosing rail travel over cars or planes.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
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
    </main>
  )
}
