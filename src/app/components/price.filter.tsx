"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";

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

const PriceFilter = () => {
  const searchParams = useSearchParams();
  const priceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pricemin = searchParams.get("pm") || '';
  const pricemax = searchParams.get("px") || '';
  const [showPriceChooser, setShowPriceChooser] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PriceInterface>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPriceChooser && priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setShowPriceChooser(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPriceChooser]);

  const handlePriceClick = () => {
    setShowPriceChooser((prev) => !prev);
  };

  const onSubmit = (data: PriceInterface) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('pm', String(data.priceMin));
    newSearchParams.set('px', String(data.priceMax));
    setShowPriceChooser(false);
    router.push(`?${newSearchParams.toString()}`);
  };

  const resetPriceParams = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('pm');
    newSearchParams.delete('px');
    setShowPriceChooser(false);
    router.push(`?${newSearchParams.toString()}`);
  }

  return (
    <div className="w-full">
      <div onClick={handlePriceClick} className="filter cursor-pointer w-full h-8 bg-slate-400 relative rounded-lg items-center flex">
        <p className="w-full unselectable flex justify-center">Price</p> 
      </div>
      <div ref={priceRef} className={`${showPriceChooser ? 'filterChooser show' : 'filterChooser'} relative rounded-lg py-2 mt-[0.4rem] w-full min-h-36`}>
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
          <p className="cursor-pointer" onClick={resetPriceParams}>Reset</p>
          <button className="p-1 w-2/3 rounded-lg" type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default PriceFilter;
