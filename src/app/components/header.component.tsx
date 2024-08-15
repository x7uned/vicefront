'use client'

import { useSession } from 'next-auth/react'
import { Titillium_Web } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HiOutlineLogin } from 'react-icons/hi'
import {
	MdOutlineNotificationsNone,
	MdOutlineShoppingCart,
} from 'react-icons/md'
import AdminToolsComponent from './admintools.component'
import Cart from './cart.component'
import ProfileMenuComponent from './profileMenu.component'

const titilium = Titillium_Web({ subsets: ['latin'], weight: ['600'] })

const HeaderComponent = () => {
	const [mounted, setMounted] = useState(false)
	const { data: session } = useSession()
	const router = useRouter()
	const [cartMenu, setCartMenu] = useState(false)

	useEffect(() => setMounted(true), [])

	if (!mounted) return null

	return (
		<div className='flex justify-center w-screen'>
			<div className='header bg-backgroundColor w-full sm:w-[90%] absolute flex items-center justify-center gap-[20%] h-16'>
				<Link href='/'>
					<p className={`text-[20px] cursor-pointer ${titilium.className}`}>
						Vice
					</p>
				</Link>
				<div
					className={`flex justify-around ${session?.admin ? 'w-36' : 'w-24'}`}
				>
					{session?.admin && <AdminToolsComponent />}
					<button
						onClick={() => {
							setCartMenu(!cartMenu)
						}}
					>
						<MdOutlineShoppingCart size='25px' />
					</button>
					<button>
						<MdOutlineNotificationsNone size='25px' />
					</button>
					{session && session.user ? (
						<ProfileMenuComponent
							email={session.user.email}
							userId={session.user.id}
						/>
					) : (
						<Link href='/signin'>
							<HiOutlineLogin size='25px' className='cursor-pointer' />
						</Link>
					)}
				</div>
				<Cart cartMenu={cartMenu} setCartMenu={setCartMenu} />
			</div>
		</div>
	)
}

export default HeaderComponent
