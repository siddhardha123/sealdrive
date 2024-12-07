"use client";
import React from "react";
import Image from "next/image";
import {ConnectButton, useWallet} from "@suiet/wallet-kit";
import { redirect } from "next/navigation";
import {Button} from "@/components/ui/button";

const Page = () => {

  const wallet = useWallet();
  return (
      <div className="flex min-h-screen flex-col lg:flex-row font-poppins bg-gray-50">
        {/* Left Section */}
        <section className="hidden lg:flex lg:w-1/2 xl:w-2/5 items-center justify-center bg-brand from-indigo-600 to-purple-600 p-12">
          <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-10">
            <div className="text-5xl font-extrabold text-white">
              <span className="block">SealDrive</span>
            </div>
            <div className="space-y-6 text-white">
              <h1 className="text-4xl font-bold leading-snug">
                Decentralized & Secure File Storage
              </h1>
              <p className="text-lg leading-relaxed opacity-90">
                Store your documents with unmatched security, decentralization,
                and reliability.
              </p>
            </div>
            <Image
                src="/assets/images/sealImage.png"
                alt="Files"
                width={342}
                height={342}
                className="transition-transform duration-300 hover:rotate-2 hover:scale-105"
            />
          </div>
        </section>

        {/* Right Section */}
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-6 lg:px-12 bg-white">
          <div className="space-y-8 text-center max-w-[480px]">
            <p className="text-2xl text-gray-700">
              Revolutionize your file storage experience with unparalleled privacy
              and control.
            </p>
            <p className="text-md text-gray-500">
              Get started by connecting your wallet and unlock your secure storage space.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col items-center mt-12 space-y-6">
            <ConnectButton
                className="bg-brand  rounded-lg px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400"/>
            <div>
              <Button
                  type="button"
                  disabled={!wallet?.account?.address}
                  className="bg-brand hover:bg-[#9aefe4] hover:text-black rounded-lg px-6 py-6 text-lg font-semibold text-white shadow-md transition duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400"
                  onClick={() => {
                    redirect("/dashboard");
                  }}
              >
                Access Storage
              </Button>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Page;
