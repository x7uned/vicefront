import { Kanit } from "next/font/google";
import Link from "next/link";
import ProductsCategory from "../components/catalog/products.category";

const kanit = Kanit({ subsets: ["latin"], weight: ['500'] });
const kanitMini = Kanit({ subsets: ["latin"], weight: ['300'] });

export default function Home() {
  
  return (
    <div>
      <div className="flex flex-col gap-20 w-full h-screen items-center">
        <div className="title flex mt-40 flex-col items-center">
          <p className={`text-[80px] ${kanit.className}`}>Improve your gaming</p>
          <p className={`text-2xl text-[#95959e] ${kanitMini.className}`}>Vice is an online store for all kinds of gaming devices</p>
          <p className={`text-2xl text-[#95959e] ${kanitMini.className}`}>{`Powered by x7uned <3`}</p>
          <div className={`flex mt-12 w-[95vw] justify-center gap-5 ${kanitMini.className}`}>
            <button className="fillButton rounded-[6px] h-[36px] w-36">
              <p>Add product</p>
            </button>
            <Link href="/catalog">
              <button className="transparentButton h-[36px] w-36">
                <p>Catalog</p>
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col w-full items-center">
          <div className="relative flex justify-center w-1/6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#272727]"></div>
            </div>
            <span className="header relative px-2">CATEGORIES</span>
          </div>
          <ProductsCategory />
        </div>
      </div>
    </div>
  );
}
