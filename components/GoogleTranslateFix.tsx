"use client";

import { useEffect } from "react";
import { removeGoogleTranslateBanner } from "@/lib/removeGoogleTranslateBanner";

export default function GoogleTranslateFix() {
    useEffect(() => {
        removeGoogleTranslateBanner();
    }, []);

    return null;
}
