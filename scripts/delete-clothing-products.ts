import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(cwd())

// Categories to delete (clothing and accessories)
const categoriesToDelete = [
  'Jeans',
  'T-Shirts',
  'Shoes',
  'Wrist Watches',
  'Shirts',
]

async function deleteClothingProducts() {
  try {
    console.log('Connecting to database...')
    await connectToDatabase(process.env.MONGODB_URI)

    console.log('Finding clothing products to delete...')

    // First, let's see what we're about to delete
    const productsToDelete = await Product.find({
      category: { $in: categoriesToDelete },
    })

    console.log(
      `\nFound ${productsToDelete.length} clothing products to delete:`
    )
    productsToDelete.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category})`)
    })

    if (productsToDelete.length === 0) {
      console.log('No clothing products found to delete.')
      return
    }

    console.log('\nDeleting clothing products...')

    // Delete the products
    const deleteResult = await Product.deleteMany({
      category: { $in: categoriesToDelete },
    })

    console.log(
      `\n✅ Successfully deleted ${deleteResult.deletedCount} clothing products!`
    )

    // Show remaining products
    console.log('\nChecking remaining products...')
    const remainingProducts = await Product.find({}).sort({ category: 1 })

    console.log(
      `\nRemaining products in database (${remainingProducts.length} total):`
    )
    const productsByCategory = remainingProducts.reduce(
      (acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = []
        }
        acc[product.category].push(product.name)
        return acc
      },
      {} as Record<string, string[]>
    )

    Object.entries(productsByCategory).forEach(([category, products]) => {
      console.log(`\n📂 ${category} (${products.length} products):`)
      products.forEach((name, index) => {
        console.log(`   ${index + 1}. ${name}`)
      })
    })

    console.log('\n🎉 Cleanup completed! Only Persian bakery products remain.')
  } catch (error) {
    console.error('Error deleting clothing products:', error)
  } finally {
    process.exit()
  }
}

// Run the script
deleteClothingProducts()
