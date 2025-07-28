// app/add-product/page.tsx
"use client";

import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadImageService } from "@/service/imageService";
import { createProduct } from "@/service/productService";
import { on } from "events";
 
interface FormData {
  title: string;
  price: number;
  description: string;
  image: FileList;
}

export default function AddProductForm() {
  const [success,setSuccess] = useState(false); 
  const [message, setMessage] = useState("");

const {
  register,
  handleSubmit,
  formState:{errors,isSubmitting},
  reset
} = useForm<FormData>()

const onSubmit = async (data: FormData) => {

  setMessage("");
  setSuccess(false);
  const imageFile = data.image?.[0];
  if (!imageFile) {
    setMessage("Please select an image file.");
    return;
  }
  let imageUrl: string = "";
  try {
    setMessage("Uploading image...");
    imageUrl = await uploadImageService(imageFile);
    setMessage("Image uploaded successfully.");
    setSuccess(true);

    
  } catch (error:any) {
    console.error("Image upload failed:", error);
    setMessage(`Image upload failed: ${error.message}`);
    setSuccess(false);
    return;
  }
  try {
    setMessage("Creating product...");
    const payload = {
      title: data.title,
      price: data.price,
      description: data.description,
      imageUrl: imageUrl, // Use the uploaded image URL
    };

    const response = await createProduct(payload);
    setMessage("Product created successfully!");
    setSuccess(true);
    console.log("Product created:", response.data);
    
  } catch (error:any) {
    console.error("Product creation failed:", error);
    setMessage(`Product creation failed: ${error.message}`);
    setSuccess(false);    
  }
  
  reset(); // Reset the form after submission

}


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
        {/* {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>} */}
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