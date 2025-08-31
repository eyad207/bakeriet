// Test script to verify Stripe webhook setup
// Run this with: node test-stripe-setup.js

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function testStripeSetup() {
  try {
    console.log('🧪 Testing Stripe setup...\n')

    // 1. Test Stripe connection
    console.log('1. Testing Stripe connection...')
    const account = await stripe.accounts.retrieve()
    console.log('✅ Connected to Stripe account:', account.display_name)
    console.log('   Country:', account.country)
    console.log('   Default currency:', account.default_currency)

    // 2. Test webhook endpoints
    console.log('\n2. Checking webhook endpoints...')
    const webhookEndpoints = await stripe.webhookEndpoints.list()
    console.log('📡 Found', webhookEndpoints.data.length, 'webhook endpoints:')

    webhookEndpoints.data.forEach((endpoint, index) => {
      console.log(`   ${index + 1}. ${endpoint.url}`)
      console.log(`      Status: ${endpoint.status}`)
      console.log(`      Events: ${endpoint.enabled_events.join(', ')}`)
      console.log('')
    })

    // 3. Check required environment variables
    console.log('3. Checking environment variables...')
    const requiredVars = [
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    ]

    requiredVars.forEach((varName) => {
      const value = process.env[varName]
      console.log(`   ${varName}: ${value ? '✅ Set' : '❌ Missing'}`)
    })

    console.log('\n🎉 Stripe setup test completed!')
  } catch (error) {
    console.error('❌ Stripe setup test failed:', error.message)
  }
}
// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testStripeSetup()
}

export { testStripeSetup }
module.exports = { testStripeSetup }
