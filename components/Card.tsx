    'use client'

    import { useState, useEffect } from "react"
    import { useWallet } from "@suiet/wallet-kit"
    import { toast } from "react-hot-toast"
    import { Share2, Download } from 'lucide-react'
    import { Card, CardContent } from "@/components/ui/card"
    import { Button } from "@/components/ui/button"
    import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogFooter,
    } from "@/components/ui/dialog"
    import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"

    interface FileCardProps {
        img: string
        blobId: string
        isShared?: boolean
    }

    export default function FileCard({ img, blobId, isShared = false }: FileCardProps) {
        const [imageUrl, setImageUrl] = useState<string | null>(null)
        const [fileName, setFileName] = useState('')
        const [fileSize, setFileSize] = useState(0)
        const [walletAddress, setWalletAddress] = useState('')
        const [isModalOpen, setIsModalOpen] = useState(false)

        useEffect(() => {
            if (img) {
                setImageUrl(img)
                fetchFileDetails(img)
            }
        }, [img])

        const fetchFileDetails = async (url: string) => {
            try {
                const response = await fetch(url)
                const blob = await response.blob()
                const name = url.split('/').pop() || 'Unknown'
                const size = blob.size

                setFileName(name)
                setFileSize(size)
            } catch (error) {
                console.error('Error fetching file details:', error)
            }
        }

        const handleShareClick = () => {
            setIsModalOpen(true)
        }

        const handleWalletAddressSubmit = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/walrus/shared`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ wallet_address: walletAddress, blob_id: blobId }),
                })

                if (response.ok) {
                    toast.success('File shared successfully!')
                } else {
                    toast.error('Failed to share the file!')
                }
            } catch (error) {
                console.error(error)
                toast.error('Error occurred while sharing the file!')
            }

            setIsModalOpen(false)
            setWalletAddress('')
        }

        const handleDownload = async () => {
            if (!imageUrl) {
                toast.error('File not available for download')
                return
            }

            try {
                const response = await fetch(imageUrl)
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = fileName
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
                toast.success('File downloaded successfully!')
            } catch (error) {
                console.error('Error downloading file:', error)
                toast.error('Failed to download file')
            }
        }

        return (
            <Card>
                <CardContent className="p-0">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="File Preview"
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/4208/4208479.png";
                            }}
                        />
                    ) : (
                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500">Loading image...</p>
                        </div>
                    )}
                    <div className="p-4">
                        <p className="text-sm font-medium truncate">{fileName}</p>
                        <p className="text-xs text-gray-500">{(fileSize / 1024).toFixed(2)} KB</p>
                        <div className="flex justify-between space-x-2 mt-2">
                            <Button variant="outline" size="sm" onClick={handleDownload}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                            {isShared && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShareClick}
                                    className="px-2"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Share File</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="wallet-address" className="text-right">
                                    Wallet Address
                                </Label>
                                <Input
                                    id="wallet-address"
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleWalletAddressSubmit}>Share</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Card>

        )
    }

