'use client';

import React from "react";
import Media from "@/components/Media";
import Shared from "@/components/Shared";
import Dash from "@/components/Dash";
import {useParams} from "next/navigation";

const Page = async ({ }) => {
    const params = useParams(); // Unwrap the Promise using await or `use()` in the future

    return (
        <>
            {params.type === "media" && <Media />}
            {params.type === "shared" && <Shared />}
            {params.type === "dashboard" && <Dash />}
        </>
    );
};

export default Page;
