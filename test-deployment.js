#!/usr/bin/env node

// Test script for API endpoints
// Using built-in fetch available in Node.js 18+

const API_BASE = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5328';

async function testEndpoints() {
  console.log(`Testing API at: ${API_BASE}`);
  
  try {    // Test health check
    console.log('\n1. Testing health check endpoint...');
    const healthResponse = await fetch(`${API_BASE}/api/python`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status, healthResponse.statusText);
    }

    // Test shortest route endpoint
    console.log('\n2. Testing shortest route endpoint...');
    const routeResponse = await fetch(`${API_BASE}/api/shortest-route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BNR',
        to: 'LEB'
      })
    });
    
    if (routeResponse.ok) {
      const routeData = await routeResponse.json();
      console.log('✅ Route calculation passed');
      console.log('Distance:', routeData.route.shortest_distance.distance_km, 'km');
      console.log('Price:', routeData.route.shortest_distance.price_idr, 'IDR');
    } else {
      console.log('❌ Route calculation failed:', routeResponse.status, routeResponse.statusText);
      const errorText = await routeResponse.text();
      console.log('Error details:', errorText);
    }    // Test network analysis endpoint
    console.log('\n3. Testing network analysis endpoint...');
    const analysisResponse = await fetch(`${API_BASE}/api/network-analysis`);
    if (analysisResponse.ok) {
      const analysisData = await analysisResponse.json();
      console.log('✅ Network analysis passed');
      console.log('Total stations:', analysisData.network_stats.total_stations);
      console.log('Network length:', analysisData.network_stats.total_length_km, 'km');
    } else {
      console.log('❌ Network analysis failed:', analysisResponse.status, analysisResponse.statusText);
    }

  } catch (error) {
    console.error('Test failed with error:', error.message);
  }
}

testEndpoints();
