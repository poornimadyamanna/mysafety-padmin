"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

export interface UpdateContentPayload {
  field: "terms" | "privacyPolicy";
  translations: Record<string, string>;
}

export async function updateContent(payload: UpdateContentPayload) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { unauthorized: true };
  }

  try {
    const res = await fetch(`${BASE_URL}/admin/content`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
