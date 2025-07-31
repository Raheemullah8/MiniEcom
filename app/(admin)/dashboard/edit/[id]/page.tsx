"use client"; // Required for hooks

import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { singleProduct, updateProduct } from "@/service/productService";
import { fileToBase64 } from "@/lib/fileUtils";


type ProductFormData = {
  title: string;
  price: number;
  description: string;
  imageFile?: File;
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>();

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await singleProduct(Number(id));
        setProduct(data);
        setValue("title", data.title);
        setValue("price", data.price);
        setValue("description", data.description);
        setPreviewImage(data.imageUrl);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("imageFile", file);
      const preview = URL.createObjectURL(file);
      setPreviewImage(preview);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      let imageBase64 = product.imageUrl; // Default to existing image

      // Convert new image to base64 if uploaded
      if (data.imageFile) {
        imageBase64 = await fileToBase64(data.imageFile);
      }

      const payload = {
        title: data.title,
        price: data.price,
        description: data.description,
        imageBase64,
      };

      await updateProduct(Number(id), payload);
      alert("Product updated successfully!");
      // Optionally redirect or refresh data
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!product) return notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard">
          <Button variant="link" className="p-0 text-sm">&larr; Back to Dashboard</Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Edit Product - {product.title}</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              {previewImage && (
                <Image
                  src={previewImage}
                  alt={product.title}
                  width={160}
                  height={160}
                  className="w-40 h-40 object-cover rounded-md border mb-2"
                />
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}