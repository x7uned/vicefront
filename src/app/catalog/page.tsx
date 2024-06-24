import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { Kanit } from "next/font/google";
import Link from "next/link";
import { Metadata } from "next";

const kanitMini = Kanit({ subsets: ["latin"], weight: ['300'] });

export const metadata: Metadata = {
    title: "Vice shop",
    description: "Vice shop by x7uned <3",
  };

const CatalogPage = () => {
    return (
        <div className={`flex pt-16 flex-col w-screen px-[400px] items-center ${kanitMini.className}`}>
            <div className={`path flex gap-3 items-center justify-center mt-6 w-full`}>
                <Link href="/">
                    <AiOutlineHome size="20px" />
                </Link>
                <p>/</p>
                <p>Catalog</p>
            </div>
            <div className="relative w-1/2 mt-6 flex">
                <AiOutlineSearch className="absolute mt-[2px] top-3 left-3 text-gray-500" size="20px" />
                <input
                    placeholder="Search our products, brands & services"
                    className="searchBar pl-10 rounded-[8px] w-full h-12 focus:outline-none"
                />
            </div>
        </div>
    )
}

export default CatalogPage;
