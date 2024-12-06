import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { useRouter } from "next/navigation";

const Header = ({
                    walletAddress,
                    accountId,
                }: {
    userId: string;
    accountId: string;
}) => {
    const router = useRouter();

    const handleSignOut = async () => {
        router.push("/");
    };

    return (
        <header className="header">
            <Search />
            <div className="header-wrapper">
                <FileUploader walletAddress={walletAddress} accountId={accountId} />
                <Button onClick={handleSignOut}>
                    <Image
                        src="/assets/icons/logout.svg"
                        alt="logout"
                        width={24}
                        height={24}
                        className="w-6"
                    />
                </Button>
            </div>
        </header>
    );
};

export default Header;

