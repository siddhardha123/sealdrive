'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileIcon, FolderIcon } from 'lucide-react'
import { useWallet } from "@suiet/wallet-kit"
import {getFileIcon, getFileType} from "@/lib/utils";
import Image from "next/image";
interface FileData {
    file_name: string
    created_at: string
    blob_id: string
    size: number
    url: string
}

const Dash = () => {
    const wallet = useWallet()
    const [storageUsed, setStorageUsed] = useState(0)
    const [storageTotal] = useState(15 * 1024 * 1024) // 15 MB in bytes
    const [recentFiles, setRecentFiles] = useState<FileData[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/walrus/get?wallet_address=${wallet.account?.address}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch data')
                }
                const data = await response.json()

                const fetchedFiles = await Promise.all(
                    data.result.rows.map(async (file: Omit<FileData, 'size' | 'url'>) => {
                        const response = await fetch(
                            `https://aggregator.walrus-testnet.walrus.space/v1/${file.blob_id}`,
                            { method: 'GET' }
                        )
                        if (!response.ok) {
                            console.error(`Failed to fetch blob ${file.blob_id}`)
                            return null
                        }
                        const blob = await response.blob()
                        return {
                            ...file,
                            size: blob.size,
                            url: URL.createObjectURL(blob)
                        }
                    })
                )

                const validFiles = fetchedFiles.filter((file): file is FileData => file !== null)
                setRecentFiles(validFiles)

                const totalUsed = validFiles.reduce((acc, file) => acc + file.size, 0)
                setStorageUsed(totalUsed)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const storagePercentage = (storageUsed / storageTotal) * 100

    function truncateAddress(address: string | undefined) {
        if (!address || address.length <= 10) return address
        return `${address.slice(0, 5)}...${address.slice(-5)}`
    }

    function formatSize(bytes: number) {
        const units = ['B', 'KB', 'MB', 'GB']
        let size = bytes
        let unitIndex = 0
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex++
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString()
    }

    const getImage = (name) => {
      const {extension,type} =  getFileType(name)
        return getFileIcon(extension,type)
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
                            {formatSize(storageUsed)} of {formatSize(storageTotal)} used
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
                            <p className="text-sm text-muted-foreground">
                                {wallet?.name}
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
                        {recentFiles.slice(0, Math.min(recentFiles.length, 3)).map((file, index) => (
                            <div key={index} className="flex items-center py-3">
                                <Image  src={`${getImage(file.file_name)}`} width={30} height={30} className="mr-3 h-5 w-5 text-blue-500" alt={file.file_name}/>
                                <div className="flex-grow">
                                    <p className="font-medium">{file.file_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatSize(file.size)} • {formatDate(file.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Dash

