'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CgLogOut } from 'react-icons/cg'
import { FaMoneyBillTransfer } from 'react-icons/fa6'
import { LuUser } from 'react-icons/lu'
import { MdOutlineSettings } from 'react-icons/md'

interface ProfileMenuComponentProps {
	email: string
	userId: string
}

const ProfileMenuComponent: React.FC<ProfileMenuComponentProps> = ({
	email,
	userId,
}) => {
	const [profileMenu, setProfileMenu] = useState(false)
	const profileMenuRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileMenuRef.current &&
				!profileMenuRef.current.contains(event.target as Node)
			) {
				setProfileMenu(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [profileMenuRef])

	return (
		<div className='flex justify-center'>
			<div
				onClick={() => {
					setProfileMenu(!profileMenu)
				}}
				className='cursor-pointer'
			>
				<LuUser size='25px' />
			</div>
			<div
				ref={profileMenuRef}
				className={`${
					profileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
				} flex-col transition-opacity duration-200 ease-in-out border overflow-hidden text-center items-center rounded-lg absolute bg-backgroundColor dark:border-[#474747] w-52 mt-12 z-10`}
			>
				<p className='text-sm mt-2'>{email}</p>
				<div className='w-full mt-2 border-t dark:border-[#474747]'></div>
				<Link
					href={`/user/${userId}`}
					className='flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#252525]'
				>
					<LuUser size='20px' />
					<p className='text-sm'>Show profile</p>
				</Link>
				<div className='flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#252525] cursor-pointer'>
					<FaMoneyBillTransfer size='20px' />
					<p className='text-sm'>Billing</p>
				</div>
				<div className='flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#252525] cursor-pointer'>
					<MdOutlineSettings size='20px' />
					<p className='text-sm'>Settings</p>
				</div>
				<div className='w-full border-t dark:border-[#474747]'></div>
				<div
					onClick={() => {
						signOut()
						router.push('/')
					}}
					className='flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#252525] cursor-pointer'
				>
					<CgLogOut size='20px' />
					<p className='text-sm'>Log out</p>
				</div>
			</div>
		</div>
	)
}

export default ProfileMenuComponent
