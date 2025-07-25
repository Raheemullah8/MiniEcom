// actions/product.ts
"use server";

import { IProduct } from "@/type"; // Assuming IProduct is defined here or imported correctly
import { uploadImage } from "@/lib/cloudinary"; // Corrected import path
import { addProductToDB } from "@/service/productService"; // Corrected import path

interface FormState {
    message: string;
    success: boolean;
    data?: IProduct;
    errors?: {
        title?: string;
        price?: string;
        description?: string;
        image?: string;
    };
}

export async function addProductAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const imageFile = formData.get("image") as File;
        const title = formData.get("title") as string;
        const priceStr = formData.get("price") as string;
        const description = formData.get("description") as string;

        const errors: FormState["errors"] = {};
        if (!title || title.trim() === "") errors.title = "Title is required.";
        if (!priceStr || isNaN(Number(priceStr)) || Number(priceStr) <= 0) errors.price = "Valid price is required.";
        if (!description || description.trim() === "") errors.description = "Description is required.";
        if (!imageFile || typeof imageFile === "string" || imageFile.size === 0) errors.image = "An image file is required.";

        if (Object.keys(errors).length > 0) {
            return { success: false, message: "Validation failed.", errors };
        }

        const price = Number(priceStr);

        let imageUrl: string;
        try {
            imageUrl = await uploadImage(imageFile); // Directly pass the File object
        } catch (uploadError) {
            console.error("Cloudinary Upload Failed:", uploadError);
            return { success: false, message: "Failed to upload image. Please try again." };
        }

        const newProduct = await addProductToDB({
            title,
            price,
            description,
            imageUrl,
        });

        console.log("Product Created Successfully:", newProduct);
        return { success: true, message: "Product created successfully!", data: newProduct };
    } catch (error) {
        console.error("Error in addProductAction:", error);
        return { success: false, message: "Failed to create product. Internal Server Error." };
    }
}