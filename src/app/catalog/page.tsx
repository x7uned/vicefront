"use client";

import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { Kanit } from "next/font/google";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { fetchFindPage, fetchGetBrands } from '@/redux/products.slice';
import { useAppDispatch } from '@/redux/store';
import ProductComponent, { Product } from "../components/product.component";
import PriceFilter from "../components/price.filter";

const kanitMini = Kanit({ subsets: ["latin"], weight: ["300"] });

interface Brand {
  brand:string,
  brandtitle:string
}

const CatalogPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const category = searchParams.get("c");
  const brand = searchParams.get("b");
  const sort = searchParams.get("s");
  const pricemin = searchParams.get("pm") || '';
  const pricemax = searchParams.get("px") || '';
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([])

  const fetchPageData = async () => {
    const data = { page, category, brand, sort, pricemin, pricemax };
    const resultFindPage = await dispatch(fetchFindPage(data));
    const resultGetBrands = await dispatch(fetchGetBrands());

    setTotalPages(resultFindPage.payload?.totalPages || 1);
    setProducts(resultFindPage.payload?.products || []);
    setBrands(resultGetBrands.payload?.brands || [])
  };

  useEffect(() => {
    fetchPageData();
  }, [page, category, brand, sort, pricemin, pricemax]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    setPage(1);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('s', newSort.toString());
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleBrandChange = (newBrand: string) => {
    setPage(1);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('b', newBrand);
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    setPage(1);
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('c', newCategory);
    router.push(`?${newSearchParams.toString()}`);
  };

  const ProductsList = () => {
    const PageSwitch = () => {
      const pageButtons = [];
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`mx-1 px-3 py-1 rounded ${i === page ? 'fillButton' : 'hover:bg-[#252525]'}`}
          >
            {i}
          </button>
        );
      }
      return <div className="flex">{pageButtons}</div>;
    };

    return (
      <>
        <div className="flex flex-wrap gap-[12px] justify-between">
  {products.length !== 0 ? (
    products.map((product: Product) => (
      <ProductComponent product={product} />
    ))
  ) : (
    <div className="flex flex-wrap gap-[12px] justify-between">
      {[...Array(24)].map((_, index) => (
        <div 
          key={index} 
          className="flex w-[240px] h-[300px] pb-8 flex-col rounded-lg border-[1px] border-[#252525] items-center w-[24%] animate-pulse"
        >
          <div className="w-full mt-4 h-[120px] bg-gray-300"></div>
          <div className="w-full mt-4 px-2 h-8 bg-gray-300"></div>
          <div className="flex w-full mt-10 gap-1 px-4 h-8 bg-gray-300"></div>
        </div>
      ))}
    </div>
  )}
</div>
        <div className="flex w-full justify-center h-48 mt-12">
          <div className="flex flex-col items-center w-2/3">
            <div className="flex mt-3">
              <PageSwitch />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={`flex pt-16 flex-col w-full px-[25%] items-center ${kanitMini.className}`}>
      <div className="path flex gap-3 items-center justify-center mt-6 w-full">
        <Link href="/">
          <AiOutlineHome size="20px" />
        </Link>
        <p className="unselectable">/</p>
        <p className="unselectable">Catalog</p>
      </div>
      <div className="relative w-1/2 mt-6 flex">
        <AiOutlineSearch className="absolute mt-[2px] top-3 left-3 text-gray-500" size="20px" />
        <input
          placeholder="Search our products, brands & services"
          className="searchBar pl-10 rounded-[8px] w-full h-12 focus:outline-none"
        />
      </div>
      <div className="flex gap-2 mt-10 w-full h-10 justify-between">
        <div className="w-full">
          <select onChange={(event) => handleCategoryChange(event.target.value)} defaultValue={category || "all"} className="filter cursor-pointer focus:outline-none text-center no-spinner h-8 px-4 rounded-lg items-center flex w-full">
            <option value="all">All categories</option>
            <option value="desktop">Desktop</option>
            <option value="console">Console</option>
            <option value="furniture">Furniture</option>
            <option value="another">Another</option>
          </select>
        </div>
        <PriceFilter />
        <div className="w-full">
          <select onChange={(event) => handleBrandChange(event.target.value)} defaultValue={brand || "all"} className="filter focus:outline-none text-center no-spinner cursor-pointer h-8 rounded-lg items-center w-full">
            <option value="all">All brands</option>
            {brands.map((brand, index) => (
              <option key={index} value={brand.brand}>{brand.brandtitle}</option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <select onChange={(event) => handleSortChange(event.target.value)} defaultValue={sort || "sort"} className="filter focus:outline-none text-center no-spinner cursor-pointer h-8 rounded-lg items-center w-full">
            <option value="sort">Sort</option>
            <option value="bestsellers">Best sellers</option>
            <option value="cheap">Cheap first</option>
            <option value="expensive">Expensive first</option>
          </select>
        </div>
      </div>
      <div className="mt-10 w-[1000px]">
        <ProductsList />
      </div>
    </div>
  );
};

export default CatalogPage;
