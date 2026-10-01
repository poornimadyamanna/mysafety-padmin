"use server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

interface qrData {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  status: string;
  moduleType: string;
  batchInfo?: string;
  count?: number;
}
export async function createQr(payload: qrData, otp: string): Promise<any> {
  const url = `${BASE_URL}/admin/qr/generate-batch`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-totp-code": otp,
      },
      body: JSON.stringify(payload),
    });

    // Handle 401 BEFORE parsing JSON
    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Creating QR failed" };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getQr(payload: qrData): Promise<any> {
  const url = `${BASE_URL}/admin/qr/inventoryByBatchNo`;
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
        error: data.message || "Fetching QR list failed",
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

export async function getModules(): Promise<any> {
  const url = `${BASE_URL}/app/modules`;
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
      return {
        success: false,
        error: data.message || "Fetching Module types failed",
      };
    }

    return data; // ✅ returns { success, message, data: [...] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getQrCounts(): Promise<any> {
  const url = `${BASE_URL}/admin/qr/inventoryCounts`;
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
      return {
        success: false,
        error: data.message || "Fetching QR counts failed",
      };
    }

    return data; // ✅ returns { success, message, data: [...] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

interface batchData {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
}
export async function getBatchInventory(payload: batchData): Promise<any> {
  const url = `${BASE_URL}/admin/qr/inventory`;
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

    // Handle 401 BEFORE parsing JSON
    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Fetching Batch list is failed",
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

export async function setUpAuth(): Promise<any> {
  const url = `${BASE_URL}/admin/totp/setup`;
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

    // Handle 401 BEFORE parsing JSON
    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Setup is failed" };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function enableAuth(token: string): Promise<any> {
  const url = `${BASE_URL}/admin/totp/enable`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ token }),
    });

    // Handle 401 BEFORE parsing JSON
    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Enable is failed" };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function disableAuth(token: string): Promise<any> {
  const url = `${BASE_URL}/admin/totp/disable`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ token }),
    });

    // Handle 401 BEFORE parsing JSON
    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Enable is failed" };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getExistingSetup(): Promise<any> {
  const url = `${BASE_URL}/admin/totp/qr-code`;
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

    // Handle 401 BEFORE parsing JSON
    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Fetch existing setup is failed",
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
