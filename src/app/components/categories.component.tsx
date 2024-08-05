"use client"

import { fetchGetCategories } from "@/redux/products.slice";
import { useAppDispatch } from "@/redux/store";
import { Kanit } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbCategory } from "react-icons/tb";

const kanit = Kanit({ subsets: ["latin"], weight: ['500'] });
const kanitMini = Kanit({ subsets: ["latin"], weight: ['300'] });

interface Category {
    title: string,
    subtitle: string,
    quantity: number
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const dispatch = useAppDispatch();

  const fetchCategories = async () => {
    const fetch = await dispatch(fetchGetCategories());
    setCategories(fetch.payload.categories)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="flex gap-3 mt-16">
      {(categories.length === 0 ? (
        [...Array(4)].map((_, index) => (
          <div key={index} className="product cursor-pointer flex items-center flex-col p-6 border-[1px] rounded-xl w-64 h-36 animate-pulse">
            <p className="bg-gray-300 h-6 w-full rounded mb-2"></p>
            <p className="bg-gray-300 h-4 w-full rounded mt-2"></p>
            <div className="flex w-1/2 justify-around items-center mt-3">
              <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
              <p className="bg-gray-300 h-4 w-24 rounded"></p>
            </div>
          </div>
        ))
      ) : (
        categories.map((category, index) => (
          <Link key={index} href={`/catalog?c=${category.title.toLowerCase()}`}>
            <div  className={`product cursor-pointer flex items-center flex-col p-6 border-[1px] rounded-xl w-64 h-36 ${kanitMini.className}`}>
              <p className={`${kanit.className} text-xl w-full flex justify-center text-center`}>{category.title}</p>
              <p className={`w-full mt-2 flex justify-center text-center text-gray-400`}>{category.subtitle}</p>
              <div className="flex gap-1 w-full justify-center items-center mt-3">
                <TbCategory size={"20px"}/>
                <p className="w-24">{category.quantity} products</p>
              </div>
            </div>
          </Link>
        )
      )))}
    </div>
  );
}

export default Categories;
