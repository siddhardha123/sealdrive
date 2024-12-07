import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { useRouter } from "next/navigation";
import {useWallet} from "@suiet/wallet-kit";

const Header = ({
                    walletAddress,
                    accountId,
                }: {
    userId: string;
    accountId: string;
}) => {
    const router = useRouter();
    const wallet = useWallet();

    const handleSignOut = async () => {
        await wallet.disconnect();
        router.push("/");
    };

    return (
        <header className="header">
            <div></div>
            <div className="flex space-x-5">
                <FileUploader walletAddress={walletAddress} accountId={accountId} />
                <Button onClick={handleSignOut}>
                    {/*<Image*/}
                    {/*    src="/assets/icons/logout.svg"*/}
                    {/*    alt="logout"*/}
                    {/*    width={24}*/}
                    {/*    height={24}*/}
                    {/*    className="w-6"*/}
                    {/*/>*/}
                    Sign out
                </Button>
            </div>
        </header>
    );
};

export default Header;

