import { NextResponse } from "next/server";

const BASE_URL = process.env.API_URL!;

export async function POST(req: Request) {
  try {
    const { lat, lng } = await req.json();

    //  Validation
    if (lat == null || lng == null) {
      return NextResponse.json(
        { success: false, message: "Latitude and Longitude are required" },
        { status: 400 },
      );
    }

    // Call backend API
    const response = await fetch(`${BASE_URL}/app/get-address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, lng }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Failed to fetch address" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET ADDRESS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
