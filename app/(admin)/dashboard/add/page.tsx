// app/add-product/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageService } from "@/service/imageService";
import { createProduct } from "@/service/productService";
 
interface FormData {
  title: string;
  price: number;
  description: string;
  image: FileList;
}

export default function AddProductForm() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  // Removed: const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // <-- isSubmitting ko yahan se extract kiya
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Removed: setIsSubmitting(true); // isSubmitting ab React Hook Form handle kar raha hai
    setMessage("");
    setSuccess(false);

    const imageFile = data.image?.[0];

    // --- Client-Side Validation (Basic) ---
    if (!imageFile) {
      setMessage("Please select an image file.");
      // No need to set isSubmitting to false here, as it will be false
      // until handleSubmit's callback completes.
      return;
    }

    let imageUrl: string = "";

    // --- Step 1: Upload Image via Service ---
    try {
      setMessage("Uploading image...");
      imageUrl = await uploadImageService(imageFile);
      setMessage("Image uploaded successfully, now creating product...");
    } catch (imageUploadError: any) {
      console.error("Image upload failed:", imageUploadError);
      setMessage(imageUploadError.message || "Failed to upload image.");
      setSuccess(false);
      // Removed: setIsSubmitting(false); // React Hook Form handles this
      return; // Stop execution on error
    }

    // --- Step 2: Create Product with the received Image URL via Product Service ---
    try {
      const responseData = await createProduct({
        title: data.title,
        price: Number(data.price),
        description: data.description,
        imageUrl: imageUrl, // Send the URL obtained from image upload
      });

      setMessage(responseData.message || "Product created successfully!");
      setSuccess(true);
      reset(); // Form ko reset kar diya
    } catch (productCreateError: any) {
      console.error("Product creation failed:", productCreateError);
      setMessage(productCreateError.message || "Failed to add product. Please check console.");
      setSuccess(false);
    } finally {
      // Removed: setIsSubmitting(false); // React Hook Form handles this automatically when onSubmit finishes
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md max-w-xl mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-center">Add New Product (Two-Step API)</h2>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Product title"
          {...register("title", { required: "Title is required." })}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="Price"
          {...register("price", {
            required: "Price is required.",
            valueAsNumber: true, // Automatically converts to number
          })}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description..."
          {...register("description", { required: "Description is required." })}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      {/* Image File Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Image Upload</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          {...register("image", { required: "An image file is required." })}
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding Product..." : "Add Product"}
      </Button>

      {/* Display Messages */}
      {message && (
        <p className={`mt-4 ${success ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  );
}