import { ThemeProvider } from 'next-themes';
import { Kanit } from "next/font/google";

import "./globals.css";
import HeaderComponent from './components/header/header.component';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { StoreProvider } from '@/redux/store.provider';

const kanitMini = Kanit({ subsets: ["latin"], weight: ['300'] });

export const metadata: Metadata = {
  title: "ViceShop",
  description: "ViceShop literally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kanitMini.className}>
        <ThemeProvider attribute="class">
          <SessionProvider>
            <StoreProvider>
              <div className={kanitMini.className}>
                <HeaderComponent />
                {children}
              </div>
            </StoreProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
