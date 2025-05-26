// Test script for Flask API

async function testFlaskApi() {
  try {
    console.log('Testing Flask API at https://railnet-backend.vercel.app/api/shortest-route...');
    const response = await fetch('https://railnet-backend.vercel.app/api/shortest-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BNR', // Bundaran HI
        to: 'LEB'    // Lebak Bulus Grab
      }),
    });

    if (!response.ok) {
      console.error(`❌ API test failed with status: ${response.status}`);
      const text = await response.text();
      console.error('Response body (first 100 chars):', text.substring(0, 100));
      return;
    }

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('\n✅ API test successful!');
  } catch (error) {
    console.error('Error testing API:', error.message);
    console.error('\nMake sure your Flask API is running on http://localhost:5328');
  }
}

testFlaskApi();