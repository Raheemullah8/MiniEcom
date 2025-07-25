// app/api/upload-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary"; // Cloudinary upload utility

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile || typeof imageFile === "string" || imageFile.size === 0) {
      return NextResponse.json({ message: "An image file is required." }, { status: 400 });
    }

    // Convert File to Base64 on the server
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mimeType = imageFile.type;
    const base64ImageString = `data:${mimeType};base64,${base64}`;

    // Upload to Cloudinary using the existing server-side function
    const imageUrl = await uploadImage(base64ImageString);

    return NextResponse.json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    }, { status: 200 });

  } catch (error) {
    console.error("Error in POST /api/upload-image:", error);
    return NextResponse.json({ message: "Failed to upload image." }, { status: 500 });
  }
}