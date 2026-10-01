"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL;

export interface Audio {
  _id: string;
  name: string;
  code: string;
  fileName: string;
}

interface CreateAudioPayload {
  name: string;
  code: string;
  fileName: string;
}

interface UpdateAudioPayload {
  audioId: string;
  name: string;
  code: string;
  fileName?: string;
}

interface deleteAudioPayload {
  audioId: string;
}

export async function getAudioList(): Promise<{
  success: boolean;
  data?: Audio[];
  error?: string;
  unauthorized?: boolean;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, unauthorized: true };
  }

  try {
    const res = await fetch(`${BASE_URL}/admin/audio`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json.message || "Failed to fetch audio list",
      };
    }

    return {
      success: true,
      data: json.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Something went wrong",
    };
  }
}

export async function createAudio(payload: CreateAudioPayload): Promise<{
  success: boolean;
  data?: Audio;
  error?: string;
  unauthorized?: boolean;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, unauthorized: true };
  }

  try {
    const res = await fetch(`${BASE_URL}/admin/audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json.message || "Failed to create audio",
      };
    }

    return {
      success: true,
      data: json.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Something went wrong",
    };
  }
}

export async function updateAudio(payload: UpdateAudioPayload): Promise<{
  success: boolean;
  data?: Audio;
  error?: string;
  unauthorized?: boolean;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, unauthorized: true };
  }

  try {
    const res = await fetch(`${BASE_URL}/admin/audio`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json.message || "Failed to update audio",
      };
    }

    return {
      success: true,
      data: json.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Something went wrong",
    };
  }
}

export async function deleteAudio(payload: { audioId: string }): Promise<{
  success: boolean;
  error?: string;
  unauthorized?: boolean;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, unauthorized: true };
  }

  try {
    const res = await fetch(`${BASE_URL}/admin/audio`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload), // ✅ THIS WAS MISSING
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json.message || "Failed to delete audio",
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Something went wrong",
    };
  }
}
