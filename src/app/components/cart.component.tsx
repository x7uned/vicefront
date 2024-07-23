'use client';

import { useEffect, useRef } from 'react';
import { useCart } from './contexts/cart.context';

import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from 'next/navigation';

interface CartProps {
    cartMenu: boolean;
    setCartMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart = ({ cartMenu, setCartMenu }: CartProps) => {
    const cartMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter()
    const { cart, removeFromCart, incrementQuantity, decrementQuantity, totalAmount } = useCart();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cartMenuRef.current && !cartMenuRef.current.contains(event.target as Node)) {
                setCartMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [cartMenuRef, setCartMenu]);

    useEffect(() => {
        if (cartMenu) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [cartMenu]);

    return (
        <div 
            ref={cartMenuRef} 
            className={`cartMenu ${cartMenu ? 'show' : ''} z-10`} 
            role="dialog" 
            aria-labelledby="cart-heading" 
            aria-hidden={!cartMenu}
        >
            <p id="cart-heading" className="text-3xl">Cart</p>
            <div className="w-full mt-2 border-t border-gray-300 dark:border-[#3d3d3d]"></div>
            {(cart.length === 0) ? (
                <div className="flex w-full h-5/6 flex-col overflow-y-auto hideScroll">
                    <div className="flex flex-col w-full h-screen justify-center items-center">
                        <MdOutlineRemoveShoppingCart size={"100px"} />
                        <p className='mt-3 text-[30px]'>Cart is empty</p>
                    </div>
                </div>
            ) : (
                <>
                <div className="flex w-full h-full flex-col mt-2 gap-3 overflow-y-auto">
                    {cart.map((item) => (
                        <div className="flex items-center text-center gap-1" key={item.id}>
                            <div 
                                className="w-1/6 h-[60px] bg-center bg-contain bg-no-repeat" 
                                style={{ backgroundImage: `url(${item.image})` }}
                                aria-label={item.name}
                            ></div>
                            <p className='w-2/6'>{item.name}</p>
                            <div className="w-1/6 flex justify-center">
                                <div className="flex justify-around text-xl w-[50px] h-1/2">
                                    <p className='cursor-pointer unselectable' onClick={() => decrementQuantity(item.id)}>-</p>
                                    <p>{item.quantity}</p>
                                    <p className='cursor-pointer unselectable' onClick={() => incrementQuantity(item.id)}>+</p>
                                </div>
                            </div>
                            <p className='w-1/6 text-lg'>{item.price}$</p>
                            <button className='w-1/6 flex justify-center' onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}><RxCross2 size="20px"/></button>
                        </div>
                    ))}
                </div>
                <div className="flex text-xl justify-center items-center h-1/3">
                    <div className="flex gap-5 items-center">
                        <div className="flex gap-1 justify-between">
                            <p>Total:</p>
                            <p>{totalAmount}$</p>
                        </div>
                        <button onClick={() => router.push('/neworder')} className='fillButton rounded-2xl px-5 py-2'>Place an order</button>
                    </div>
                </div>
                </>
            )}
        </div>
    );
};

export default Cart;
