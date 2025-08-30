import { auth } from '@/auth'
import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  Users,
  Flame,
  Star,
  ChefHat,
  Heart,
  Share2,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Utensils,
  Award,
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

                {/* Image Overlay Info */}
                <div className='absolute top-4 left-4 flex flex-col gap-2'>
                  <Badge className='bg-orange-500 text-white font-semibold'>
                    <ChefHat className='w-3 h-3 mr-1' />
                    {product.category}
                  </Badge>
                  {product.avgRating >= 4.5 && (
                    <Badge className='bg-amber-500 text-white font-semibold'>
                      <Award className='w-3 h-3 mr-1' />
                      Chef&apos;s Choice
                    </Badge>
                  )}
                  {product.tags?.includes('signature') && (
                    <Badge className='bg-red-500 text-white font-semibold'>
                      <Flame className='w-3 h-3 mr-1' />
                      Signature Dish
                    </Badge>
                  )}
                </div>

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
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='rounded-full'
                    >
                      <Heart className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      className='rounded-full'
                    >
                      <Share2 className='w-4 h-4' />
                    </Button>
                  </div>
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
                  <div className='flex items-center gap-1 text-gray-600'>
                    <Users className='w-4 h-4' />
                    <span>Serves 1-2</span>
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
              <Card className='border-orange-100 dark:border-orange-900/30 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'>
                <CardContent className='p-6 space-y-4'>
                  {/* Stock Status */}
                  <div className='flex items-center gap-2'>
                    {getCountInStockForSelectedVariant() > 0 ? (
                      <>
                        <CheckCircle className='w-5 h-5 text-green-600' />
                        <span className='text-green-700 font-semibold'>
                          Available
                        </span>
                        {getCountInStockForSelectedVariant() <= 3 && (
                          <Badge variant='destructive' className='ml-2'>
                            Only {getCountInStockForSelectedVariant()} left!
                          </Badge>
                        )}
                      </>
                    ) : (
                      <>
                        <AlertTriangle className='w-5 h-5 text-red-600' />
                        <span className='text-red-700 font-semibold'>
                          Out of Stock
                        </span>
                      </>
                    )}
                  </div>

                  {/* Add to Cart */}
                  {getCountInStockForSelectedVariant() !== 0 && (
                    <div className='space-y-3'>
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

                      {/* Quick Order Info */}
                      <div className='flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-orange-200 dark:border-orange-800'>
                        <span className='flex items-center gap-1'>
                          <ShoppingBag className='w-4 h-4' />
                          Free delivery over Kr 350
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          Ready in 15-20 min
                        </span>
                      </div>
                    </div>
                  )}
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
