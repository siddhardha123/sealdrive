"use client";
import { WalletProvider } from "@suiet/wallet-kit";
import "./globals.css";
import "@suiet/wallet-kit/style.css";
import { Toaster } from 'react-hot-toast';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-neuebit antialiased">
        <WalletProvider>{children}</WalletProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
