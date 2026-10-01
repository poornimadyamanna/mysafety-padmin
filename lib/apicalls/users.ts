"use server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

interface usersData {
    page: number,
    size: number,
    sortBy: string,
    sortType: string,
    search: string
}
export async function getAllUsers(payload: usersData): Promise<any> {
    const url = `${BASE_URL}/admin/users`;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        // ✅ Handle 401 BEFORE parsing JSON
        if (response.status === 401) {
            return { unauthorized: true };
        }

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || "Getting users list failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

interface updateData {
    userId: string,
    name: string,
    email: string,
    address: {
        fulladdress: string,
        pincode: number,
        landmark: string,
        mapUrl: string,
    },
    phone: number,
    lang: string,
}
export async function updateUsers(payload: updateData): Promise<any> {
    const url = `${BASE_URL}/admin/users`;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        // ✅ Handle 401 BEFORE parsing JSON
        if (response.status === 401) {
            return { unauthorized: true };
        }

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || "Updating users failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

export async function getUserById(userId: string): Promise<any> {
    const url = `${BASE_URL}/admin/users/details`;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId }),
        });

        // ✅ Handle 401 BEFORE parsing JSON
        if (response.status === 401) {
            return { unauthorized: true };
        }

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || "Getting users list failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

interface deactivateData {
    userId: string,
    isActive: boolean,
}
export async function deactivateUsers(payload: deactivateData): Promise<any> {
    const url = `${BASE_URL}/admin/users/toggle-status`;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    try {
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        // ✅ Handle 401 BEFORE parsing JSON
        if (response.status === 401) {
            return { unauthorized: true };
        }

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || "Updating users failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

export async function getLanguages(): Promise<any> {
    const url = `${BASE_URL}/app/languages`;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // ✅ Handle 401 BEFORE parsing JSON
        if (response.status === 401) {
            return { unauthorized: true };
        }

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.message || "Getting languages failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}