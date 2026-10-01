"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

/* ================================
   CREATE SMARTCARD LINK
================================ */

export async function createSmartcardLink(payload: {
  webSiteName: string;
  type: string;
  logoUrl: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${BASE_URL}/admin/smartcardLinks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create link");
  }

  return data.data;
}

/* ================================
   UPDATE SMARTCARD LINK
================================ */

export async function updateSmartcardLink(payload: {
  linkId: string;
  webSiteName: string;
  type: string;
  logoUrl: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${BASE_URL}/admin/smartcardLinks`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update link");
  }

  return data.data;
}

/* ================================
   DELETE SMARTCARD LINK
================================ */

export async function deleteSmartcardLink(linkId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${BASE_URL}/admin/smartcardLinks?linkId=${linkId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete link");
  }

  return true;
}
