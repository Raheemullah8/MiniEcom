"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { singleProduct, updateProduct } from "@/service/productService";
import { useForm } from "react-hook-form";
import { fileToBase64 } from "@/lib/fileUtils";
import { toast } from "sonner"

import Loading from "../../loading";
import NotFound from "@/app/not-found";
import { useRouter } from "next/navigation";

interface Products {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Products | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Products>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await singleProduct(Number(id));
        if (data) {
          setProduct(data);
          setPreview(data.imageUrl);
          reset({
            title: data.title,
            description: data.description,
            price: data.price,
          });
        }
      } catch (error: unknown) {
        console.error("Error fetching product:", error);
        // Optional: Show error toast
        // toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Products) => {
    try {
      let imageBase64 = product?.imageUrl || "";
      const fileInput = document.getElementById('image') as HTMLInputElement;

      if (fileInput?.files?.[0]) {
        imageBase64 = await fileToBase64(fileInput.files[0]);
      }

      const payload = {
        title: data.title,
        price: Number(data.price),
        description: data.description,
        imageBase64
      };
      
      await updateProduct(Number(id), payload);
      
      // Optional: Show success toast
      // toast.success("Product updated successfully!");
      toast.success("Product Update Successfully!")
      router.push("/dashboard");
      router.refresh();
      
    } catch (error) {
      console.error('Error updating product:', error);
      // Optional: Better error handling
      // toast.error("Failed to update product. Please try again.");
      alert('Failed to update product. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };



  if (loading) return <Loading />;
  if (!product) return <NotFound />;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-4">
        <Link href="/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title"
                {...register("title", { 
                  required: "Title is required",
                  minLength: { value: 3, message: "Title must be at least 3 characters" }
                })} 
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (Rs.)</Label>
              <Input 
                id="price"
                type="number"
                {...register("price", { 
                  required: "Price is required",
                  min: { value: 1, message: "Price must be greater than 0" },
                  max: { value: 10000000, message: "Price is too high" }
                })} 
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                rows={4} 
                {...register("description", { 
                  required: "Description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" }
                })} 
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <Input 
                id="image" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </div>

            {preview && (
              <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                <Image
                  src={preview}
                  alt="Product preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}