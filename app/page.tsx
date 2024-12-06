"use client";
import React from "react";
import Image from "next/image";
import { ConnectButton } from "@suiet/wallet-kit";
import { redirect } from "next/navigation";
const Page = () => {
  return (
    <div className="flex min-h-screen font-poppins">
      <section className="hidden w-1/2 items-center justify-center bg-brand p-12 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-10">
          <div className="text-4xl font-bold text-white">SealDrive</div>
          <div className="space-y-6 text-white">
            <h1 className="text-3xl font-extrabold leading-snug">
              Decentralized and Secure File Storage
            </h1>
            <p className="text-lg leading-relaxed">
              Your personal and professional documents are stored with the
              highest level of security and decentralization for ultimate
              reliability.
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

      {/* Right Section with Text and Connect Button */}
      <section className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-8 lg:justify-center lg:px-12 lg:py-0">
        {/* Added Text Content */}
        <div className="space-y-4 text-center">
          <h2 className="text-6xl font-bold text-gray-800">
            Welcome to SealDrive
          </h2>
          <p className="text-2xl font-extrabold text-seal">
            Join us in revolutionizing file storage. With SealDrive, you have
            complete control over your data, ensuring maximum privacy and
            security.
          </p>
          <p className="text-md text-gray-500">
            Start by connecting your wallet and access your secure storage.
          </p>
        </div>

        {/* Section for Connect Button */}
        <div className="mt-8 flex flex-col items-center space-y-6">
          <ConnectButton className="bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 text-white transition duration-300 focus:outline-none" />
          <button
            onClick={() => {
              redirect("/dashboard");
            }}
          >
            Get In
          </button>
        </div>
      </section>
    </div>
  );
};

export default Page;
