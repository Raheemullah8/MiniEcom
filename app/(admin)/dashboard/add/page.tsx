"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/service/productService";
import { fileToBase64 } from "@/lib/fileUtils";


interface FormData {
  title: string;
  price: number;
  description: string;
  image: FileList;
}

export default function AddProductForm() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setMessage("");
    setSuccess(false);

    const imageFile = data.image?.[0];
    if (!imageFile) {
      setMessage("Image is required.");
      return;
    }

    try {
      const imageBase64 = await fileToBase64(imageFile);
      const payload = {
        title: data.title,
        price: data.price,
        description: data.description,
        imageBase64,
      };
      
      const res = await createProduct(payload);
      setSuccess(true);
      setMessage(res.message);
      reset();
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto space-y-5 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow"
    >
      <h2 className="text-xl font-bold text-center">Add Product</h2>

      <div>
        <Label>Title</Label>
        <Input {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <Label>Price</Label>
        <Input type="number" {...register("price", { required: "Price is required", valueAsNumber: true })} />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register("description", { required: "Description is required" })} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Label>Image</Label>
        <Input type="file" accept="image/*" {...register("image", { required: "Image is required" })} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Add Product"}
      </Button>

      {message && (
        <p className={`text-center ${success ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </form>
  );
}