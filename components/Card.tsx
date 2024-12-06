'use client'
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast'; // Ensure Toaster is imported
import { FiShare2 } from 'react-icons/fi';
import {useWallet} from "@suiet/wallet-kit"; // Import share icon from react-icons

const Card = ({ img ,blobId , isShared = false}) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState(0);
    const [walletAddress,setWalletAddress] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (img) {
            setImageUrl(img);
            fetchFileDetails(img);
        }
    }, [img]);

    const fetchFileDetails = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const name = url.split('/').pop();  // Extract the file name from the URL
            const size = blob.size;  // Get the file size in bytes
            console.log(url)

            setFileName(name);
            setFileSize(size);
        } catch (error) {
            console.error('Error fetching file details:', error);
        }
    };

    const handleShareClick = () => {
        setIsModalOpen(true);
    };

    const handleWalletAddressSubmit = async () => {
        // Make the API call here
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/walrus/shared`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wallet_address : walletAddress, blob_id : blobId }),
            });

            if (response.ok) {
                toast.success('File shared successfully!');
            } else {
                toast.error('Failed to share the file!');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error occurred while sharing the file!');
        }

        setIsModalOpen(false);
        setWalletAddress('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);  // Close the modal
    };

    return (
        <div className="w-72 p-2 border rounded-lg shadow-md bg-white relative">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Stream Image"
                    className="w-full h-auto rounded-lg"
                />
            ) : (
                <p className="text-gray-500">Loading image...</p>
            )}

            {/* File Name and Size */}
            <div className="mt-2 text-sm text-gray-600">
                <p>{fileName}</p>
                <p>{(fileSize / 1024).toFixed(2)} KB</p>
            </div>

            {/* Share Icon */}
            {
                isShared && <button
                    onClick={handleShareClick}
                    className="absolute top-2 right-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2"
                >
                    <FiShare2 className="w-6 h-6"/>
                </button>
            }


            {/* Modal to Input Wallet Address */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96 relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                        <h3 className="text-lg mb-4">Enter Wallet Address</h3>
                        <input
                            type="text"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder="Enter wallet address"
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleWalletAddressSubmit}
                                className="bg-black-10 text-white px-4 py-2 rounded"
                            >
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Card;
