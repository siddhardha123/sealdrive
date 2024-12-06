'use client'
import { useState, useEffect } from 'react';

const ImageComponent = () => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch('https://aggregator.walrus-testnet.walrus.space/v1/dON_NqQPu2scijinEaJ6N34ZPULpvGpf6iaoVwU2eSY', {
                    method: 'GET',
                });

                // Check if the response is successful
                if (response.ok) {
                    const imageBlob = await response.blob();
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    setImageUrl(imageObjectURL);
                } else {
                    console.error('Failed to fetch image');
                }
            } catch (error) {
                console.error('Error fetching the image:', error);
            }
        };

        fetchImage();
    }, []);

    return (
        <div>
            {imageUrl ? (
                <img src={imageUrl} alt="Fetched from API" />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ImageComponent;
