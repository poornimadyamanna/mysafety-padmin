import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

// console.log("BASE_URL:", BASE_URL);
// console.log("Final URL:", `${BASE_URL}/admin/predefinedmsg/messages/list`);

// console.log("API_URL:", process.env.API_URL);
// console.log(
//   "Calling:",
//   `${process.env.API_URL}/admin/predefinedmsg/messages/list`,
// );

export async function POST(req: Request) {
  try {
    // console.log("API_URL:", process.env.API_URL);

    const body = await req.json();
    const { moduleType } = body;

    // console.log("Received moduleType:", moduleType);

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // console.log("Token exists:", !!accessToken);

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const finalUrl = `${process.env.API_URL}/admin/predefinedmsg/messages/list`;
    // console.log("Calling backend:", finalUrl);

    const response = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ moduleType }),
      cache: "no-store",
    });

    // console.log("Backend status:", response.status);

    const text = await response.text();
    // console.log("Backend raw response:", text);

    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Route handler error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
