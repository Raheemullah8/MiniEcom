"use server"

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl?: string;
}

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     // Destructure fields
//     const { title, price, description, imageBase64 } = body;

//     // Field validation
//     if (!title || !price || !description || !imageBase64) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Upload image to Cloudinary
//     const imageUrl = await uploadImage(imageBase64);

//     // Save to DB
//     const product = await prisma.product.create({
//       data: {
//         title,
//         price,
//         description,
//         imageUrl,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Product created successfully",
//         data: product,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating product:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const imageFile = formData.get("image") as File;
    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;

    if (!imageFile || typeof imageFile === "string") {
      return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
    }

    // ✅ Convert file to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    const mimeType = imageFile.type; // e.g., image/png or image/jpeg
    const base64Image = `data:${mimeType};base64,${base64}`;

    // ✅ Upload to Cloudinary
    const imageUrl = await uploadImage(base64Image);

    console.log("Image Uploaded:", imageUrl);

    // ✅ Response
    return NextResponse.json({
      success: true,
      title,
      price,
      description,
      imageUrl,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


export async function GET() {
    try {
        const products = await prisma.product.findMany();
        return NextResponse.json({ message: "Products fetched successfully", data: products }, { status: 200 });

    } catch (error) {
        console.log("error fetching products:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

