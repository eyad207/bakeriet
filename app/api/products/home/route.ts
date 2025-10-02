import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Product from '@/lib/db/models/product.model'
import Tag from '@/lib/db/models/tag.model'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Optimized API endpoint for homepage products
 * Returns essential data with aggressive caching
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'categories'
    const tagId = searchParams.get('tagId')
    const limit = parseInt(searchParams.get('limit') || '4')

    await connectToDatabase()

    if (type === 'tags') {
      // Fetch tags for homepage
      const tags = await Tag.find()
        .select('_id name')
        .sort({ name: 1 })
        .limit(8)
        .lean()
        .exec()

      return NextResponse.json(
        { success: true, data: tags },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      )
    }

    if (type === 'categories') {
      // Fetch categories with their representative images
      const categories = await Product.aggregate([
        { $match: { isPublished: true } },
        { $unwind: '$category' },
        {
          $group: {
            _id: '$category',
            image: { $first: { $arrayElemAt: ['$images', 0] } },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: limit },
        {
          $project: {
            name: '$_id',
            image: 1,
            _id: 0,
          },
        },
      ])

      return NextResponse.json(
        { success: true, data: categories },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      )
    }

    if (type === 'tag-products' && tagId) {
      // Fetch products for a specific tag
      const products = await Product.find({
        tags: tagId,
        isPublished: true,
      })
        .select(
          '_id name slug price images avgRating numReviews colors category tags brand discount discountedPrice'
        )
        .limit(limit)
        .lean()
        .exec()

      return NextResponse.json(
        { success: true, data: products },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=360',
          },
        }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Homepage products API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
