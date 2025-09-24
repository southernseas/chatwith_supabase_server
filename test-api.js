// Test script for the Next.js Supabase API
// Run with: node test-api.js
//const API_BASE_URL = 'http://localhost:3000/api' // Change to your deployed URL
const API_BASE_URL = 'https://chatwith-supabase-server.vercel.app/api' // Change to your deployed URL
async function testNotificationAPI() {
  console.log('🧪 Testing Notification API...\n')
  
  // Test data
  const testData = {
    lastname: 'Smith',
    firstname: 'John',
    email: 'john.smith@example.com',
    subject: 'Test Notification',
    details: 'This is a test notification from the API test script'
  }
  
  try {
    // Test POST /api/notifications
    console.log('📝 Testing POST /api/notifications...')
    const postResponse = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    const postResult = await postResponse.json()
    console.log('POST Response:', JSON.stringify(postResult, null, 2))
    
    if (postResult.success) {
      console.log('✅ POST test passed\n')
    } else {
      console.log('❌ POST test failed\n')
    }
    
    // Test GET /api/notifications/get
    console.log('📖 Testing GET /api/notifications/get...')
    const getResponse = await fetch(`${API_BASE_URL}/notifications/get?limit=5`)
    const getResult = await getResponse.json()
    console.log('GET Response:', JSON.stringify(getResult, null, 2))
    
    if (getResult.success) {
      console.log('✅ GET test passed\n')
    } else {
      console.log('❌ GET test failed\n')
    }
    
    // Test validation with invalid data
    console.log('🔍 Testing validation with invalid data...')
    const invalidData = {
      lastname: '', // Invalid: empty
      firstname: 'Jane',
      email: 'invalid-email', // Invalid: not a proper email
      subject: 'Test',
      details: 'Test details'
    }
    
    const validationResponse = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData)
    })
    
    const validationResult = await validationResponse.json()
    console.log('Validation Response:', JSON.stringify(validationResult, null, 2))
    
    if (!validationResult.success && validationResult.details) {
      console.log('✅ Validation test passed - correctly rejected invalid data\n')
    } else {
      console.log('❌ Validation test failed - should have rejected invalid data\n')
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Run the test
testNotificationAPI()
