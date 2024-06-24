"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

function AppBar() {
    const { data: session } = useSession();

    return (
        <div className="w-full h-12 bg-gray-800 flex items-center justify-between px-4">
            {session && session.user ? (
                <div className="flex items-center">
                    <p onClick={()=> {console.log(session.user)}} className="text-white mr-4">{session.user.name}</p>
                    <button
                        onClick={async () => {
                            await signOut();
                        }}
                        className="bg-red-500 text-white py-1 px-3 rounded"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await signIn('google');
                    }}
                    className="bg-green-500 text-white py-1 px-3 rounded"
                >
                    Sign In
                </button>
            )}
        </div>
    );
}

export default AppBar;
