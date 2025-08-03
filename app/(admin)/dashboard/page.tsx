// app/dashboard/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Searchbar from "@/components/Searchbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "./loading";
import NotFound from "@/app/not-found";
import { deleteProduct, getProducts } from "@/service/productService";
import { toast } from "sonner";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getProducts();
      setAllProducts(data);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Load products when component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products when search changes
  useEffect(() => {
    if (search.trim()) {
      const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(filtered);
    } else {
      setProducts(allProducts);
    }
  }, [search, allProducts]);

  // Delete product
  const handleDelete = async (id: number, title: string) => {
    const confirmDelete = confirm(`Delete "${title}"?`);
    
    if (confirmDelete) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully!");
        await loadProducts(); // Reload products
      } catch (error: any) {
        toast.error(`Delete failed: ${error.message}`);
      }
    }
  };

  // Show loading state
  if (loading) return <Loading />;

  // Show error state
  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  // Show no products found
  if (allProducts.length === 0) return <NotFound />;

  return (
    <div className="p-6">
      <Searchbar search={search} setSearch={setSearch} />

      {/* Show message if no search results */}
      {products.length === 0 && search && (
        <div className="text-center mt-4 text-gray-600">
          No products found for "{search}"
        </div>
      )}

      {/* Show products */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products.slice().reverse().map((product) => (
            <Card key={product.id} className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold truncate">
                  {product.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.imageUrl}
                    fill
                    alt={product.title}
                    className="rounded-lg object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-lg mb-2">Rs. {product.price}</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                </div>
              </CardContent>
              
              <CardFooter className="pt-4">
                <div className="flex justify-between gap-2 w-full">
                  <Link href={`/dashboard/edit/${product.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(product.id, product.title)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}