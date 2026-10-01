"use server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

export async function SocialLogin({
  idToken,
}: {
  idToken: string;
}): Promise<any> {
  const url = `${BASE_URL}/admin/auth/login`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Authentication failed" };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function Logout(): Promise<any> {
  const url = `${BASE_URL}/admin/auth/logout`;
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
      return { success: false, error: data.message || "Logout failed" };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
