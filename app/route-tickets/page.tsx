'use client'

import Link from 'next/link'
import { useState } from 'react'

// Define ticket types with their details and prices
const ticketTypes = [
  { id: 'single', name: 'Single Trip', description: 'One-way journey', basePrice: 5000 },
  { id: 'return', name: 'Return Trip', description: 'Two-way journey (same day)', basePrice: 9000 },
  { id: 'day', name: 'Day Pass', description: 'Unlimited travel for one day', basePrice: 15000 },
]

// Calculate price based on distance (station count)
const calculatePrice = (fromStationId: number, toStationId: number, ticketTypeId: string) => {
  const stationDifference = Math.abs(fromStationId - toStationId)
  const basePrice = ticketTypes.find(ticket => ticket.id === ticketTypeId)?.basePrice || 0
  
  // Add 1000 IDR for each station in between
  return basePrice + (stationDifference * 1000)
}

// Generate a realistic PNR (Passenger Name Record)
const generatePNR = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const prefix = letters[Math.floor(Math.random() * letters.length)] + 
                 letters[Math.floor(Math.random() * letters.length)]
  
  // Generate 6 random digits
  const number = Math.floor(100000 + Math.random() * 900000)
  
  return `${prefix}${number}`
}

// Define OrderStatus type for ticket status tracking
type OrderStatus = 'upcoming' | 'completed' | 'cancelled'

// Define interface for order entries
interface Order {
  id: string
  fromStation: string
  fromStationId: number
  toStation: string
  toStationId: number
  departureDate: string
  departureTime: string
  arrivalTime: string
  ticketType: string
  price: number
  status: OrderStatus
  pnr: string
  line: string
}

export default function RouteTicketsPage() {
  // State for selected filter
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Mock orders data (would typically come from backend API)
  const orders: Order[] = [
    {
      id: '1',
      fromStation: 'Lebak Bulus Grab',
      fromStationId: 1,
      toStation: 'Bundaran HI',
      toStationId: 13,
      departureDate: '2025-05-26',
      departureTime: '08:00',
      arrivalTime: '08:30',
      ticketType: 'single',
      price: calculatePrice(1, 13, 'single'),
      status: 'upcoming',
      pnr: generatePNR(),
      line: 'blue'
    },
    {
      id: '2',
      fromStation: 'Blok M BCA',
      fromStationId: 6,
      toStation: 'Dukuh Atas BNI',
      toStationId: 12,
      departureDate: '2025-05-24',
      departureTime: '09:15',
      arrivalTime: '09:30',
      ticketType: 'single',
      price: calculatePrice(6, 12, 'single'),
      status: 'completed',
      pnr: generatePNR(),
      line: 'blue'
    },
    {
      id: '3',
      fromStation: 'ASEAN',
      fromStationId: 7,
      toStation: 'Palmerah',
      toStationId: 18,
      departureDate: '2025-05-27',
      departureTime: '10:45',
      arrivalTime: '10:48',
      ticketType: 'return',
      price: calculatePrice(7, 18, 'return'),
      status: 'upcoming',
      pnr: generatePNR(),
      line: 'green'
    },
    {
      id: '4',
      fromStation: 'Istora Mandiri',
      fromStationId: 9,
      toStation: 'Taman Anggrek',
      toStationId: 14,
      departureDate: '2025-05-25',
      departureTime: '14:15',
      arrivalTime: '14:19',
      ticketType: 'day',
      price: calculatePrice(9, 14, 'day'),
      status: 'upcoming',
      pnr: generatePNR(),
      line: 'red'
    },
    {
      id: '5',
      fromStation: 'Central Park',
      fromStationId: 15,
      toStation: 'Istora Mandiri',
      toStationId: 9,
      departureDate: '2025-05-20',
      departureTime: '16:30',
      arrivalTime: '16:39',
      ticketType: 'single',
      price: calculatePrice(15, 9, 'single'),
      status: 'cancelled',
      pnr: generatePNR(),
      line: 'red'
    }
  ]
  
  // Filter orders based on selected status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter)
    
  // Get status badge color and text
  const getStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case 'upcoming':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Upcoming</span>
      case 'completed':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Completed</span>
      case 'cancelled':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Cancelled</span>
    }
  }
  
  // Get line badge color and text
  const getLineBadge = (line: string) => {
    switch(line) {
      case 'blue':
        return <span className="inline-flex items-center rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">Blue Line</span>
      case 'red':
        return <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">Red Line</span>
      case 'green':
        return <span className="inline-flex items-center rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">Green Line</span>
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="w-full bg-blue-700 text-white py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="text-2xl font-bold mr-2">🚄</div>
          <h1 className="text-2xl font-bold">Railnet</h1>
        </Link>
        <div className="hidden sm:flex space-x-6">
          <Link href="/schedule" className="hover:underline">Schedule</Link>
          <Link href="/route-tickets" className="font-bold">Route & Tickets</Link>
          <Link href="#" className="hover:underline">Help</Link>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="w-full max-w-6xl px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-black text-center">My Tickets</h1>
          
          {/* Filter Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex flex-wrap -mb-px">
              <button 
                onClick={() => setStatusFilter('all')} 
                className={`mr-2 inline-block p-4 border-b-2 ${
                  statusFilter === 'all' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                All Tickets
              </button>
              <button 
                onClick={() => setStatusFilter('upcoming')} 
                className={`mr-2 inline-block p-4 border-b-2 ${
                  statusFilter === 'upcoming' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                Upcoming
              </button>
              <button 
                onClick={() => setStatusFilter('completed')} 
                className={`mr-2 inline-block p-4 border-b-2 ${
                  statusFilter === 'completed' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                Completed
              </button>
              <button 
                onClick={() => setStatusFilter('cancelled')} 
                className={`mr-2 inline-block p-4 border-b-2 ${
                  statusFilter === 'cancelled' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
          
          {/* Tickets Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PNR
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.pnr}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {order.fromStation} → {order.toStation}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getLineBadge(order.line)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900">
                            {new Date(order.departureDate).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.departureTime} - {order.arrivalTime}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900">
                            {ticketTypes.find(t => t.id === order.ticketType)?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ticketTypes.find(t => t.id === order.ticketType)?.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Rp {order.price.toLocaleString('id-ID')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-blue-600 hover:text-blue-900 mr-3">View</a>
                        {order.status === 'upcoming' && (
                          <a href="#" className="text-red-600 hover:text-red-900">Cancel</a>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-gray-500">No tickets found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets found</h3>
              <p className="text-gray-500">Try adjusting your filter or book a new ticket</p>
              <Link href="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Book a Ticket
              </Link>
            </div>
          )}
          
          {/* Info Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Ticket Information</h3>
              <p className="text-sm text-gray-600">
                All tickets are electronic. You can show the QR code or PNR at the station gate for entry.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-800 mb-2">Refund Policy</h3>
              <p className="text-sm text-gray-600">
                Tickets can be cancelled up to 1 hour before departure for a full refund.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600">
                Contact our customer service at 021-123-4567 or email at support@railnet.com
              </p>
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