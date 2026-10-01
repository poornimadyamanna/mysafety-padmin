"use client";

import { useEffect, useState } from "react";
import { useLocation } from "@/context/location-context";

type AddressType = {
  address: string | null;
  fullMapUrl: string | null;
  loading: boolean;
  error: string | null;
};

export function useAddress(): AddressType {
  const { lat, lng } = useLocation();

  const [address, setAddress] = useState<string | null>(null);
  const [fullMapUrl, setFullMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchAddress = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/get-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat, lng }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch address");
        }

        setAddress(data.address);
        setFullMapUrl(data.fullMapUrl);
      } catch (err: any) {
        console.error("Address fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [lat, lng]);

  return { address, fullMapUrl, loading, error };
}
