'use client'

import { fetchFindPage, fetchGetBrands } from '@/redux/products.slice'
import { useAppDispatch } from '@/redux/store'
import { useTheme } from 'next-themes'
import { Outfit } from 'next/font/google'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, lazy, useEffect, useState } from 'react'
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai'
import { MdOutlinePlaylistAdd } from 'react-icons/md'
import Select, { SingleValue } from 'react-select'
import PriceFilter from '../components/price.filter'
import { Product } from '../components/product.component'

const outfit = Outfit({ subsets: ['latin'], weight: ['300'] })

const ProductsList = lazy(() => import('../components/products.list'))

interface sus {
	value: string
	label: string
}

const customStyles = (theme: string | undefined) => ({
	control: (styles: any) => ({
		...styles,
		backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
		color: theme === 'dark' ? '#ffffff' : '#000000',
	}),
	menu: (styles: any) => ({
		...styles,
		backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
		color: theme === 'dark' ? '#ffffff' : '#000000',
	}),
	singleValue: (styles: any) => ({
		...styles,
		color: theme === 'dark' ? '#ffffff' : '#000000',
	}),
})

const categoryOptions = [
	{ value: '', label: 'All categories' },
	{ value: 'desktop', label: 'Desktop' },
	{ value: 'console', label: 'Console' },
	{ value: 'furniture', label: 'Furniture' },
	{ value: 'another', label: 'Another' },
]

const sortOptions = [
	{ value: '', label: 'Sort' },
	{ value: 'bestsellers', label: 'Best sellers' },
	{ value: 'cheap', label: 'Cheap first' },
	{ value: 'expensive', label: 'Expensive first' },
]

const CatalogPage: React.FC = () => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const dispatch = useAppDispatch()
	const { theme } = useTheme()

	const category = searchParams.get('c') || 'all'
	const brand = searchParams.get('b') || ''
	const sort = searchParams.get('s') || 'sort'
	const pricemin = searchParams.get('pm') || ''
	const pricemax = searchParams.get('px') || ''

	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [products, setProducts] = useState<Product[]>([])
	const [brands, setBrands] = useState<sus[]>([])

	const fetchPageData = async () => {
		const data = { page, category, brand, sort, pricemin, pricemax }
		const resultFindPage = await dispatch(fetchFindPage(data))
		const resultGetBrands = await dispatch(fetchGetBrands())

		const allBrandsOption = { value: '', label: 'All brands' }
		const brandsWithAllOption: any = [
			allBrandsOption,
			...(resultGetBrands.payload?.brands || []),
		]

		setTotalPages(resultFindPage.payload?.totalPages || 1)
		setProducts(resultFindPage.payload?.products || [])
		setBrands(brandsWithAllOption)
	}

	useEffect(() => {
		fetchPageData()
	}, [page, category, brand, sort, pricemin, pricemax])

	const handlePageChange = (newPage: number) => {
		setPage(newPage)
		const newSearchParams = new URLSearchParams(searchParams.toString())
		newSearchParams.set('page', newPage.toString())
		router.push(`?${newSearchParams.toString()}`)
	}

	const handleSortChange = (
		selectedOption: SingleValue<{ value: string; label: string }>
	) => {
		setPage(1)
		const newSearchParams = new URLSearchParams(searchParams.toString())
		if (selectedOption && selectedOption.value) {
			newSearchParams.set('s', selectedOption.value)
		} else {
			newSearchParams.delete('s')
		}
		router.push(`?${newSearchParams.toString()}`)
	}

	const handleBrandChange = (
		selectedOption: SingleValue<{ value: string; label: string }>
	) => {
		setPage(1)
		const newSearchParams = new URLSearchParams(searchParams.toString())
		if (selectedOption && selectedOption.value) {
			newSearchParams.set('b', selectedOption.value)
		} else {
			newSearchParams.delete('b')
		}
		router.push(`?${newSearchParams.toString()}`)
	}

	const handleCategoryChange = (
		selectedOption: SingleValue<{ value: string; label: string }>
	) => {
		setPage(1)
		const newSearchParams = new URLSearchParams(searchParams.toString())
		if (selectedOption && selectedOption.value) {
			newSearchParams.set('c', selectedOption.value)
		} else {
			newSearchParams.delete('c')
		}
		router.push(`?${newSearchParams.toString()}`)
	}

	return (
		<div
			className={`flex pt-16 flex-col px-[15px] sm:px-[20px] md:px-[60px] xl:px-[200px] w-full items-center ${outfit.className}`}
		>
			<div className='path flex gap-3 items-center justify-center mt-6 w-full'>
				<Link href='/'>
					<AiOutlineHome size='20px' />
				</Link>
				<p className='unselectable'>/</p>
				<p className='unselectable'>Catalog</p>
			</div>
			<div className='flex gap-1 mt-6 w-full items-center justify-center'>
				<div className='relative w-1/2 flex'>
					<AiOutlineSearch
						className='absolute mt-[2px] top-3 left-3 text-gray-500'
						size='20px'
					/>
					<input
						placeholder='Search our products, brands & services'
						className='pl-10 bg-cartColor rounded-[8px] w-full h-12 focus:outline-none'
					/>
				</div>
				<button
					onClick={() => router.push('/product/new')}
					className='flex justify-center items-center bg-cartColor rounded-[8px] w-12 h-12'
				>
					<MdOutlinePlaylistAdd size={'25px'} />
				</button>
			</div>
			<div className='flex gap-2 pb-12 sm:pb-0 mt-10 w-full h-24 sm:h-10 justify-between'>
				<div className='flex gap-2 flex-col sm:flex-row w-full'>
					<div className='w-full'>
						<Select
							onChange={handleCategoryChange}
							options={categoryOptions}
							styles={customStyles(theme)}
							defaultValue={categoryOptions.find(c => c.value === category)}
							placeholder='Select a category'
						/>
					</div>
					<PriceFilter />
				</div>
				<div className='flex gap-2 flex-col sm:flex-row w-full'>
					<div className='w-full'>
						<Select
							onChange={(
								newValue:
									| SingleValue<{ value: string; label: string }>
									| undefined
							) => {
								if (newValue) {
									console.log(newValue.value)
								}
							}}
							options={brands}
							styles={customStyles(theme)}
							defaultValue={brands.find(b => b.value === brand)}
							placeholder='Select a brand'
						/>
					</div>
					<div className='w-full'>
						<Select
							onChange={handleSortChange}
							options={sortOptions}
							styles={customStyles(theme)}
							defaultValue={sortOptions.find(s => s.value === sort)}
							placeholder='Sort by'
						/>
					</div>
				</div>
			</div>
			<Suspense fallback={<div>Loading products...</div>}>
				<div className='mt-10 w-full'>
					<ProductsList
						products={products}
						totalPages={totalPages}
						page={page}
						handlePageChange={handlePageChange}
					/>
				</div>
			</Suspense>
		</div>
	)
}

export default CatalogPage
