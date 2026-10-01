import { NextResponse } from "next/server";

const BASE_URL = process.env.API_URL!;

export async function POST(req: Request) {
  try {
    const incomingFormData = await req.formData();
    const file = incomingFormData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File is required" },
        { status: 400 },
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const response = await fetch(`${BASE_URL}/user/files/upload`, {
      method: "POST",
      body: backendFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Upload failed" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
