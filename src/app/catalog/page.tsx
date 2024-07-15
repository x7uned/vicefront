"use client";

import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { Kanit } from "next/font/google";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchFindPage, fetchGetBrands } from '@/redux/products.slice';
import { useAppDispatch } from '@/redux/store';

const kanitMini = Kanit({ subsets: ["latin"], weight: ["300"] });
const kanit = Kanit({ subsets: ["latin"], weight: ["600"] });

interface PriceInterface {
  priceMax: number;
  priceMin: number;
}

const schema = yup.object().shape({
  priceMin: yup
    .number()
    .typeError("PriceMin must be a number")
    .required("This field is required")
    .min(0, "Value cannot be less than 0"),
  priceMax: yup
    .number()
    .typeError("PriceMax must be a number")
    .required("This field is required")
    .min(0, "Value cannot be less than 0")
    .test("is-greater", "Max price must be greater than min price", function (value) {
      const { priceMin } = this.parent;
      return value > priceMin;
    }),
});

interface Product {
  id: string,
  category: string,
  title: string,
  subtitle: string,
  image: string,
  brand: string,
  price: string,
  bestseller: string
}

interface FindPageData {
  page:string,
  brand:string,
  category:string,
  sort:string
}

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
  }, [page, category, brand, sort, pricemin, pricemax]);  // Добавлены зависимости pricemin и pricemax

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

  const [showPriceChooser, setShowPriceChooser] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PriceInterface>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: PriceInterface) => {
    setPage(1)
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('pm', String(data.priceMin));
    newSearchParams.set('px', String(data.priceMax));
    setProducts([])
    setShowPriceChooser(false);
    router.push(`?${newSearchParams.toString()}`);
  };

  const resetPriceParams = () => {
    setPage(1)
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('pm');
    newSearchParams.delete('px');
    setProducts([])
    fetchPageData()
    setShowPriceChooser(false);
    router.push(`?${newSearchParams.toString()}`);
  }

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
      <div 
        key={product.id} 
        className={`flex ${kanit.className} h-[300px] overflow-hidden pb-8 flex-col rounded-lg border-[1px] items-center w-[24%] ${(product.bestseller === 'true') ? 'bestseller' : 'border-[#252525]'}`}
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
          <button className={`fillButton rounded-[6px] px-4 w-[100px] h-full cursor-pointer`}>Buy</button>
          <p className={`w-[200px] text-end truncate text-xl rounded-[6px] px-4 h-full`}>{product.price}$</p>
        </div>
      </div>
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
        <div className="w-full">
          <div onClick={() => setShowPriceChooser(!showPriceChooser)} className="filter cursor-pointer w-full h-8 bg-slate-400 relative rounded-lg items-center flex">
            <p className="w-full flex justify-center">Price</p>
          </div>
          {showPriceChooser && (
            <div className="filterChooser relative rounded-lg py-2 mt-[0.4rem] w-full min-h-36">
              <form className="flex flex-col justify-around items-center h-full w-full" onSubmit={handleSubmit(onSubmit)}>
                <label>From</label>
                <input
                  type="number"
                  className="no-spinner focus:outline-none w-2/3 rounded-sm pl-1"
                  min="0"
                  placeholder="0"
                  defaultValue={pricemin}
                  {...register("priceMin")}
                />
                {errors.priceMin && <p className="text-red-500 text-center">{errors.priceMin.message}</p>}
                <label>To</label>
                <input
                  type="number"
                  className="no-spinner focus:outline-none w-2/3 rounded-sm pl-1"
                  min="0"
                  defaultValue={pricemax}
                  placeholder="∞"
                  {...register("priceMax")}
                />
                {errors.priceMax && <p className="text-red-500 text-center line-clamp-3">{errors.priceMax.message}</p>}
                <p className="cursor-pointer" onClick={() => {resetPriceParams()}}>Reset</p>
                <button className="p-1 w-2/3 rounded-lg" type="submit">Save</button>
              </form>
            </div>
          )}
        </div>
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
