"use client"

import LoadingComponent from "@/app/components/loading.component";
import { useAppDispatch } from "@/redux/store";
import { fetchFindUser } from "@/redux/user.slice";
import { Titillium_Web } from "next/font/google";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegStar, FaUserSlash } from "react-icons/fa";
import { RiVipCrownLine } from "react-icons/ri";

interface Profile {
    username: string;
    email:string;
    avatar:string;
    banner:string;
    status:string;
}

const titilium = Titillium_Web({ subsets: ["latin"], weight: ['600'] });

const ProfilePage = () => {
    const params = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [currentUser, setCurrentUser] = useState<Profile>();
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    const findUser = async () => {
        const fetchpar = {id: params.id}
        const data = await dispatch(fetchFindUser(fetchpar))
        if (data.payload.user && data.payload.success) {
            setCurrentUser(data.payload.user)
        } else {
            setNotFound(true)
        }
        setLoading(false)
        return data;
    }

    useEffect(() => {
        findUser();
    }, [])

    if (loading) return (
        <div className="flex justify-center items-center w-screen h-screen">
            <LoadingComponent />
        </div>
    )

    return (
        <div className="flex">
            {
                (currentUser && !notFound) ? (
                    <div className="flex flex-col mt-16 gap-2 px-96 items-center justify-start w-screen h-screen">
                        <div className="flex flex-col items-center w-full">
                            <div style={{ backgroundImage: `url(${currentUser.banner ? currentUser.banner : 'https://i.pinimg.com/564x/f6/41/90/f641905331279ff587d837a6e1d366c5.jpg'})` }} className="w-full bg-no-repeat bg-cover bg-center h-[120px]"></div>
                            <div className="flex justify-center items-center absolute rounded-full bg-[var(--background-color)] z-10 top-32 w-[120px] h-[120px]">
                                <div 
                                style={{ backgroundImage: `url(${currentUser.avatar 
                                        ? 
                                        currentUser.avatar 
                                        : 
                                        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/1024px-Missing_avatar.svg.png'})` }} 
                                        className="bg-center rounded-full w-[100px] h-[100px] bg-no-repeat bg-contain">
                                </div>
                            </div>
                        </div>
                        <div className={`flex px-8 justify-center w-full h-24 ${titilium.className}`}>
                            <div className="flex text-center items-center gap-1 text-3xl mt-16">{currentUser.username}{currentUser.status == "admin" ? <RiVipCrownLine className="text-[var(--gold)]" size={"28px"} /> : ''}</div>
                        </div>
                        <p>{currentUser.email}</p>
                        <p>{currentUser.status}</p>
                    </div>
                ) : (
                    <div className="flex flex-col w-screen h-screen justify-center items-center">
                        <FaUserSlash size="100px" />
                        <p className="text-3xl font-bold mt-3">User not found</p>
                    </div>
                )
            }
        </div>
    )
}

export default ProfilePage;