import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
 req: NextRequest, { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const productId = await params;
    const { id } = productId;
    
    if (!id) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id : Number(id)},
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Wrap the product in a data object
    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}