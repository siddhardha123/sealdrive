import Card from "@/components/Card";
import React, {useEffect, useState} from "react";
import {useWallet} from "@suiet/wallet-kit";


const Media = () => {

    const [validFiles, setValidFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const wallet = useWallet()

    useEffect(() => {
        const fetchBlobIds = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/walrus/get?wallet_address=${wallet.account?.address}`, { method: 'GET' });
                if (!response.ok) {
                    console.error("Failed to fetch blob IDs");
                    return [];
                }
                const data = await response.json();
                // Assuming the response contains an array of objects with a `blobId` property
                return data?.result?.rows.map((item: { blobId: string }) => item.blob_id);
            } catch (error) {
                console.error("Error fetching blob IDs:", error);
                return [];
            }
        };

        const fetchFiles = async () => {
            const blobIds = await fetchBlobIds();
            if (blobIds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const fetchedFiles = await Promise.all(
                    blobIds.map(async (blobId) => {
                        const response = await fetch(
                            `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`,
                            { method: 'GET' }
                        );
                        if (!response.ok) {
                            console.error(`Failed to fetch blob ${blobId}`);
                            return null;
                        }
                        const blob = await response.blob();
                        return {
                            url : URL.createObjectURL(blob),
                            blob_id : blobId
                        }; // Convert blob to URL
                    })
                );

                // Filter out any null values
                const files = fetchedFiles.filter((file) => file.url !== null);
                setValidFiles(files as string[]); // Set the valid files
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
                <p>Loading files...</p>
            ) : validFiles.length > 0 ? (
                <section className="file-list">
                    {validFiles.map((file, index) => (
                        <Card key={index} img={file.url} blobId={file.blob_id} isShared={true} />
                    ))}
                </section>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
        </div>
    );
};

export default Media;

