"use client"

import { useEffect, useRef, useState } from "react";
import { MdOutlineAdminPanelSettings, MdOutlineWbSunny, MdDataObject  } from "react-icons/md";
import { LuMoon } from "react-icons/lu";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

const AdminToolsComponent = () => {
    const adminToolsRef = useRef<HTMLDivElement>(null);
    const [adminTools, setAdminTools] = useState(false);
    const {theme, setTheme} = useTheme();
    const { data: session } = useSession();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (adminToolsRef.current && !adminToolsRef.current.contains(event.target as Node)) {
                setAdminTools(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [adminToolsRef, setAdminTools]);

    return (
        <>
            <button>
                <MdOutlineAdminPanelSettings onClick={() => {setAdminTools(!adminTools)}} size="25px" />
            </button>
            <div className="flex justify-end absolute">
                <div ref={adminToolsRef} className={`${adminTools ? 'profileMenu show' : 'profileMenu'} py-3 border rounded-lg absolute bg-slate-500 w-24 mt-12 mr-2 z-10`}>
                    <div className="flex flex-col justify-center items-center gap-2">
                        {theme == "light" ? <LuMoon className="cursor-pointer" onClick={() => setTheme("dark")} size="25px" /> : <MdOutlineWbSunny className="cursor-pointer" onClick={() => setTheme("light")} size="25px" />}
                        <MdDataObject onClick={() => console.log(session)} className="cursor-pointer" size="25px" /> 
                    </div>    
                </div>
            </div>  
        </>
    )
}

export default AdminToolsComponent;