'use client'
import { useState, useEffect } from "react";

const Card = ({ img }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (img) {
            setImageUrl(img);
        }
    }, [img]);

    return (
        <div className="w-100 p-2 border rounded-lg shadow-md bg-white">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Stream Image"
                    className="w-full h-auto rounded-lg"
                />
            ) : (
                <p className="text-gray-500">Loading image...</p>
            )}
        </div>
    );
};

export default Card;
