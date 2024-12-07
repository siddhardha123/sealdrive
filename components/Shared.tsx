'use client'
import Card from "@/components/Card";
import React, {useEffect, useState} from "react";
import {useWallet} from "@suiet/wallet-kit";
import {file} from "valibot";
import FileCard from "@/components/Card";
import {Skeleton} from "@/components/ui/skeleton";


const Shared = () => {

    const [validFiles, setValidFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const wallet = useWallet()

    useEffect(() => {
        const fetchBlobIds = async () => {
            try {
                const response = await fetch(`/api/walrus/shared?wallet_address=${wallet.account?.address}`, { method: 'GET' });
                if (!response.ok) {
                    console.error("Failed to fetch blob IDs");
                    return [];
                }
                const data = await response.json()
                const result = data?.result?.rows.map(item => ({
                    blob_id: item.blob_id,
                    file_name: item?.file_name
                }))
                return result
            } catch (error) {
                console.error("Error fetching blob IDs:", error);
                return [];
            }
        };

        const fetchFiles = async () => {
            const files = await fetchBlobIds();
            if (files.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const fetchedFiles = await Promise.all(
                    files.map(async (file) => {
                        const response = await fetch(
                            `https://aggregator.walrus-testnet.walrus.space/v1/${file.blob_id}`,
                            { method: 'GET' }
                        );
                        if (!response.ok) {
                            console.error(`Failed to fetch blob ${file.blob_id}`);
                            return null;
                        }
                        const blob = await response.blob()
                        return {
                            url: URL.createObjectURL(blob),
                            ...file
                        }
                    })
                );

                setValidFiles(fetchedFiles); // Set the valid files
            } catch (error) {
                console.error("Error fetching files:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);
    return (
        <div className="page-container">
            <section className="w-full">
                <div className="total-size-section">
                    <p className="body-1">
                        {/*Total size section*/}
                    </p>
                </div>
            </section>

            {/* Render the files */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} className="h-[200px] w-full"/>
                    ))}
                </div>
            ) : validFiles.length > 0 ? (
                <section className="file-list">
                    {validFiles.map((file, index) => (
                        <FileCard key={index} img={file.url} blobId={file.blob_id} isShared={false}
                                  fileName={file.file_name}/>
                    ))}
                </section>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
        </div>
    );
};

export default Shared;

