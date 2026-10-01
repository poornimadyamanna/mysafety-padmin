"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

type GetAddressPayload = {
  lat: number;
  lng: number;
};

export async function getAddressFromCoordinates({
  lat,
  lng,
}: GetAddressPayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized - No token");
  }

  const res = await fetch(`${BASE_URL}/app/get-address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      lat,
      lng,
    }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch address");
  }

  return data.data ?? data;
}
