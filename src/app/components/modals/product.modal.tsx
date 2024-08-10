import React from 'react';
import { MdOutlineSell } from 'react-icons/md';

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

interface ModalProps {
  onClose: () => void;
  product: Product;
}

const ModalComponent: React.FC<ModalProps> = ({ onClose, product }) => {
  return (
    <div onClick={onClose} className="bganim z-20 bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
      <div onClick={(e) => e.stopPropagation()} className="dark:bg-custom-gradient bg-white gap-2 text-center border-[#ffffff22] border w-[500px] flex p-4 flex-col items-center justify-center rounded-xl shadow-lg">
        <div style={{ backgroundImage: `url(${product.image})` }} className="flex h-48 w-[200px] bg-contain bg-center bg-no-repeat"></div>
        <p className='flex items-center gap-2 text-xl'>{product.title}{(product.bestseller == "true") ? <MdOutlineSell className='text-[--gold]' size={"22px"} /> : ""}</p>
        <p className='w-2/3 text-[--searchbar-text]'>{product.subtitle}</p>
        <p className='w-full text-[--searchbar-text] text-lg'>{product.price}$</p>
        <div className="flex w-full">
            <div className="flex px-2 w-full justify-between">
                <p>Category:</p>
                <p>{product.category}</p>
            </div>
            <div className="vl h-7"></div>
            <div className="flex px-2 w-full justify-between">
                <p>Brand:</p>
                <p>{product.brand}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
