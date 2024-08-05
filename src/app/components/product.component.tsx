import { Outfit } from "next/font/google";
import { useCart } from "./contexts/cart.context";
import { MdOutlineAddShoppingCart, MdOutlineZoomOutMap } from "react-icons/md";

export interface Product {
    id: string,
    category: string,
    title: string,
    subtitle: string,
    image: string,
    brand: string,
    price: string,
    bestseller: string
}

const outfit = Outfit({ subsets: ["latin"], weight: ["600"] });

const ProductComponent = ({product} : {product: Product}) => {
    const {addToCart} = useCart();

    const handleAddToCart = () => {
        addToCart({ id: product.id, name: product.title, price: product.price, quantity: 1, image: product.image });
    };

    return (
    <div 
        key={product.id} 
        className={`nft flex ${outfit.className} h-[300px] w-[240px] overflow-hidden pb-8 flex-col rounded-lg border-[1px] items-center ${(product.bestseller === 'true') ? 'bestseller' : 'border-[#252525]'}`}
      >
        <div className={`flex text-white justify-center text-sm items-center w-full h-[20px] ${(product.bestseller === 'true') ? 'bestsellerbg' : ''}`}>
          {(product.bestseller === 'true') ? (<p className="tracking-[0.7em]">BESTSELLER</p>) : ''}
        </div>
        <div 
          className="w-full mt-4 h-[120px] bg-center bg-contain bg-no-repeat" 
          style={{ backgroundImage: `url(${product.image})` }}
        ></div>
        <div className="flex w-full mt-4 px-2 justify-center text-center h-8">
          <p className='flex text-ellipsis overflow-hidden items-center text-[16px] h-12 font-semibold'>{product.title}</p>
        </div>
        <div className="flex w-full mt-10 gap-1 px-6 h-8 justify-between">
          <button onClick={() => {handleAddToCart()}} className={`fillButton flex justify-center items-center rounded-[6px] w-[60px] h-full cursor-pointer`}><MdOutlineAddShoppingCart size="20px" /></button>
          <button className={`transparentButton flex justify-center items-center rounded-[6px] w-[60px] h-full cursor-pointer`}><MdOutlineZoomOutMap size="20px" /></button>
          <p className={`w-[200px] text-end truncate text-xl rounded-[6px] px-4 h-full`}>{product.price}$</p>
        </div>
    </div>
    )
}

export default ProductComponent;