"use server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

export async function getDashboardStats(): Promise<any> {
    const url = `${BASE_URL}/admin/analytics/dashboard`;
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
            return { success: false, error: data.message || "Fetching Dashboard Stats failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

export async function getUserGrowth(): Promise<any> {
    const url = `${BASE_URL}/admin/analytics/users/growth`;

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
            return { success: false, error: data.message || "Fetching Users Growth failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

export async function getRevenueGrowth(): Promise<any> {
    const url = `${BASE_URL}/admin/analytics/revenue/growth`;
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
            return { success: false, error: data.message || "Fetching Revenue Growth failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

export async function getModuleStats(): Promise<any> {
    const url = `${BASE_URL}/admin/analytics/modules`;
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
            return { success: false, error: data.message || "Fetching module stats failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

export async function getQrUsageStats(): Promise<any> {
    const url = `${BASE_URL}/admin/analytics/qr/usage`
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        })

        // 🔐 Unauthorized
        if (response.status === 401) {
            return { unauthorized: true }
        }

        // ❗ Ensure JSON response
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text()
            console.error("QR Usage API returned non-JSON:", text)
            return {
                success: false,
                error: "Invalid server response",
            }
        }

        const data = await response.json()

        if (!response.ok) {
            return {
                success: false,
                error: data?.message || "Fetching QR usage stats failed",
            }
        }

        return data
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error ? error.message : "Something went wrong",
        }
    }
}

export async function getTopUsers(): Promise<any> {
    const url = `${BASE_URL}/admin/analytics/users/top?limit=10`;
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
            return { success: false, error: data.message || "Fetching module stats failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}



