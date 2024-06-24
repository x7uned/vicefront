'use client'

import { Titillium_Web } from "next/font/google";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { MdLightMode, MdOutlineDarkMode, MdOutlineShoppingCart   } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";

const titilium = Titillium_Web({ subsets: ["latin"], weight: ['600'] });

const HeaderComponent = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { data: session } = useSession();

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="header absolute px-80 flex border-b-[1px] items-center justify-around w-full h-16">
            <Link href="/"><p className={`text-[20px] cursor-pointer ${titilium.className}`}>Vice</p></Link>
            <div className="flex w-28 justify-around">
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? <MdOutlineDarkMode size="25px" /> : <MdLightMode size="25px" />}
                </button>
                <button>
                    <MdOutlineShoppingCart size="25px" />
                </button>
                {session && session.user ? <FaRegUserCircle onClick={() => {signOut()}} size="25px" className='cursor-pointer' /> : <Link href="/signin"><HiOutlineLogin size="25px" className='cursor-pointer' /></Link>}
            </div>
        </div>
    )
}

export default HeaderComponent;