"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

// ================= COMMON =================
const getAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized - No token");
  }

  return token;
};

// ================= GET =================
export async function getBanners() {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/admin/banners`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch banners");
  }

  return data.data ?? data;
}

// ================= CREATE =================
export async function createBannerAction(payload: {
  category: "general" | "ecommerce";
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}) {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/admin/banners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create banner");
  }

  return data;
}

// ================= UPDATE =================
export async function updateBannerAction(payload: {
  id: string;
  category: "general" | "ecommerce";
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}) {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/admin/banners`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bannerId: payload.id,
      category: payload.category,
      imageUrl: payload.imageUrl,
      isActive: payload.isActive,
      sortOrder: payload.sortOrder,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update banner");
  }

  return data;
}

// ================= DELETE =================
export async function deleteBannerAction(id: string) {
  const token = await getAuthToken();

  const res = await fetch(`${BASE_URL}/admin/banners`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bannerId: id,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete banner");
  }

  return data;
}
