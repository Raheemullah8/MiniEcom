// lib/cloudinary.ts
// Make sure this file is only imported/used on the server-side (like in API Routes).

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a Base64 encoded image string to Cloudinary.
 * @param base64Image The Base64 string of the image (e.g., "data:image/jpeg;base64,...").
 * @returns The secure URL of the uploaded image.
 */
export async function uploadImage(base64Image: string): Promise<string> {
  try {
    const res = await cloudinary.uploader.upload(base64Image, {
      folder: "products", // You can change the folder name in Cloudinary
    });
    return res.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}