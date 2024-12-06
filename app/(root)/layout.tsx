"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { useWallet } from "@suiet/wallet-kit";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet();
  if (wallet && wallet.status !== "connected") {
    redirect("/");
  }
  return (
    <main className="flex h-screen">
      <Sidebar
        walletAddress={wallet.account?.address}
        avatar={"/assets/images/sealImage.png"}
        email={"sid@sid.com"}
      />

      <section className="flex h-full flex-1 flex-col">
        <Header walletAddress={wallet.account?.address} accountId={"1242345"} />
        <div className="main-content">{children}</div>
      </section>

      <Toaster />
    </main>
  );
};
export default Layout;
