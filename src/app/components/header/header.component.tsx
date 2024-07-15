'use client'

import { Titillium_Web } from "next/font/google";
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import { MdLightMode, MdOutlineDarkMode, MdOutlineShoppingCart, MdOutlineSettings } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import { LuUser } from "react-icons/lu";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { CgLogOut } from "react-icons/cg";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const titilium = Titillium_Web({ subsets: ["latin"], weight: ['600'] });

const HeaderComponent = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [cartMenu, setCartMenu] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setProfileMenu(false);
                setCartMenu(false)
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    if (!mounted) return null;

    return (
        <>
            <div className="header absolute px-80 flex border-b-[1px] items-center justify-around w-full h-16">
                <Link href="/"><p className={`text-[20px] cursor-pointer ${titilium.className}`}>Vice</p></Link>
                <div className="flex w-28 justify-around">
                    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? <MdOutlineDarkMode size="25px" /> : <MdLightMode size="25px" />}
                    </button>
                    <button onClick={() => {setCartMenu(!cartMenu)}}>
                        <MdOutlineShoppingCart size="25px" />
                    </button>
                    {session && session.user ? 
                    <div className="flex justify-center">
                        <FaRegUserCircle onClick={() => {setProfileMenu(!profileMenu)}} size="25px" className='cursor-pointer' />
                        <div ref={menuRef} style={{display: `${profileMenu ? 'flex' : 'none'}`}} className="py-3 flex-col border-[1px] animZoom text-center items-center rounded-lg z-10 mt-[50px] absolute bg-slate-500 w-[200px]">
                            <p className="text-sm">{session?.user?.email}</p>
                            <div className="w-full mt-2 border-t border-[#27272a]"></div>
                            <div className="flex cursor-pointer pl-8 w-full mt-2 flex-col">
                                <Link href={`/user/${session.user.id}`}>
                                    <div className="flex gap-1 items-center">
                                        <LuUser size="20px" />
                                        <p className="ml-1 text-[14px]">Show profile</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="flex cursor-pointer pl-8 w-full mt-2 flex-col">
                                <div className="flex gap-1 items-center">
                                    <FaMoneyBillTransfer size="20px" />
                                    <p className="ml-1 text-[14px]">Billing</p>
                                </div>
                            </div>
                            <div className="flex cursor-pointer pl-8 w-full mt-2 flex-col">
                                <div className="flex gap-1 items-center">
                                    <MdOutlineSettings size="20px" />
                                    <p className="ml-1 text-[14px]">Settings</p>
                                </div>
                            </div>
                            <div className="w-full mt-2 border-t border-[#27272a]"></div>
                            <div onClick={() => {signOut(); router.push('/')}} className="flex cursor-pointer pl-8 w-full mt-2 flex-col">
                                <div className="flex gap-1 items-center">
                                    <CgLogOut size="20px" />
                                    <p className="ml-1 text-[14px]">Log out</p>
                                </div>
                            </div>
                        </div>
                    </div>  
                    : 
                    <Link href="/signin">
                        <HiOutlineLogin size="25px" className='cursor-pointer' />
                    </Link>}
                </div>
            </div>
            <div ref={menuRef} className={cartMenu ? 'cartMenu show' : 'cartMenu'}>
                <p className="text-2xl">Cart</p>
                <div className="w-full mt-2 border-t border-[#211e2b]"></div>
            </div>
        </>
    )
}

export default HeaderComponent;
