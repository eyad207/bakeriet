import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'
import Tag from '@/lib/db/models/tag.model'
import { IProductInput } from '@/types'
import { toSlug } from '@/lib/utils'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(cwd())

// Products to add based on available images from the Persian bakery
const newProducts: IProductInput[] = [
  // Persian Breads
  {
    name: 'Barbari Bread - Traditional Persian Flatbread',
    slug: toSlug('Barbari Bread Traditional Persian Flatbread'),
    category: 'Breads',
    images: ['/images/products/Barbari-2.1200px.jpg'],
    tags: ['featured', 'traditional'],
    isPublished: true,
    price: 4.99,
    brand: 'Bakeriet',
    avgRating: 4.8,
    numReviews: 45,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 1 },
      { rating: 3, count: 3 },
      { rating: 4, count: 12 },
      { rating: 5, count: 28 },
    ],
    numSales: 156,
    description:
      'Authentic Persian Barbari bread, baked fresh daily. This traditional flatbread features a crispy crust and soft interior, perfect for any meal.',
    colors: [
      {
        color: 'Fresh Baked',
        sizes: [
          { size: 'Single Loaf', countInStock: 25 },
          { size: 'Pack of 3', countInStock: 15 },
          { size: 'Pack of 6', countInStock: 8 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Artisan Mixed Breads Collection',
    slug: toSlug('Artisan Mixed Breads Collection'),
    category: 'Breads',
    images: ['/images/products/Breadds.jpg'],
    tags: ['featured', 'artisan'],
    isPublished: true,
    price: 12.99,
    brand: 'Bakeriet',
    avgRating: 4.7,
    numReviews: 32,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 2 },
      { rating: 3, count: 3 },
      { rating: 4, count: 11 },
      { rating: 5, count: 16 },
    ],
    numSales: 89,
    description:
      'A delightful collection of our finest artisan breads, featuring traditional Persian and international varieties. Perfect for bread lovers.',
    colors: [
      {
        color: 'Mixed Variety',
        sizes: [
          { size: 'Small Box (4 pieces)', countInStock: 12 },
          { size: 'Medium Box (6 pieces)', countInStock: 8 },
          { size: 'Large Box (8 pieces)', countInStock: 5 },
        ],
      },
    ],
    reviews: [],
  },

  // Persian Main Dishes
  {
    name: 'Persian Beef & Lamb Kabob Platter',
    slug: toSlug('Persian Beef Lamb Kabob Platter'),
    category: 'Main Dishes',
    images: ['/images/products/Close-Up-persian-beef-and-lamb-kabob.jpg'],
    tags: ['signature', 'grilled'],
    isPublished: true,
    price: 24.99,
    brand: 'Bakeriet Kitchen',
    avgRating: 4.9,
    numReviews: 67,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 2 },
      { rating: 4, count: 8 },
      { rating: 5, count: 56 },
    ],
    numSales: 234,
    description:
      'Succulent Persian kabobs featuring tender marinated beef and lamb, grilled to perfection. Served with saffron rice and grilled vegetables.',
    colors: [
      {
        color: 'Full Portion',
        sizes: [
          { size: 'Single Serving', countInStock: 18 },
          { size: 'Double Portion', countInStock: 12 },
          { size: 'Family Size (4 servings)', countInStock: 6 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Dizi Sofali - Traditional Persian Lamb Stew',
    slug: toSlug('Dizi Sofali Traditional Persian Lamb Stew'),
    category: 'Stews',
    images: [
      '/images/products/Dizi-Sofali-–-Persischer-Lammeintopf-im-Tontopf.jpeg',
    ],
    tags: ['traditional', 'hearty'],
    isPublished: true,
    price: 18.99,
    brand: 'Bakeriet Kitchen',
    avgRating: 4.6,
    numReviews: 41,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 1 },
      { rating: 3, count: 4 },
      { rating: 4, count: 15 },
      { rating: 5, count: 20 },
    ],
    numSales: 127,
    description:
      'Authentic Dizi served in traditional clay pot. Slow-cooked lamb with chickpeas, white beans, and aromatic spices. A true Persian comfort food.',
    colors: [
      {
        color: 'Traditional Serving',
        sizes: [
          { size: 'Individual Pot', countInStock: 15 },
          { size: 'Sharing Pot (2-3 people)', countInStock: 8 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Khoresh Bademjan - Persian Eggplant Stew',
    slug: toSlug('Khoresh Bademjan Persian Eggplant Stew'),
    category: 'Stews',
    images: ['/images/products/Khoresh-Bademjan.jpg'],
    tags: ['vegetarian-friendly', 'traditional'],
    isPublished: true,
    price: 16.99,
    brand: 'Bakeriet Kitchen',
    avgRating: 4.5,
    numReviews: 38,
    ratingDistribution: [
      { rating: 1, count: 2 },
      { rating: 2, count: 1 },
      { rating: 3, count: 4 },
      { rating: 4, count: 13 },
      { rating: 5, count: 18 },
    ],
    numSales: 95,
    description:
      'Rich and flavorful Persian eggplant stew with tender lamb (or vegetarian option), tomatoes, and aromatic herbs. Served with basmati rice.',
    colors: [
      {
        color: 'With Lamb',
        sizes: [
          { size: 'Single Serving', countInStock: 12 },
          { size: 'Family Size', countInStock: 6 },
        ],
      },
      {
        color: 'Vegetarian',
        sizes: [
          { size: 'Single Serving', countInStock: 10 },
          { size: 'Family Size', countInStock: 5 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Braised Lamb Shanks - Persian Style',
    slug: toSlug('Braised Lamb Shanks Persian Style'),
    category: 'Main Dishes',
    images: ['/images/products/Lamb-Shanks-2.jpg'],
    tags: ['signature', 'slow-cooked'],
    isPublished: true,
    price: 28.99,
    brand: 'Bakeriet Kitchen',
    avgRating: 4.8,
    numReviews: 52,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 3 },
      { rating: 4, count: 12 },
      { rating: 5, count: 36 },
    ],
    numSales: 178,
    description:
      'Tender lamb shanks slow-braised in Persian spices, saffron, and aromatic herbs. Fall-off-the-bone tender and full of flavor.',
    colors: [
      {
        color: 'Classic Preparation',
        sizes: [
          { size: 'Single Shank', countInStock: 14 },
          { size: 'Double Shank', countInStock: 8 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Slow Cooker Persian Lamb',
    slug: toSlug('Slow Cooker Persian Lamb'),
    category: 'Main Dishes',
    images: ['/images/products/slow-cooker-persian-lamb-139103-1.jpg'],
    tags: ['comfort-food', 'slow-cooked'],
    isPublished: true,
    price: 22.99,
    brand: 'Bakeriet Kitchen',
    avgRating: 4.7,
    numReviews: 29,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 1 },
      { rating: 3, count: 2 },
      { rating: 4, count: 9 },
      { rating: 5, count: 17 },
    ],
    numSales: 86,
    description:
      'Tender Persian lamb slow-cooked with traditional spices, dried fruits, and aromatic herbs. A warming and satisfying meal.',
    colors: [
      {
        color: 'Traditional Style',
        sizes: [
          { size: 'Single Portion', countInStock: 16 },
          { size: 'Double Portion', countInStock: 10 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Moroccan-Style Tagine',
    slug: toSlug('Moroccan Style Tagine'),
    category: 'International',
    images: ['/images/products/tagine-ff6dcc0.jpg'],
    tags: ['international', 'aromatic'],
    isPublished: true,
    price: 21.99,
    brand: 'Bakeriet Kitchen',
    avgRating: 4.6,
    numReviews: 35,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 1 },
      { rating: 3, count: 3 },
      { rating: 4, count: 12 },
      { rating: 5, count: 18 },
    ],
    numSales: 102,
    description:
      'Authentic Moroccan tagine with tender meat, vegetables, and exotic spices. Slow-cooked in traditional clay pot for maximum flavor.',
    colors: [
      {
        color: 'Chicken Tagine',
        sizes: [
          { size: 'Individual Serving', countInStock: 12 },
          { size: 'Sharing Size', countInStock: 7 },
        ],
      },
      {
        color: 'Lamb Tagine',
        sizes: [
          { size: 'Individual Serving', countInStock: 10 },
          { size: 'Sharing Size', countInStock: 5 },
        ],
      },
    ],
    reviews: [],
  },

  // Desserts
  {
    name: 'Traditional Iranian Dessert Platter',
    slug: toSlug('Traditional Iranian Dessert Platter'),
    category: 'Desserts',
    images: ['/images/products/The-Rich-History-of-Iranian-Desserts.jpg'],
    tags: ['dessert', 'traditional', 'sweet'],
    isPublished: true,
    price: 15.99,
    brand: 'Bakeriet Sweets',
    avgRating: 4.9,
    numReviews: 48,
    ratingDistribution: [
      { rating: 1, count: 0 },
      { rating: 2, count: 0 },
      { rating: 3, count: 2 },
      { rating: 4, count: 6 },
      { rating: 5, count: 40 },
    ],
    numSales: 167,
    description:
      'A beautiful selection of traditional Iranian sweets including baklava, rosewater cookies, saffron ice cream, and Persian nougat.',
    colors: [
      {
        color: 'Assorted Selection',
        sizes: [
          { size: 'Small Platter (6 pieces)', countInStock: 20 },
          { size: 'Medium Platter (12 pieces)', countInStock: 15 },
          { size: 'Large Platter (18 pieces)', countInStock: 8 },
        ],
      },
    ],
    reviews: [],
  },

  // Specialty Items
  {
    name: 'Premium Iranian Saffron Rice',
    slug: toSlug('Premium Iranian Saffron Rice'),
    category: 'Sides',
    images: ['/images/products/wcdqRsG9ntATYZgZGXPO8_1000x.webp'],
    tags: ['premium', 'saffron', 'side-dish'],
    isPublished: true,
    price: 8.99,
    brand: 'Bakeriet Kitchen',
    avgRating: 4.8,
    numReviews: 73,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 1 },
      { rating: 3, count: 2 },
      { rating: 4, count: 15 },
      { rating: 5, count: 54 },
    ],
    numSales: 245,
    description:
      'Aromatic basmati rice cooked with premium Iranian saffron, creating a golden and fragrant side dish perfect with any Persian meal.',
    colors: [
      {
        color: 'Saffron Golden',
        sizes: [
          { size: 'Small (2 servings)', countInStock: 25 },
          { size: 'Medium (4 servings)', countInStock: 18 },
          { size: 'Large (6 servings)', countInStock: 12 },
        ],
      },
    ],
    reviews: [],
  },

  {
    name: 'Persian Lamb Biryani',
    slug: toSlug('Persian Lamb Biryani'),
    category: 'Rice Dishes',
    images: ['/images/products/web_lambiranian.webp'],
    tags: ['signature', 'rice-dish', 'lamb'],
    isPublished: true,
    price: 26.99,
    brand: 'Bakeriet Kitchen',
    avgRating: 4.7,
    numReviews: 44,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 1 },
      { rating: 3, count: 3 },
      { rating: 4, count: 13 },
      { rating: 5, count: 26 },
    ],
    numSales: 134,
    description:
      'Exquisite Persian-style lamb biryani with fragrant basmati rice, tender lamb, and traditional Persian spices. A royal feast.',
    colors: [
      {
        color: 'Traditional Style',
        sizes: [
          { size: 'Individual Portion', countInStock: 15 },
          { size: 'Sharing Portion (2-3 people)', countInStock: 8 },
          { size: 'Family Size (4-5 people)', countInStock: 4 },
        ],
      },
    ],
    reviews: [],
  },
]

async function addProducts() {
  try {
    console.log('Connecting to database...')
    await connectToDatabase(process.env.MONGODB_URI)

    // Ensure tags exist
    console.log('Ensuring tags exist...')
    const requiredTags = [
      { name: 'featured', _id: '1' },
      { name: 'traditional', _id: '2' },
      { name: 'artisan', _id: '3' },
      { name: 'signature', _id: '4' },
      { name: 'grilled', _id: '5' },
      { name: 'hearty', _id: '6' },
      { name: 'vegetarian-friendly', _id: '7' },
      { name: 'slow-cooked', _id: '8' },
      { name: 'comfort-food', _id: '9' },
      { name: 'international', _id: '10' },
      { name: 'aromatic', _id: '11' },
      { name: 'dessert', _id: '12' },
      { name: 'sweet', _id: '13' },
      { name: 'premium', _id: '14' },
      { name: 'saffron', _id: '15' },
      { name: 'side-dish', _id: '16' },
      { name: 'rice-dish', _id: '17' },
      { name: 'lamb', _id: '18' },
    ]

    for (const tagData of requiredTags) {
      const existingTag = await Tag.findOne({ name: tagData.name })
      if (!existingTag) {
        console.log(`Creating tag: ${tagData.name}`)
        await Tag.create({ name: tagData.name })
      }
    }

    // Get existing tags
    const existingTags = await Tag.find({})
    const tagMap = new Map(
      existingTags.map((tag) => [tag.name, String(tag._id)])
    )

    // Convert tag names to tag IDs for new products
    const productsWithTagIds = newProducts.map((product) => ({
      ...product,
      tags: product.tags.map((tagName) => tagMap.get(tagName) || tagName),
    }))

    console.log('Adding new products to database...')
    const createdProducts = await Product.insertMany(productsWithTagIds)

    console.log(`Successfully added ${createdProducts.length} products:`)
    createdProducts.forEach((product) => {
      console.log(`- ${product.name} (${product.category})`)
    })

    console.log('Products added successfully!')
  } catch (error) {
    console.error('Error adding products:', error)
  } finally {
    process.exit()
  }
}

// Run the script
addProducts()
