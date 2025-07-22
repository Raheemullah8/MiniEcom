"use server"

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma";

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl?: string;
}

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
    const {title, price, description, imageUrl} = body;
    if(!title || !price || !description) {
        return NextResponse.json({message:"Messing require feilds"}, { status: 400 });
    }
    const product = await prisma.product.create({
        data:{
            title,
            price,
            description,
            imageUrl: imageUrl || undefined
        }
    });

       return NextResponse.json
       ({message:"product Create successful",
        status: 201,
        data:product});

    } catch (error) {
        console.log("error creating product:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
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

