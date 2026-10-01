import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

/* Admin Smartcard Links - Get All Links */

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing token" },
        { status: 401 },
      );
    }

    // Forward query params if any
    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const url = queryString
      ? `${BASE_URL}/admin/smartcardLinks?${queryString}`
      : `${BASE_URL}/admin/smartcardLinks`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
