import { auth } from '@/auth'
import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.actions'
import ReviewList from './review-list'
import { generateId, round2 } from '@/lib/utils'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import AddToBrowsingHistory from '@/components/shared/product/add-to-browsing-history'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import RatingSummary from '@/components/shared/product/rating-summary'
import ProductSlider from '@/components/shared/product/product-slider'
import TranslatedText from '@/components/shared/translated-text'
import { getTranslations } from 'next-intl/server'
import {
  Clock,
  Star,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Utensils,
  Info,
} from 'lucide-react'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const t = await getTranslations()
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return { title: t('Product.Product not found') }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams

  const { page, color, size } = searchParams

  const params = await props.params

  const { slug } = params

  const session = await auth()

  const product = await getProductBySlug(slug)

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id,
    page: Number(page || '1'),
  })

  const t = await getTranslations()

  const selectedColor = color || product.colors[0]?.color
  const selectedSize = size || product.colors[0]?.sizes[0]?.size

  const getSizesForColor = (color: string) => {
    const colorObj = product.colors.find((c) => c.color === color)
    return colorObj ? colorObj.sizes : []
  }

  const getCountInStockForSelectedVariant = () => {
    const sizes = getSizesForColor(selectedColor)
    const sizeObj = sizes.find((s) => s.size === selectedSize)
    return sizeObj ? sizeObj.countInStock : 0
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900'>
      <AddToBrowsingHistory id={product._id} category={product.category} />

      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10 dark:from-orange-900/20 dark:to-amber-900/20' />
        <div className='container mx-auto px-4 py-8 relative'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start'>
            {/* Product Images */}
            <div className='lg:sticky lg:top-8'>
              <div className='bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl overflow-hidden border border-orange-100 dark:border-orange-900/30'>
                <ProductGallery images={product.images} />
                {/* Discount Badge */}
                {product.discount && (
                  <div className='absolute top-4 right-4'>
                    <div className='bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse'>
                      {Math.round(product.discount)}% OFF
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className='space-y-6'>
              {/* Header */}
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Badge
                    variant='outline'
                    className='text-orange-600 border-orange-200'
                  >
                    {product.brand}
                  </Badge>
                </div>

                <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight'>
                  <TranslatedText
                    text={product.name}
                    fallback={product.name}
                    enableTranslation={true}
                  />
                </h1>

                {/* Rating and Quick Info */}
                <div className='flex flex-wrap items-center gap-4'>
                  <div className='flex items-center gap-1'>
                    <div className='flex items-center'>
                      <Star className='w-5 h-5 fill-amber-400 text-amber-400' />
                      <span className='font-bold text-lg ml-1'>
                        {product.avgRating.toFixed(1)}
                      </span>
                    </div>
                    <span className='text-gray-500'>
                      ({product.numReviews} reviews)
                    </span>
                  </div>
                  <div className='flex items-center gap-1 text-gray-600'>
                    <Clock className='w-4 h-4' />
                    <span>15-20 min</span>
                  </div>
                </div>

                {/* Price */}
                <div className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-6 border border-orange-100 dark:border-orange-900/30'>
                  <ProductPrice
                    price={product.price}
                    discountedPrice={product.discountedPrice ?? undefined}
                    isDeal={product.tags?.includes('todays-deal')}
                    forListing={false}
                  />
                </div>
              </div>

              {/* Description */}
              <Card className='border-orange-100 dark:border-orange-900/30'>
                <CardContent className='p-6'>
                  <div className='flex items-center gap-2 mb-4'>
                    <Info className='w-5 h-5 text-orange-600' />
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                      {t('Product.Description')}
                    </h3>
                  </div>
                  <div className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                    <TranslatedText
                      text={product.description}
                      fallback={product.description}
                      enableTranslation={true}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Variant Selection */}
              <Card className='border-orange-100 dark:border-orange-900/30'>
                <CardContent className='p-6'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                    <Utensils className='w-5 h-5 text-orange-600' />
                    Customize Your Order
                  </h3>
                  <SelectVariant
                    product={product}
                    size={selectedSize}
                    color={selectedColor}
                  />
                </CardContent>
              </Card>

              {/* Stock Status & Add to Cart */}
              <Card className='border-orange-100 dark:border-orange-900/30 bg-white dark:bg-zinc-800 shadow-lg'>
                <CardContent className='p-6'>
                  <div className='space-y-6'>
                    {/* Stock Status Header */}
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                        <ShoppingBag className='w-5 h-5 text-orange-600' />
                        Availability
                      </h3>
                      {getCountInStockForSelectedVariant() > 0 ? (
                        <Badge className='bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'>
                          <CheckCircle className='w-3 h-3 mr-1' />
                          In Stock
                        </Badge>
                      ) : (
                        <Badge
                          variant='destructive'
                          className='bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                        >
                          <AlertTriangle className='w-3 h-3 mr-1' />
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Stock Details */}
                    <div className='bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-zinc-800 dark:to-zinc-700/50 rounded-xl p-4 border border-gray-200 dark:border-zinc-700'>
                      {getCountInStockForSelectedVariant() > 0 ? (
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <span className='text-gray-700 dark:text-gray-300 font-medium'>
                              Stock Level:
                            </span>
                            <div className='flex items-center gap-2'>
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  getCountInStockForSelectedVariant() > 10
                                    ? 'bg-green-500'
                                    : getCountInStockForSelectedVariant() > 3
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                }`}
                              />
                              <span className='font-semibold text-gray-900 dark:text-gray-100'>
                                {getCountInStockForSelectedVariant()} available
                              </span>
                            </div>
                          </div>

                          {getCountInStockForSelectedVariant() <= 3 && (
                            <div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3'>
                              <div className='flex items-center gap-2 text-amber-800 dark:text-amber-300'>
                                <AlertTriangle className='w-4 h-4' />
                                <span className='text-sm font-medium'>
                                  Low stock - Only{' '}
                                  {getCountInStockForSelectedVariant()} left!
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Order Benefits */}
                          <div className='grid grid-cols-2 gap-3 mt-4'>
                            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                              <div className='w-2 h-2 bg-green-500 rounded-full' />
                              <span>Fresh ingredients</span>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                              <div className='w-2 h-2 bg-blue-500 rounded-full' />
                              <span>Made to order</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className='text-center py-4'>
                          <AlertTriangle className='w-8 h-8 text-red-500 mx-auto mb-2' />
                          <p className='text-red-700 dark:text-red-400 font-medium'>
                            This item is currently out of stock
                          </p>
                          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                            Check back soon or try another variant
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Section */}
                    {getCountInStockForSelectedVariant() > 0 && (
                      <div className='space-y-4'>
                        <div className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800'>
                          <AddToCart
                            item={{
                              clientId: generateId(),
                              product: product._id,
                              name: product.name,
                              slug: product.slug,
                              category: product.category,
                              price: round2(product.price),
                              discountedPrice: product.discountedPrice
                                ? round2(product.discountedPrice)
                                : undefined,
                              discount: product.discount || undefined,
                              quantity: 1,
                              image: product.images[0],
                              size: selectedSize,
                              color: selectedColor,
                              colors: product.colors,
                            }}
                            selectedSize={selectedSize}
                          />
                        </div>

                        {/* Order Information */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-zinc-700'>
                          <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800'>
                            <div className='flex items-center gap-2 text-blue-700 dark:text-blue-300'>
                              <ShoppingBag className='w-4 h-4' />
                              <span className='text-sm font-medium'>
                                Free Delivery
                              </span>
                            </div>
                            <p className='text-xs text-blue-600 dark:text-blue-400 mt-1'>
                              On orders over Kr 350
                            </p>
                          </div>

                          <div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800'>
                            <div className='flex items-center gap-2 text-green-700 dark:text-green-300'>
                              <Clock className='w-4 h-4' />
                              <span className='text-sm font-medium'>
                                Quick Preparation
                              </span>
                            </div>
                            <p className='text-xs text-green-600 dark:text-green-400 mt-1'>
                              Ready in 15-20 minutes
                            </p>
                          </div>
                        </div>

                        {/* Additional Features */}
                        <div className='flex flex-wrap gap-2 pt-2'>
                          <Badge
                            variant='outline'
                            className='text-xs border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300'
                          >
                            ✨ Freshly prepared
                          </Badge>
                          <Badge
                            variant='outline'
                            className='text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-300'
                          >
                            🌱 Local ingredients
                          </Badge>
                          <Badge
                            variant='outline'
                            className='text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300'
                          >
                            🚚 Fast delivery
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Rating Summary */}
              <Card className='border-orange-100 dark:border-orange-900/30'>
                <CardContent className='p-6'>
                  <RatingSummary
                    avgRating={product.avgRating}
                    numReviews={product.numReviews}
                    asPopover={false}
                    ratingDistribution={product.ratingDistribution}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className='container mx-auto px-4 py-12'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
              {t('Product.Customer Reviews')}
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              See what our customers are saying about this dish
            </p>
          </div>

          <Card className='border-orange-100 dark:border-orange-900/30 shadow-lg'>
            <CardContent className='p-8'>
              <ReviewList product={product} userId={session?.user.id} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Products Section */}
      <section className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 py-12'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                {t('Product.Best Sellers in', { name: product.category })}
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                You might also enjoy these popular dishes
              </p>
            </div>

            <Card className='border-orange-100 dark:border-orange-900/30 shadow-lg overflow-hidden'>
              <CardContent className='p-6'>
                <ProductSlider products={relatedProducts.data} title='' />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Browsing History Section */}
      <section className='container mx-auto px-4 py-12'>
        <div className='max-w-6xl mx-auto'>
          <Card className='border-orange-100 dark:border-orange-900/30 shadow-lg'>
            <CardContent className='p-6'>
              <BrowsingHistoryList />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
