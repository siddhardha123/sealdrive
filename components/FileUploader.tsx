'use client';

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { cn, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { usePathname } from "next/navigation";

interface Props {
    ownerId: string;
    accountId: string;
    className?: string;
}

const FileUploader = ({ walletAddress, accountId, className }: Props) => {
    const path = usePathname();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('wallet_address', walletAddress);
        formData.append('accountId', accountId);

        const uploadUrl = `/api/walrus/upload`;

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setUploading(true);
            const uploadPromises = acceptedFiles.map(async (file) => {
                if (file.size > MAX_FILE_SIZE) {
                    toast.error(`${file.name} is too large. Max file size is 50MB.`);
                    return null;
                }

                setFiles((prevFiles) => [...prevFiles, file]);

                try {
                    const result = await uploadFile(file);
                    toast.success(`${file.name} uploaded successfully.`);
                    return result;
                } catch (error) {
                    toast.error(`Failed to upload ${file.name}. Please try again.`);
                    return null;
                } finally {
                    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
                }
            });

            await Promise.all(uploadPromises);
            setUploading(false);
        },
        [walletAddress, accountId]
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className={cn("cursor-pointer", className)}>
            <input {...getInputProps()} />
            <Button type="button" className="" disabled={uploading}>
                <Image
                    src="/assets/icons/upload.svg"
                    alt="upload"
                    width={24}
                    height={24}
                />
                <p>{uploading ? "Uploading..." : "Upload"}</p>
            </Button>
            {files.length > 0 && (
                <ul className="uploader-preview-list">
                    <h4 className="text-lg font-semibold text-primary">Uploading</h4>
                    {files.map((file, index) => {
                        const { type, extension } = getFileType(file.name);
                        return (
                            <li
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between py-2"
                            >
                                <div className="flex items-center gap-3">
                                    <Thumbnail
                                        type={type}
                                        extension={extension}
                                        url={URL.createObjectURL(file)}
                                    />
                                    <span className="text-sm text-primary">{file.name}</span>
                                </div>
                                <Image
                                    src="/assets/icons/file-loader.gif"
                                    width={80}
                                    height={26}
                                    alt="Loader"
                                />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FileUploader;

