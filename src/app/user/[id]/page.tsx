"use client"

import LoadingComponent from "@/app/components/loading.component";
import { useAppDispatch } from "@/redux/store";
import { fetchFindUser } from "@/redux/user.slice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserSlash } from "react-icons/fa";

interface Profile {
    username: string;
    email:string;
    avatar:string;
}

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
                    <div className="flex flex-col gap-2 items-center justify-center w-screen h-screen">
                        <p>{currentUser.username}</p>
                        <p>{currentUser.email}</p>
                        <div style={{ backgroundImage: `url(${currentUser.avatar ? currentUser.avatar : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/1024px-Missing_avatar.svg.png'})` }} className="w-[50px] h-[50px] rounded-full bg-center bg-no-repeat bg-contain"></div>
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