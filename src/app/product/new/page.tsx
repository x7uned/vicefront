"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Outfit } from "next/font/google";
import { useAppDispatch } from '@/redux/store';
import { fetchUploadImage } from '@/redux/upload.slice';
import { MdOutlineAddShoppingCart, MdOutlineZoomOutMap } from 'react-icons/md';
import { fetchCreateProduct } from '@/redux/products.slice';
import { useRouter } from 'next/navigation';

const outfit = Outfit({ subsets: ["latin"], weight: ["600"] });

const schema = yup.object().shape({
    category: yup.string().required('Category is required').oneOf(['console', 'desktop', 'furniture', 'another'], 'Category not found'),
    title: yup.string().min(3, 'Min 3 symbols').max(50, 'Max 50 symbols').required('Title is required'),
    subtitle: yup.string().max(100, 'Max 100 symbols'),
    image: yup.mixed().required('Image is required').test('fileType', 'Unsupported File Format', value => value && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0]?.type)).test('fileSize', 'File Size is too large', value => value && value[0]?.size <= 2000000), // 2MB
    brand: yup.string().required('Brand is required'),
    price: yup.number().required('Price is required').typeError('Price must be a number'),
});

interface Product {
    category: string;
    title: string;
    subtitle: string;
    image: string;
    brand: string;
    price: string;
}

const NewProductComponent = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [fileErrorMessage, setFileErrorMessage] = useState("")
    const [globalErrorMessage, setGlobalErrorMessage] = useState("")
    const [product, setProduct] = useState<Product>({
        category: 'desktop',
        title: 'Test',
        subtitle: 'Test',
        image: 'https://www.dxracer.ua/images/products/gaming-chairs/dxracer-formula-oh-fe57-ne-black-green/250.png',
        brand: '',
        price: '',
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const response = await dispatch(fetchUploadImage(file));
                if (fetchUploadImage.fulfilled.match(response)) {
                    const imageUrl = response.payload as string;
                    setProduct((prevProduct) => ({
                        ...prevProduct,
                        image: imageUrl,
                    }));
                    setFileErrorMessage("");
                } else {
                    setFileErrorMessage("Image upload failed");
                }
            } catch (error) {
                setFileErrorMessage("Error uploading image");
            }
        }
    };
      

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const onSubmit = async (FormData: any) => {
        try {
            let fetchData = {...FormData, image: product.image} 
            const fetch = await dispatch(fetchCreateProduct(fetchData))
            if(fetch.payload.success) {
                router.push("/catalog")
            } else {
                setGlobalErrorMessage("Something went wrong")
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    };

    return (
        <div className={`w-full h-screen flex justify-center items-center gap-3 ${outfit.className}`}>
            <div className="flex w-[36rem]">
                <form className="formR" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full">
                        <label htmlFor="category">Category:</label>
                        <select 
                            {...register('category')} 
                            name="category"
                            onChange={handleInputChange}
                            className="filter cursor-pointer focus:outline-none text-center no-spinner h-[42px] px-4 rounded-lg items-center flex w-full"
                        >
                            <option value="desktop">Desktop</option>
                            <option value="console">Console</option>
                            <option value="furniture">Furniture</option>
                            <option value="another">Another</option>
                        </select>
                        {errors.category && <span>{errors.category.message}</span>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="title">Title:</label>
                        <input 
                            id="title" 
                            {...register('title')}
                            name="title" 
                            onChange={handleInputChange}
                        />
                        {errors.title && <span>{errors.title.message}</span>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="subtitle">Subtitle:</label>
                        <input 
                            id="subtitle" 
                            {...register('subtitle')}
                            name="subtitle" 
                            onChange={handleInputChange}
                        />
                        {errors.subtitle && <span>{errors.subtitle.message}</span>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="image">Image:</label>
                        <input 
                            type="file" 
                            {...register('image')}
                            onChange={(e) => {
                                handleImageChange(e);
                                handleInputChange(e);
                            }} 
                        />
                        {errors.image && <span>{errors.image.message}</span>}
                        {fileErrorMessage && <span>{fileErrorMessage}</span>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="brand">Brand:</label>
                        <input 
                            id="brand" 
                            {...register('brand')}
                            name="brand" 
                            onChange={handleInputChange}
                        />
                        {errors.brand && <span>{errors.brand.message}</span>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="price">Price:</label>
                        <input 
                            id="price" 
                            type="number" 
                            {...register('price')}
                            name="price" 
                            onChange={handleInputChange}
                        />
                        {errors.price && <span>{errors.price.message}</span>}
                    </div>
                    <button type="submit" className="submitButton">Submit</button>
                    {globalErrorMessage && <span className='text-red-500'>{globalErrorMessage}</span>}
                </form>
            </div>
            <div className={`nft flex h-[300px] w-[240px] overflow-hidden pb-8 flex-col rounded-lg border-[1px] items-center`}>
                <div className={`flex text-white justify-center text-sm items-center w-full h-[20px]`}>
                </div>
                <div 
                className="w-full mt-4 h-[120px] bg-center bg-contain bg-no-repeat" 
                style={{ backgroundImage: `url(${product.image})` }}
                ></div>
                <div className="flex w-full mt-4 px-2 justify-center text-center h-8">
                    <p className='flex text-ellipsis overflow-hidden items-center text-[16px] h-12 font-semibold'>{product.title}</p>
                </div>
                <div className="flex w-full mt-10 gap-1 px-6 h-8 justify-between">
                <button className={`fillButton flex justify-center items-center rounded-[6px] w-[60px] h-full cursor-pointer`}><MdOutlineAddShoppingCart size="20px" /></button>
                <button className={`transparentButton flex justify-center items-center rounded-[6px] w-[60px] h-full cursor-pointer`}><MdOutlineZoomOutMap size="20px" /></button>
                    <p className={`w-[200px] text-end truncate text-xl rounded-[6px] px-4 h-full`}>{product.price}$</p>
                </div>
            </div>
        </div>
    )
}

export default NewProductComponent;
