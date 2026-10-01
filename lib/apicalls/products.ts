"use server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

export async function getProductList(): Promise<any> {
    const url = `${BASE_URL}/admin/pricing`;
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
            return { success: false, error: data.message || "Fetching Product list failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

interface ProductData {
    moduleType: string,
    basePrice: number,
    bulkDiscounts: {
        minQuantity: number,
        maxQuantity: number,
        discountPercentage: number
    }
}
export async function createUpdateProducts(payload: ProductData): Promise<any> {
    const url = `${BASE_URL}/admin/pricing`;
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
            return { success: false, error: data.message || "Create or Update products are failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

interface ProductDetails {
    moduleType: string,
}
export async function getProductDetails(payload: ProductDetails): Promise<any> {
    const url = `${BASE_URL}/admin/pricing/details`;
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
            return { success: false, error: data.message || "View product details are failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

export async function deleteProduct(payload: ProductDetails): Promise<any> {
    const url = `${BASE_URL}/admin/pricing`;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    try {
        const response = await fetch(url, {
            method: "DELETE",
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
            return { success: false, error: data.message || "Delete products are failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

export async function getInventoryStats(): Promise<any> {
    const url = `${BASE_URL}/admin/orders/inventory`;
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
            return { success: false, error: data.message || "Fetching inventory stats failed" };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}