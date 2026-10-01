"use server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

interface orderData {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  paymentStatus: string;
  orderStatus?: string;
  moduleType: string;
}
export async function getOrderList(payload: orderData): Promise<any> {
  const url = `${BASE_URL}/admin/orders/list`;
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
      return {
        success: false,
        error: data.message || "Fetching Order list failed",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getOrderStats(): Promise<any> {
  const url = `${BASE_URL}/admin/orders/statistics`;
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

    //  Handle 401 BEFORE parsing JSON
    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();
    // console.log("data...", data);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Fetching Order statistics are failed",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

interface updateOrderData {
  orderId: string;
  orderStatus: string;
}
export async function updateOrderStatus(
  payload: updateOrderData,
): Promise<any> {
  const url = `${BASE_URL}/admin/orders/status`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const response = await fetch(url, {
      method: "PUT",
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
      return {
        success: false,
        error: data.message || "Updating order status is failed",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

interface OrderDetails {
  orderId: string;
}
export async function getOrderDetails(payload: OrderDetails): Promise<any> {
  const url = `${BASE_URL}/admin/orders/details`;
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
      return {
        success: false,
        error: data.message || "View order details are failed",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
