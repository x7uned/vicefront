import React from 'react'
import ProductComponent, { Product } from './product.component'

interface ProductsListProps {
	products: Product[]
	totalPages: number
	page: number
	handlePageChange: (newPage: number) => void
}

const ProductsList: React.FC<ProductsListProps> = ({
	products,
	totalPages,
	page,
	handlePageChange,
}) => {
	return (
		<div>
			{products.map(product => (
				<ProductComponent key={product.id} product={product} />
			))}
			<div className='pagination'>
				{[...Array(totalPages)].map((_, index) => (
					<button
						key={index}
						onClick={() => handlePageChange(index + 1)}
						className={index + 1 === page ? 'active' : ''}
					>
						{index + 1}
					</button>
				))}
			</div>
		</div>
	)
}

export default ProductsList
