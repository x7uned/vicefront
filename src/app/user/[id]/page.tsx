"use client"

import { useAppDispatch } from "@/redux/store";
import { fetchFindUser } from "@/redux/user.slice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Profile {
    username: string;
    email:string;
    avatar:string;
}

const ProfilePage = () => {
    const params = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [currentUser, setCurrentUser] = useState<Profile>()

    const findUser = async () => {
        const fetchpar = {id: params.id}
        const data = await dispatch(fetchFindUser(fetchpar))
        setCurrentUser(data.payload.user)
        return data;
    }

    useEffect(() => {
        findUser();
    }, [])

    return (
        <div className="flex">
            {
                currentUser && (
                    <div className="flex flex-col gap-2 items-center justify-center w-screen h-screen">
                        <p>{currentUser.username}</p>
                        <p>{currentUser.email}</p>
                        <div style={{ backgroundImage: `url(${currentUser.avatar ? currentUser.avatar : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/1024px-Missing_avatar.svg.png'})` }} className="w-[50px] h-[50px] rounded-full bg-center bg-no-repeat bg-contain"></div>
                    </div>
                )
            }
        </div>
    )
}

export default ProfilePage;