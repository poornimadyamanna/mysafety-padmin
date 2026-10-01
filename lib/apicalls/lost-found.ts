"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

type LostFoundQuery = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export async function getLostFoundEvents({
  page,
  limit,
  search = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}: LostFoundQuery) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized - No token");
  }

  const res = await fetch(`${BASE_URL}/admin/lostfound`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return {
    items: data.data.items,
    totalPages: data.data.totalPages,
    totalRecords: data.data.totalRecords,
  };
}
