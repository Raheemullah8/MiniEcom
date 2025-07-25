// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import { uploadImage } from "@/lib/cloudinary"; // <-- Ab direct uploadImage use nahi hoga

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl?: string;
}

/**
 * Handles POST requests to /api/products to create a new product.
 * Expects JSON body with 'title', 'price', 'description', and 'imageUrl'.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // JSON data receive kar rahe hain
    const { title, price, description, imageUrl } = body; // <-- Ab imageUrl direct hai

    // --- Simple Validations ---
    if (!title) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ message: "Valid price is required." }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ message: "Description is required." }, { status: 400 });
    }
    // Image URL validation (it should be present as it's uploaded separately)
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === "") {
        return NextResponse.json({ message: "Image URL is required." }, { status: 400 });
    }


    // --- Save Product to Database ---
    const newProduct = await prisma.product.create({
      data: {
        title,
        price,
        description,
        imageUrl, // Store the received Cloudinary URL
      },
    });

    console.log("Product created successfully:", newProduct);
    return NextResponse.json({
      message: "Product created successfully",
      data: newProduct,
    }, { status: 201 });

  } catch (error) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * Handles GET requests to /api/products to fetch all products. (No Change)
 */
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json({
      message: "Products fetched successfully",
      data: products,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}