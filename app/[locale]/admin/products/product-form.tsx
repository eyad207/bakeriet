'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import { UploadButton } from '@/lib/uploadthing'
import { ProductInputSchema, ProductUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'
import { IProductInput } from '@/types'
import { useTranslations } from 'next-intl'

const productDefaultValues: IProductInput = {
  name: '',
  slug: '',
  category: '',
  images: [],
  description: '',
  price: 0,
  numReviews: 0,
  avgRating: 0,
  numSales: 0,
  isPublished: false,
  tags: [],
  colors: [],
  ratingDistribution: [],
  reviews: [],
}

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: IProduct
  productId?: string
}) => {
  const t = useTranslations('Admin')
  const router = useRouter()
  const [availableTags, setAvailableTags] = useState<
    { name: string; _id: string }[]
  >([])

  useEffect(() => {
    async function fetchTags() {
      const response = await fetch('/api/tags')
      const data = await response.json()
      if (data.success) setAvailableTags(data.tags)
    }
    fetchTags()
  }, [])

  const form = useForm<IProductInput>({
    resolver:
      type === 'Update'
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })

  const { toast } = useToast()
  async function onSubmit(values: IProductInput) {
    if (type === 'Create') {
      const res = await createProduct(values)
      if (!res.success) {
        toast({ variant: 'destructive', description: res.message })
      } else {
        toast({ description: res.message })
        router.push(`/admin/products`)
      }
    }
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`)
        return
      }
      const res = await updateProduct({ ...values, _id: productId })
      if (!res.success) {
        toast({ variant: 'destructive', description: res.message })
      } else {
        router.push(`/admin/products`)
      }
    }
  }

  const images = form.watch('images')

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control: form.control,
    name: 'colors',
  })

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      <div className='max-w-7xl mx-auto px-4 md:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6'>
            <h1 className='text-3xl font-bold text-slate-900 dark:text-white mb-2'>
              {type === 'Create' ? t('createProduct') : t('updateProduct')}
            </h1>
            <p className='text-slate-600 dark:text-slate-400'>
              {type === 'Create'
                ? 'Fill in the details below to create a new product'
                : 'Update your product information'}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            method='post'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8'
          >
            {/* General Information Section */}
            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden'>
              <div className='border-b border-slate-200 dark:border-slate-700 px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-blue-600 dark:text-blue-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>
                      {t('generalInformation')}
                    </h2>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      Basic product details and pricing
                    </p>
                  </div>
                </div>
              </div>

              <div className='p-6 space-y-6'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                          {t('name')} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('enterProductName')}
                            className='h-11 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              // Auto-generate slug when name changes
                              form.setValue('slug', toSlug(e.target.value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                          {t('category')} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('enterCategory')}
                            className='h-11 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <FormLabel className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                        {t('price')} *
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400'>
                            Kr
                          </span>
                          <Input
                            placeholder={t('enterProductPrice')}
                            className='h-11 pl-8 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Images Section */}
            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden'>
              <div className='border-b border-slate-200 dark:border-slate-700 px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-green-600 dark:text-green-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>
                      {t('images')}
                    </h2>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      Upload product images (first image will be the main
                      display)
                    </p>
                  </div>
                </div>
              </div>

              <div className='p-6'>
                <FormField
                  control={form.control}
                  name='images'
                  render={() => (
                    <FormItem className='space-y-4'>
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                        {images.map((image: string, index: number) => (
                          <div key={index} className='relative group'>
                            <div className='aspect-square rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 transition-colors'>
                              <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                fill
                                className='object-cover'
                              />
                              {index === 0 && (
                                <div className='absolute top-2 left-2'>
                                  <span className='bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full'>
                                    {t('main')}
                                  </span>
                                </div>
                              )}
                              <button
                                type='button'
                                onClick={() => {
                                  const updatedImages = images.filter(
                                    (_, i) => i !== index
                                  )
                                  form.setValue('images', updatedImages)
                                }}
                                className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className='border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors'>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            const newImages =
                              images.length === 0
                                ? [res[0].url]
                                : [...images, res[0].url]
                            form.setValue('images', newImages)
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            })
                          }}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Colors and Sizes */}
            <div className='space-y-5'>
              <h2 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
                {t('colorsAndSizes')}
              </h2>
              {colorFields.map((colorField, colorIndex) => (
                <div
                  key={colorField.id}
                  className='border p-4 rounded space-y-4 bg-muted/10'
                >
                  <div className='flex items-center gap-4'>
                    <FormField
                      control={form.control}
                      name={`colors.${colorIndex}.color`}
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormLabel>{t('color')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('enterColor')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant='destructive'
                      onClick={() => removeColor(colorIndex)}
                    >
                      {t('removeColor')}
                    </Button>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                    {(form.watch(`colors.${colorIndex}.sizes`) || []).map(
                      (size, sizeIndex) => (
                        <div
                          key={sizeIndex}
                          className='border p-3 rounded bg-white dark:bg-zinc-800 space-y-2'
                        >
                          <FormField
                            control={form.control}
                            name={`colors.${colorIndex}.sizes.${sizeIndex}.size`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('size')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('enterSize')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`colors.${colorIndex}.sizes.${sizeIndex}.countInStock`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('countInStock')}</FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    placeholder={t('enterCountInStock')}
                                    {...field}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value, 10)
                                      if (value >= 0) {
                                        field.onChange(value)
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() => {
                              const currentSizes = [
                                ...(form.getValues(
                                  `colors.${colorIndex}.sizes`
                                ) || []),
                              ]
                              currentSizes.splice(sizeIndex, 1)
                              form.setValue(
                                `colors.${colorIndex}.sizes`,
                                currentSizes
                              )
                            }}
                          >
                            {t('removeSize')}
                          </Button>
                        </div>
                      )
                    )}
                  </div>

                  <Button
                    type='button'
                    onClick={() => {
                      const currentSizes = [
                        ...(form.getValues(`colors.${colorIndex}.sizes`) || []),
                      ]
                      currentSizes.push({ size: '', countInStock: 0 })
                      form.setValue(`colors.${colorIndex}.sizes`, currentSizes)
                    }}
                  >
                    {t('addSize')}
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                onClick={() =>
                  appendColor({
                    color: '',
                    sizes: [{ size: '', countInStock: 0 }],
                  })
                }
              >
                {t('addColor')}
              </Button>
            </div>

            {/* Tags Section */}
            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden'>
              <div className='border-b border-slate-200 dark:border-slate-700 px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-orange-600 dark:text-orange-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>
                      {t('tags')}
                    </h2>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      Select relevant tags to help customers find your product
                    </p>
                  </div>
                </div>
              </div>

              <div className='p-6'>
                <FormField
                  control={form.control}
                  name='tags'
                  render={({ field }) => (
                    <FormItem>
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                        {availableTags.map((tag) => (
                          <label
                            key={tag._id}
                            className='group relative flex items-center space-x-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 cursor-pointer transition-colors'
                          >
                            <Checkbox
                              checked={field.value.includes(tag._id)}
                              onCheckedChange={(checked) => {
                                const newTags = checked
                                  ? [...field.value, tag._id]
                                  : field.value.filter((t) => t !== tag._id)
                                field.onChange(newTags)
                              }}
                              className='border-slate-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600'
                            />
                            <span className='text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'>
                              {tag.name}
                            </span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description Section */}
            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden'>
              <div className='border-b border-slate-200 dark:border-slate-700 px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-indigo-600 dark:text-indigo-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-white'>
                      {t('description')}
                    </h2>
                    <p className='text-sm text-slate-600 dark:text-slate-400'>
                      Provide a detailed description of your product
                    </p>
                  </div>
                </div>
              </div>

              <div className='p-6'>
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t('enterProductDescription')}
                          className='min-h-[120px] resize-none border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-indigo-500'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Publish Toggle */}
            <div className='space-y-5'>
              <FormField
                control={form.control}
                name='isPublished'
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-3'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{t('isPublished')}</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <div>
              <Button
                type='submit'
                size='lg'
                disabled={form.formState.isSubmitting}
                className='w-full text-lg font-bold'
              >
                {form.formState.isSubmitting
                  ? t('submitting')
                  : `${type === 'Create' ? t('createProduct') : t('updateProduct')}`}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ProductForm
