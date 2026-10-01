"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

export interface SubscriptionFeature {
  moduleType: string;
  featureName: string;
  featureKey: string;
  limit: any;
}

export interface SubscriptionPayload {
  name: string;
  type: string;
  price: number;
  currency: string;
  features: SubscriptionFeature[];
}

export async function createSubscriptionPlans(
  payload: SubscriptionPayload,
): Promise<any> {
  const url = `${BASE_URL}/admin/subscriptions`;
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

    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export interface SubscriptionUpdatePayload {
  planId: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  features: SubscriptionFeature[];
}
export async function UpdateSubscriptionPlans(
  payload: SubscriptionUpdatePayload,
): Promise<any> {
  const url = `${BASE_URL}/admin/subscriptions`;
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

    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function DeleteSubscriptionPlans(planId: string): Promise<any> {
  const url = `${BASE_URL}/admin/subscriptions`;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ planId }),
    });

    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getSubscriptionPlans(): Promise<any> {
  const url = `${BASE_URL}/admin/subscriptions`;
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

    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();
    // console.log("Subscription plans response data:", data);

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function getSubscriptionStats(): Promise<any> {
  const url = `${BASE_URL}/admin/analytics/subscriptions`;
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

    if (response.status === 401) {
      return { unauthorized: true };
    }

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
