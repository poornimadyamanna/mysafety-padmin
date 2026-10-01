"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

/* ================================
   CREATE MESSAGE TEMPLATE
================================ */

export async function createPredefinedMessage(payload: {
  moduleType: "Vehicle" | "LostFound";
  title: string;
  message: string;
  audioId: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${BASE_URL}/admin/predefinedmsg/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create message template");
  }

  return data.data;
}

/* ================================
   UPDATE MESSAGE TEMPLATE
================================ */

export async function updatePredefinedMessage(payload: {
  messageId: string;
  title: string;
  message: string;
  audioId: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${BASE_URL}/admin/predefinedmsg/messages`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update message template");
  }

  return data.data;
}

/* ================================
   DELETE MESSAGE TEMPLATE
================================ */

export async function deletePredefinedMessage(messageId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${BASE_URL}/admin/predefinedmsg/messages`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messageId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete message template");
  }

  return true;
}
