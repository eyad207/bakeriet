import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(cwd())

async function verifyPersianProducts() {
  try {
    console.log('🔄 Connecting to database...')
    await connectToDatabase()

    // Find all Persian products by looking for products that contain Persian names or categories
    const persianProductNames = [
      'Kobideh',
      'Jojeh Kabab',
      'Bakhtiari',
      'Chenjeh',
      'Shishlik',
      'Mix av Koobideh og Joojeh',
      'Mix av Koobideh og Chenjeh',
      'Mix av Koobideh og Shishlik',
      'Kashk Badenjan',
      'Ghorme Sabzi',
      'Zeresk Polo ba Morgh',
      'Gheyme',
      'Rull Kebab',
      'Kylling Salat',
      'Mast Khiyar',
      'Doogh',
      'Mast Mosir',
      'Safaran Is',
      'Falode',
    ]

    console.log('📋 Checking Persian products in database...')

    for (const productName of persianProductNames) {
      const product = await Product.findOne({ name: productName })
      if (product) {
        console.log(
          `✅ Found: ${product.name} - ${product.price} NOK (${product.category})`
        )
      } else {
        console.log(`❌ Missing: ${productName}`)
      }
    }

    // Get total count
    const totalProducts = await Product.countDocuments()
    console.log(`\n📊 Total products in database: ${totalProducts}`)

    // Get count by categories
    const categories = await Product.distinct('category')
    console.log('\n📂 Products by category:')
    for (const category of categories) {
      const count = await Product.countDocuments({ category })
      console.log(`   ${category}: ${count} products`)
    }

    console.log('\n✅ Verification complete!')
  } catch (error) {
    console.error('💥 Error verifying products:', error)
  } finally {
    process.exit()
  }
}

verifyPersianProducts()
