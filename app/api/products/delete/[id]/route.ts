// app/api/products/delete/[id]/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before destructuring
    const awaitedParams = await params;
    const { id } = awaitedParams;

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Product deleted successfully", data: product }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}