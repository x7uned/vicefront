import { Kanit } from "next/font/google";
import Link from "next/link";
import { TbCategory } from "react-icons/tb";

const kanit = Kanit({ subsets: ["latin"], weight: ['500'] });
const kanitMini = Kanit({ subsets: ["latin"], weight: ['300'] });

interface Product {
    title: string,
    text: string,
    quantity: number
}

const products: Product[] = [
    {
        title: 'Desktop',
        text: 'Feel the game 100 percent',
        quantity: 13,
    },
    {
        title: 'Console',
        text: 'Show your best',
        quantity: 9
    },
    {
      title: 'Furniture',
      text: 'Play in comfort',
      quantity: 2
  },
    {
        title: 'Another',
        text: 'Complete your game',
        quantity: 4
    }
]

const ProductsCategory = () => {
  return (
    <div className="flex gap-3 mt-16">
      {products.map((product, index) => (
        <Link key={index} href={`/catalog?c=${product.title.toLowerCase()}`}>
          <div  className={`product cursor-pointer flex items-center flex-col p-6 border-[1px] rounded-xl w-64 h-36 ${kanitMini.className}`}>
            <p className={`${kanit.className} text-xl w-full flex justify-center text-center`}>{product.title}</p>
            <p className={`w-full mt-2 flex justify-center text-center text-gray-400`}>{product.text}</p>
            <div className="flex w-1/2 justify-around items-center mt-3">
              <TbCategory size={"20px"}/>
              <p>{product.quantity} products</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductsCategory;
