'use client'

import { fetchFindPage, fetchGetBrands } from '@/redux/products.slice'
import { useAppDispatch } from '@/redux/store'
import { useTheme } from 'next-themes'
import { Outfit } from 'next/font/google'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai'
import { MdOutlinePlaylistAdd } from 'react-icons/md'
import Select, { SingleValue } from 'react-select'
import PriceFilter from '../components/price.filter'
import ProductComponent, { Product } from '../components/product.component'

const outfit = Outfit({ subsets: ['latin'], weight: ['300'] })

const customStyles = (theme: string | undefined) => ({
	control: (provided: any, state: any) => ({
		...provided,
		borderRadius: '8px',
		backgroundColor: theme === 'dark' ? '#252525' : 'white',
		color: theme === 'dark' ? 'white' : '#252525',
		borderColor: state.isFocused
			? theme === 'dark'
				? 'white'
				: '#dddbe0'
			: theme === 'dark'
			? '#45484f'
			: '#dddbe0',
		boxShadow: state.isFocused
			? `0 0 0 1px ${theme === 'dark' ? '#45484f' : '#dddbe0'}`
			: 'none',
		transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
		borderWidth: '1px',
		'&:hover': {
			borderColor: theme === 'dark' ? '#333' : '#f0f0f0',
		},
	}),
	option: (provided: any, state: any) => ({
		...provided,
		backgroundColor: state.isSelected
			? theme === 'dark'
				? '#18181a'
				: '#dddbe0'
			: state.isFocused
			? theme === 'dark'
				? '#252525'
				: '#f0f0f0'
			: theme === 'dark'
			? '#252525'
			: 'white',
		color: theme === 'dark' ? 'white' : 'black',
		'&:hover': {
			backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
		},
	}),
	menu: (provided: any) => ({
		...provided,
		borderRadius: '8px',
		overflow: 'hidden',
	}),
	menuList: (provided: any) => ({
		...provided,
		padding: 0,
	}),
	placeholder: (provided: any) => ({
		...provided,
		color: theme === 'dark' ? '#ccc' : '#888',
	}),
	singleValue: (provided: any) => ({
		...provided,
		color: theme === 'dark' ? '#eee' : '#333',
	}),
})

interface Brand {
	value: string
	label: string
}

interface Option {
	value: string
	label: string
}

const categoryOptions: Option[] = [
	{ value: '', label: 'All categories' },
	{ value: 'desktop', label: 'Desktop' },
	{ value: 'console', label: 'Console' },
	{ value: 'furniture', label: 'Furniture' },
	{ value: 'another', label: 'Another' },
]

const sortOptions: Option[] = [
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
	const [brands, setBrands] = useState<Brand[]>([])

	const fetchPageData = async () => {
		const data = { page, category, brand, sort, pricemin, pricemax }
		const resultFindPage = await dispatch(fetchFindPage(data))
		const resultGetBrands = await dispatch(fetchGetBrands())

		const allBrandsOption: Brand = { value: '', label: 'All brands' }
		const brandsWithAllOption = [
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
		const newSearchParams = new URLSearchParams(searchParams)
		newSearchParams.set('page', newPage.toString())
		router.push(`?${newSearchParams.toString()}`)
	}

	const handleSortChange = (selectedOption: SingleValue<Option>) => {
		setPage(1)
		const newSearchParams = new URLSearchParams(searchParams)
		if (selectedOption && selectedOption.value) {
			newSearchParams.set('s', selectedOption.value)
		} else {
			newSearchParams.delete('s')
		}
		router.push(`?${newSearchParams.toString()}`)
	}

	const handleBrandChange = (selectedOption: SingleValue<Brand>) => {
		setPage(1)
		const newSearchParams = new URLSearchParams(searchParams)
		if (selectedOption && selectedOption.value) {
			newSearchParams.set('b', selectedOption.value)
		} else {
			newSearchParams.delete('b')
		}
		router.push(`?${newSearchParams.toString()}`)
	}

	const handleCategoryChange = (selectedOption: SingleValue<Option>) => {
		setPage(1)
		const newSearchParams = new URLSearchParams(searchParams)
		if (selectedOption && selectedOption.value) {
			newSearchParams.set('c', selectedOption.value)
		} else {
			newSearchParams.delete('c')
		}
		router.push(`?${newSearchParams.toString()}`)
	}

	const ProductsList: React.FC = () => {
		const PageSwitch: React.FC = () => {
			const pageButtons = []
			for (let i = 1; i <= totalPages; i++) {
				pageButtons.push(
					<button
						key={i}
						onClick={() => handlePageChange(i)}
						className={`mx-1 px-3 py-1 rounded ${
							i === page ? 'fillButton' : ''
						}`}
					>
						{i}
					</button>
				)
			}
			return <div className='flex'>{pageButtons}</div>
		}

		return (
			<>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{products.length !== 0 ? (
						products.map((product: Product, index) => (
							<div key={index} className='flex justify-center'>
								<ProductComponent product={product} />
							</div>
						))
					) : (
						<div className='flex flex-wrap gap-[12px] justify-between'>
							{[...Array(24)].map((_, index) => (
								<div
									key={index}
									className='flex w-[240px] h-[300px] pb-8 flex-col rounded-lg border-[1px] border-[#252525] items-center animate-pulse'
								>
									<div className='w-full mt-4 h-[120px] bg-gray-300'></div>
									<div className='w-full mt-4 px-2 h-8 bg-gray-300'></div>
									<div className='flex w-full mt-10 gap-1 px-4 h-8 bg-gray-300'></div>
								</div>
							))}
						</div>
					)}
				</div>
				<div className='flex w-full justify-center h-48 mt-12'>
					<div className='flex flex-col items-center w-2/3'>
						<div className='flex mt-3'>
							<PageSwitch />
						</div>
					</div>
				</div>
			</>
		)
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
						<Select<Option>
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
						<Select<Brand>
							onChange={handleBrandChange}
							options={brands}
							styles={customStyles(theme)}
							defaultValue={brands.find(b => b.value === brand)}
							placeholder='Select a brand'
						/>
					</div>
					<div className='w-full'>
						<Select<Option>
							onChange={handleSortChange}
							options={sortOptions}
							styles={customStyles(theme)}
							defaultValue={sortOptions.find(s => s.value === sort)}
							placeholder='Sort by'
						/>
					</div>
				</div>
			</div>
			<div className='mt-10 w-full'>
				<ProductsList />
			</div>
		</div>
	)
}

export default CatalogPage
