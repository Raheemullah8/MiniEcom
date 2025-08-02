import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, price, description, imageBase64 } = body;

    if (!title || !price || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const imageUrl = await uploadImage(imageBase64)

    const product = await prisma.product.update({
      where: { id: numericId },
      data: {
        title,
        price,
        description,
       imageUrl
      },
    });

    return NextResponse.json(
      {
        message: "Product updated successfully",
        data: product,
      },
      { status: 200 } // 👈 201 se 200 sahi hai update k liye
    );
  } catch (error) {
    console.log("error updating product:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
