'use client'

import React, { useEffect, useState } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import FileCard from "@/components/Card"

export default function Media() {
    const [validFiles, setValidFiles] = useState<Array<{ url: string; blob_id: string }>>([])
    const [loading, setLoading] = useState(true)
    const wallet = useWallet()

    useEffect(() => {
        const fetchBlobIds = async () => {
            try {
                const response = await fetch(`/api/walrus/get?wallet_address=${wallet.account?.address}`, { method: 'GET' })
                if (!response.ok) {
                    console.error("Failed to fetch blob IDs")
                    return []
                }
                const data = await response.json()
                const result = data?.result?.rows.map(item => ({
                    blob_id: item.blob_id,
                    file_name: item?.file_name
                }))
                return result
            } catch (error) {
                console.error("Error fetching blob IDs:", error)
                return []
            }
        }

        const fetchFiles = async () => {
            const files = await fetchBlobIds()
            if (files.length === 0) {
                setLoading(false)
                return
            }

            try {
                const fetchedFiles = await Promise.all(
                    files.map(async (file) => {
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
                            url: URL.createObjectURL(blob),
                            ...file
                        }
                    })
                )

                setValidFiles(fetchedFiles)
            } catch (error) {
                console.error("Error fetching files:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchFiles()
    }, [wallet.account?.address])

    return (
        <div className="container mx-auto p-4">

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} className="h-[200px] w-full" />
                    ))}
                </div>
            ) : validFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {validFiles.map((file, index) => (
                        <FileCard key={index} img={file.url} blobId={file.blob_id} isShared={true} fileName={file.file_name}/>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-8">No files uploaded</p>
            )}
        </div>
    )
}

