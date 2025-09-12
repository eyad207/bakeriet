import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'
import Tag from '@/lib/db/models/tag.model'
import { IProductInput } from '@/types'
import { toSlug } from '@/lib/utils'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(cwd())

// Persian food products with matching images
const persianProducts: IProductInput[] = [
  // Kabab dishes - Main Dishes
  {
    name: 'Kobideh',
    slug: toSlug('Kobideh'),
    category: 'Main Dishes',
    images: ['/images/products/KOBIDEH.jpg'],
    tags: ['signature', 'grilled', 'lamb'],
    isPublished: true,
    price: 210,
    brand: 'Bakeriet',
    avgRating: 4.7,
    numReviews: 32,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 2 },
      { rating: 4, count: 10 },
      { rating: 5, count: 19 },
    ],
    numSales: 45,
    description:
      'To spyd kabab av lammekjøttdeig blandet med løk. Serveres med grillet tomat og safaran ris',
    colors: [
      {
        color: 'Fresh Grilled',
        sizes: [
          { size: 'Regular', countInStock: 15 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Jojeh Kabab',
    slug: toSlug('Jojeh Kabab'),
    category: 'Main Dishes',
    images: ['/images/products/JOJEKABAB.jpg'],
    tags: ['signature', 'grilled', 'chicken'],
    isPublished: true,
    price: 240,
    brand: 'Bakeriet',
    avgRating: 4.8,
    numReviews: 28,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 8 },
      { rating: 5, count: 18 },
    ],
    numSales: 38,
    description:
      'Et spyd kabab av marinert kyllingslår. Serveres med grillet tomat og safaran ris',
    colors: [
      {
        color: 'Fresh Grilled',
        sizes: [
          { size: 'Regular', countInStock: 12 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Bakhtiari',
    slug: toSlug('Bakhtiari'),
    category: 'Main Dishes',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.04.39_a1d75d04.jpg'],
    tags: ['signature', 'grilled', 'lamb', 'chicken'],
    isPublished: true,
    price: 259,
    brand: 'Bakeriet',
    avgRating: 4.9,
    numReviews: 25,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 5 },
      { rating: 5, count: 19 },
    ],
    numSales: 31,
    description:
      'Et spyd kabab av marinert lammefilet og kyllingslår. Serveres med grillet tomat og safaran ris',
    colors: [
      {
        color: 'Fresh Grilled',
        sizes: [
          { size: 'Regular', countInStock: 10 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Chenjeh',
    slug: toSlug('Chenjeh'),
    category: 'Main Dishes',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.04.39_bd8b8591.jpg'],
    tags: ['signature', 'grilled', 'lamb'],
    isPublished: true,
    price: 259,
    brand: 'Bakeriet',
    avgRating: 4.8,
    numReviews: 22,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 6 },
      { rating: 5, count: 14 },
    ],
    numSales: 29,
    description:
      'Et spyd kabab av marinert lammefilet. Serveres med grillet tomat og safaran ris',
    colors: [
      {
        color: 'Fresh Grilled',
        sizes: [
          { size: 'Regular', countInStock: 8 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Shishlik',
    slug: toSlug('Shishlik'),
    category: 'Main Dishes',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.04.47_2b14295b.jpg'],
    tags: ['signature', 'grilled', 'lamb', 'premium'],
    isPublished: true,
    price: 269,
    brand: 'Bakeriet',
    avgRating: 4.9,
    numReviews: 18,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 3 },
      { rating: 5, count: 14 },
    ],
    numSales: 24,
    description:
      'Et spyd lammecarre. Serveres med grillet tomat og safaran ris',
    colors: [
      {
        color: 'Fresh Grilled',
        sizes: [
          { size: 'Regular', countInStock: 6 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Mix av Koobideh og Joojeh',
    slug: toSlug('Mix av Koobideh og Joojeh'),
    category: 'Main Dishes',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.04.47_c4493dbd.jpg'],
    tags: ['signature', 'grilled', 'lamb', 'chicken', 'combo'],
    isPublished: true,
    price: 279,
    brand: 'Bakeriet',
    avgRating: 4.8,
    numReviews: 35,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 2 },
      { rating: 4, count: 10 },
      { rating: 5, count: 22 },
    ],
    numSales: 42,
    description:
      'Et spyd kabab av marinert kyllingsfilet, et spyd kabab av lammekjøttdeig blandet med løk. Serveres med grillet tomat og safaran ris',
    colors: [
      {
        color: 'Fresh Grilled',
        sizes: [
          { size: 'Regular', countInStock: 12 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Mix av Koobideh og Chenjeh',
    slug: toSlug('Mix av Koobideh og Chenjeh'),
    category: 'Main Dishes',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.04.47_c699ab23.jpg'],
    tags: ['signature', 'grilled', 'lamb', 'combo'],
    isPublished: true,
    price: 289,
    brand: 'Bakeriet',
    avgRating: 4.9,
    numReviews: 27,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 6 },
      { rating: 5, count: 20 },
    ],
    numSales: 33,
    description:
      'Et spyd kabab av marinert lammefilet og et spyd kabab av lammekjøttdeig blandet med løk. Serveres med grillet tomat og safaran ris',
    colors: [
      {
        color: 'Fresh Grilled',
        sizes: [
          { size: 'Regular', countInStock: 10 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Mix av Koobideh og Shishlik',
    slug: toSlug('Mix av Koobideh og Shishlik'),
    category: 'Main Dishes',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.04.48_0e60c1f4.jpg'],
    tags: ['signature', 'grilled', 'lamb', 'combo', 'premium'],
    isPublished: true,
    price: 299,
    brand: 'Bakeriet',
    avgRating: 4.9,
    numReviews: 21,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 1 },
      { rating: 4, count: 4 },
      { rating: 5, count: 16 },
    ],
    numSales: 28,
    description:
      'Et spyd lammecarre med et spyd kabab av lammekjøttdeig blandet med løk. Serveres med grillet tomat og safaran ris',
    colors: [
      {
        color: 'Fresh Grilled',
        sizes: [
          { size: 'Regular', countInStock: 8 },
        ],
      },
    ],
    reviews: [],
  },

  // Appetizers and Sides
  {
    name: 'Kashk Badenjan',
    slug: toSlug('Kashk Badenjan'),
    category: 'Appetizers',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.04.48_3402513a.jpg'],
    tags: ['vegetarian-friendly', 'traditional', 'appetizer'],
    isPublished: true,
    price: 99,
    brand: 'Bakeriet',
    avgRating: 4.6,
    numReviews: 15,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 3 },
      { rating: 4, count: 6 },
      { rating: 5, count: 6 },
    ],
    numSales: 22,
    description:
      'Aubergine, stekt mint, løk, hvitløk, kashk (tørket myse)',
    colors: [
      {
        color: 'Traditional',
        sizes: [
          { size: 'Regular', countInStock: 20 },
        ],
      },
    ],
    reviews: [],
  },

  // Rice Dishes and Stews
  {
    name: 'Ghorme Sabzi',
    slug: toSlug('Ghorme Sabzi'),
    category: 'Rice Dishes',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.04.48_42f01fe5.jpg'],
    tags: ['traditional', 'stew', 'lamb', 'herbs'],
    isPublished: true,
    price: 169,
    brand: 'Bakeriet',
    avgRating: 4.7,
    numReviews: 38,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 4 },
      { rating: 4, count: 12 },
      { rating: 5, count: 21 },
    ],
    numSales: 47,
    description:
      'Lammekjøtt, bønner, purre, persille, spinat, koriander, bukkehornkløver, soltørketlime. Serveres med safaran ris',
    colors: [
      {
        color: 'Traditional',
        sizes: [
          { size: 'Regular', countInStock: 15 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Zeresk Polo ba Morgh',
    slug: toSlug('Zeresk Polo ba Morgh'),
    category: 'Rice Dishes',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.04.48_7b7bfe83.jpg'],
    tags: ['traditional', 'chicken', 'rice-dish', 'berberis'],
    isPublished: true,
    price: 169,
    brand: 'Bakeriet',
    avgRating: 4.8,
    numReviews: 31,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 3 },
      { rating: 4, count: 8 },
      { rating: 5, count: 20 },
    ],
    numSales: 39,
    description:
      'Kokt kylling med krydder blanding, tomatpurre. Serveres med safaran ris med berberis, mandel og pistasje',
    colors: [
      {
        color: 'Traditional',
        sizes: [
          { size: 'Regular', countInStock: 12 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Gheyme',
    slug: toSlug('Gheyme'),
    category: 'Rice Dishes',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.06.26_b95e7ae8.jpg'],
    tags: ['traditional', 'stew', 'lamb'],
    isPublished: true,
    price: 169,
    brand: 'Bakeriet',
    avgRating: 4.6,
    numReviews: 24,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 3 },
      { rating: 4, count: 8 },
      { rating: 5, count: 12 },
    ],
    numSales: 32,
    description:
      'Lammekjøtt, tomatpurre, løk. Serveres med safaran ris',
    colors: [
      {
        color: 'Traditional',
        sizes: [
          { size: 'Regular', countInStock: 10 },
        ],
      },
    ],
    reviews: [],
  },

  // Light Meals
  {
    name: 'Rull Kebab',
    slug: toSlug('Rull Kebab'),
    category: 'Light Meals',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.06.27_1296e6d5.jpg'],
    tags: ['quick-bite', 'wrap', 'grilled'],
    isPublished: true,
    price: 119,
    brand: 'Bakeriet',
    avgRating: 4.5,
    numReviews: 42,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 6 },
      { rating: 4, count: 16 },
      { rating: 5, count: 17 },
    ],
    numSales: 65,
    description:
      'Et spyd koobideh med salat og saus',
    colors: [
      {
        color: 'Fresh',
        sizes: [
          { size: 'Regular', countInStock: 25 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Kylling Salat',
    slug: toSlug('Kylling Salat'),
    category: 'Salads',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.06.27_51dc0c1f.jpg'],
    tags: ['healthy', 'grilled', 'chicken', 'fresh'],
    isPublished: true,
    price: 159,
    brand: 'Bakeriet',
    avgRating: 4.4,
    numReviews: 28,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 1 },
      { rating: 3, count: 4 },
      { rating: 4, count: 12 },
      { rating: 5, count: 10 },
    ],
    numSales: 36,
    description:
      'Grillet kylling serveres med salat',
    colors: [
      {
        color: 'Fresh',
        sizes: [
          { size: 'Regular', countInStock: 18 },
        ],
      },
    ],
    reviews: [],
  },

  // Side dishes and drinks
  {
    name: 'Mast Khiyar',
    slug: toSlug('Mast Khiyar'),
    category: 'Sides',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.06.27_7e820cd1.jpg'],
    tags: ['side-dish', 'yogurt', 'traditional', 'cool'],
    isPublished: true,
    price: 35,
    brand: 'Bakeriet',
    avgRating: 4.3,
    numReviews: 19,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 4 },
      { rating: 4, count: 8 },
      { rating: 5, count: 6 },
    ],
    numSales: 28,
    description:
      'Yoghurt med agurk og tørket mynte',
    colors: [
      {
        color: 'Fresh',
        sizes: [
          { size: 'Regular', countInStock: 30 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Doogh',
    slug: toSlug('Doogh'),
    category: 'Beverages',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.06.27_c3c39137.jpg'],
    tags: ['drink', 'traditional', 'yogurt', 'refreshing'],
    isPublished: true,
    price: 35,
    brand: 'Bakeriet',
    avgRating: 4.2,
    numReviews: 16,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 6 },
      { rating: 5, count: 5 },
    ],
    numSales: 34,
    description:
      'Yoghurt med agurk og tørket mynte',
    colors: [
      {
        color: 'Traditional',
        sizes: [
          { size: 'Small', countInStock: 40 },
          { size: 'Large', countInStock: 25 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Mast Mosir',
    slug: toSlug('Mast Mosir'),
    category: 'Sides',
    images: ['/images/products/WhatsApp Bilde 2025-09-12 kl. 19.06.27_e854b639.jpg'],
    tags: ['side-dish', 'yogurt', 'traditional', 'persian-shallot'],
    isPublished: true,
    price: 35,
    brand: 'Bakeriet',
    avgRating: 4.4,
    numReviews: 12,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 3 },
      { rating: 4, count: 5 },
      { rating: 5, count: 4 },
    ],
    numSales: 18,
    description:
      'Yoghurt med persisk sjarlottløk',
    colors: [
      {
        color: 'Fresh',
        sizes: [
          { size: 'Regular', countInStock: 25 },
        ],
      },
    ],
    reviews: [],
  },

  // Desserts
  {
    name: 'Safaran Is',
    slug: toSlug('Safaran Is'),
    category: 'Desserts',
    images: ['/images/products/wcdqRsG9ntATYZgZGXPO8_1000x.webp'],
    tags: ['dessert', 'ice-cream', 'saffron', 'premium'],
    isPublished: true,
    price: 50,
    brand: 'Bakeriet',
    avgRating: 4.7,
    numReviews: 23,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 6 },
      { rating: 5, count: 15 },
    ],
    numSales: 31,
    description:
      'Premie is med safaran',
    colors: [
      {
        color: 'Golden Saffron',
        sizes: [
          { size: 'Single Scoop', countInStock: 30 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Falode',
    slug: toSlug('Falode'),
    category: 'Desserts',
    images: ['/images/products/The-Rich-History-of-Iranian-Desserts.jpg'],
    tags: ['dessert', 'traditional', 'cold', 'noodles'],
    isPublished: true,
    price: 50,
    brand: 'Bakeriet',
    avgRating: 4.5,
    numReviews: 18,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 2 },
      { rating: 4, count: 7 },
      { rating: 5, count: 8 },
    ],
    numSales: 24,
    description:
      'Tradisjonell persisk kald dessert med rice noodles i rosewater syrup',
    colors: [
      {
        color: 'Traditional',
        sizes: [
          { size: 'Regular', countInStock: 20 },
        ],
      },
    ],
    reviews: [],
  },
]

// Script to add Persian products to database
async function addPersianProducts() {
  try {
    console.log('🔄 Connecting to database...')
    await connectToDatabase()

    // Get all unique tag names from Persian products
    const allTagNames = [...new Set(persianProducts.flatMap(product => product.tags))]
    
    // Create tags that don't exist yet
    console.log('🏷️  Creating tags...')
    for (const tagName of allTagNames) {
      const existingTag = await Tag.findOne({ name: tagName })
      if (!existingTag) {
        await Tag.create({ name: tagName })
        console.log(`Created tag: ${tagName}`)
      }
    }

    // Get existing tags after creation
    const existingTags = await Tag.find({})
    const tagMap = new Map(
      existingTags.map((tag) => [tag.name, String(tag._id)])
    )

    console.log('📦 Adding Persian products...')

    // Create products with tag references
    const productsToAdd = persianProducts.map(product => ({
      ...product,
      tags: product.tags.map((tagName) => {
        const tagId = tagMap.get(tagName);
        return tagId || tagName; // Use ObjectId if exists, otherwise string
      }),
    }))

    // Add products
    for (const product of productsToAdd) {
      try {
        // Check if product already exists
        const existingProduct = await Product.findOne({ slug: product.slug })
        if (existingProduct) {
          console.log(`⚠️  Product "${product.name}" already exists, skipping...`)
          continue
        }

        await Product.create(product)
        console.log(`✅ Added: ${product.name} (${product.price} NOK)`)
      } catch (error) {
        console.error(`❌ Failed to add ${product.name}:`, error)
      }
    }

    console.log('🎉 Persian products added successfully!')
    console.log(`📊 Total products processed: ${persianProducts.length}`)
    
  } catch (error) {
    console.error('💥 Error adding Persian products:', error)
  } finally {
    process.exit()
  }
}

addPersianProducts()