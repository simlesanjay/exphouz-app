"use client";

import React, { useRef, useState } from "react";
import { IKUpload, ImageKitProvider } from "imagekitio-next";
import { Loader2, Image as ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
    onSuccess: (url: string) => void;
    folder?: string;
    currentImage?: string;
    label?: string;
}

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

// Authenticator function that fetches parameters from your new API route
const authenticator = async () => {
    try {
        const response = await fetch("/api/auth/imagekit");

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        console.error("Authentication request failed:", error);
        throw new Error(`Authentication request failed: ${error}`);
    }
};

const ImageUpload: React.FC<ImageUploadProps> = ({
    onSuccess,
    folder = "/uploads",
    currentImage,
    label = "Upload Image",
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const uploadInputRef = useRef<HTMLInputElement>(null);

    const onError = (err: any) => {
        console.log("Error", err);
        setUploading(false);
        alert("Upload failed. Please try again.");
    };

    const onSuccessHandler = (res: any) => {
        console.log("Success", res);
        setUploading(false);
        setPreview(res.url);
        onSuccess(res.url); // Pass the URL back to the parent form
    };

    const onUploadStart = () => {
        setUploading(true);
    };

    return (
        <div className="space-y-4">
            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}

            {/* ImageKit Context Provider */}
            <ImageKitProvider
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                authenticator={authenticator}
            >
                <div className="flex items-start gap-4">
                    {/* Upload Button Area */}
                    <div className="relative group cursor-pointer w-32 h-32 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 flex flex-col items-center justify-center transition-colors overflow-hidden">
                        {preview ? (
                            <>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white text-xs font-bold">Replace</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-2">
                                {uploading ? (
                                    <Loader2 className="animate-spin text-slate-400 mx-auto" />
                                ) : (
                                    <ImageIcon className="text-slate-400 mx-auto mb-1" />
                                )}
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                    {uploading ? "Uploading..." : "Click to Upload"}
                                </span>
                            </div>
                        )}

                        {/* Hidden actual file input managed by ImageKit */}
                        <IKUpload
                            fileName="file_upload"
                            useUniqueFileName={true}
                            folder={folder}
                            onError={onError}
                            onSuccess={onSuccessHandler}
                            onUploadStart={onUploadStart}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    {/* Helper Text */}
                    <div className="text-sm text-slate-500 mt-2">
                        <p>Supported: JPG, PNG, WebP.</p>
                        <p>Max size: 5MB.</p>
                        {preview && (
                            <button
                                type="button"
                                onClick={() => {
                                    setPreview(null);
                                    onSuccess(""); // Clear value
                                }}
                                className="text-red-500 text-xs font-bold mt-2 hover:underline"
                            >
                                Remove Image
                            </button>
                        )}
                    </div>
                </div>
            </ImageKitProvider>
        </div>
    );
};

export default ImageUpload;
