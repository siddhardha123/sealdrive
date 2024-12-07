import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileIcon, FolderIcon, UploadCloudIcon, PlusIcon, SettingsIcon } from 'lucide-react'
import {useWallet} from "@suiet/wallet-kit";

const Dash = () => {
    // Mock data for demonstration
    const wallet = useWallet()
    const storageUsed = 2;
    const storageTotal = 15;
    const storagePercentage = (storageUsed / storageTotal) * 100;

    const recentFiles = [
        { name: "Project Proposal.docx", type: "file", size: "2.3 MB", date: "2023-12-05" },
        { name: "Vacation Photos", type: "folder", size: "1.2 GB", date: "2023-11-28" },
        { name: "Budget 2024.xlsx", type: "file", size: "5.1 MB", date: "2023-12-01" },
    ];
    function truncateAddress(address) {
        if (!address || address.length <= 10) return address;
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Drive</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Storage</CardTitle>
                        <CardDescription>Your storage usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={storagePercentage} className="mb-2" />
                        <p className="text-sm text-muted-foreground">
                            {storageUsed} MB of {storageTotal} MB used
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src="/placeholder-user.jpg" alt="User" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {truncateAddress(wallet.account?.address)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Files</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {recentFiles.map((file, index) => (
                            <div key={index} className="flex items-center py-3">
                                {file.type === 'file' ? (
                                    <FileIcon className="mr-3 h-5 w-5 text-blue-500" />
                                ) : (
                                    <FolderIcon className="mr-3 h-5 w-5 text-yellow-500" />
                                )}
                                <div className="flex-grow">
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">{file.size} • {file.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dash;

