import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { title, price, description, imageBase64 } = await req.json();

    if (!title || !price || !description || !imageBase64) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const imageUrl = await uploadImage(imageBase64);

    const product = await prisma.product.create({
      data: { title, price: Number(price), description, imageUrl },
    });

    return NextResponse.json({ message: "Product created!", data: product }, { status: 201 });
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({ message: "Fetched", data: products }, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ message: "Error fetching" }, { status: 500 });
  }
}
