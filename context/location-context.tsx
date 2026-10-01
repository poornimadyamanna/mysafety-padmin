"use client";

import { createContext, useContext, useState, useEffect } from "react";

type LocationType = {
    lat: number | null;
    lng: number | null;
    setLocation: (lat: number, lng: number) => void;
};

const LocationContext = createContext<LocationType | null>(null);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("user_location");
        if (stored) {
            const { lat, lng } = JSON.parse(stored);
            setLat(lat);
            setLng(lng);
        }
    }, []);

    const setLocation = (lat: number, lng: number) => {
        setLat(lat);
        setLng(lng);
        localStorage.setItem("user_location", JSON.stringify({ lat, lng }));
    };

    return (
        <LocationContext.Provider value={{ lat, lng, setLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) throw new Error("useLocation must be used inside LocationProvider");
    return context;
};