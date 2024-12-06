'use client'
import React, { useState, useEffect } from "react";
import Media from "@/components/Media";
import Shared from '@/components/Shared'

const Page = ({params}) => {
    return (
        <>
            {
                params?.type === 'media' && <Media />
            }
            {
                params?.type === 'shared' && <Shared />
            }
        </>
    );
};

export default Page;
