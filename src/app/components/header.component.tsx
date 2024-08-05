'use client'

import { Titillium_Web } from "next/font/google";
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import { MdOutlineNotificationsNone , MdOutlineShoppingCart, MdOutlineSettings, MdOutlineAdminPanelSettings  } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineLogin } from "react-icons/hi";
import { LuUser } from "react-icons/lu";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { CgLogOut } from "react-icons/cg";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cart from "./cart.component";
import AdminToolsComponent from "./admintools.component";

const titilium = Titillium_Web({ subsets: ["latin"], weight: ['600'] });

const HeaderComponent = () => {
    const [mounted, setMounted] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const [cartMenu, setCartMenu] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileMenuRef]);

    if (!mounted) return null;

    return (
        <>
            <div className="header absolute px-80 flex border-b-[1px] items-center justify-around w-full h-16">
                <Link href="/"><p className={`text-[20px] cursor-pointer ${titilium.className}`}>Vice</p></Link>
                <div className={`flex justify-around ${session?.admin ? 'w-36': 'w-24'}`}>
                    {session?.admin && <AdminToolsComponent />}
                    <button onClick={() => {setCartMenu(!cartMenu)}}>
                        <MdOutlineShoppingCart size="25px" />
                    </button>
                    <button>
                        <MdOutlineNotificationsNone size="25px" />
                    </button>
                    {session && session.user ? 
                    <div className="flex justify-center">
                        <FaRegUserCircle onClick={() => {setProfileMenu(!profileMenu)}} size="25px" className='cursor-pointer' />
                        <div ref={profileMenuRef} className={`${profileMenu ? 'profileMenu show' : 'profileMenu'} flex-col border text-center items-center rounded-lg absolute bg-slate-500 w-52 mt-12 z-10`}>
                            <p className="text-sm mt-2">{session.user.email}</p>
                            <div className="w-full mt-2 border-t"></div>
                            <Link href={`/user/${session.user.id}`} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#252525]">
                                <LuUser size="20px" />
                                <p className="text-sm">Show profile</p>
                            </Link>
                            <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#252525] cursor-pointer">
                                <FaMoneyBillTransfer size="20px" />
                                <p className="text-sm">Billing</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#252525] cursor-pointer">
                                <MdOutlineSettings size="20px" />
                                <p className="text-sm">Settings</p>
                            </div>
                            <div className="w-full border-t"></div>
                            <div onClick={() => { signOut(); router.push('/') }} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#252525] cursor-pointer">
                                <CgLogOut size="20px" />
                                <p className="text-sm">Log out</p>
                            </div>
                        </div>
                    </div>  
                    : 
                    <Link href="/signin">
                        <HiOutlineLogin size="25px" className='cursor-pointer' />
                    </Link>}
                </div>
            </div>
            <Cart cartMenu={cartMenu} setCartMenu={setCartMenu} />
        </>
    )
}

export default HeaderComponent;
