import { ThemeProvider } from 'next-themes'
import { Kanit } from 'next/font/google'

import { StoreProvider } from '@/redux/store.provider'
import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from './components/contexts/cart.context'
import FooterComponent from './components/footer.component'
import HeaderComponent from './components/header.component'
import './globals.css'

const kanitMini = Kanit({ subsets: ['latin'], weight: ['300'] })

export const metadata: Metadata = {
	title: 'ViceShop',
	description: 'ViceShop literally',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={kanitMini.className}>
				<ThemeProvider enableSystem={true} attribute='class'>
					<SessionProvider>
						<CartProvider>
							<StoreProvider>
								<div>
									<HeaderComponent />
									{children}
									<FooterComponent />
								</div>
							</StoreProvider>
						</CartProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
