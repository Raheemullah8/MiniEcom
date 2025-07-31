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
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Loading from "./loading";
import NotFound from "@/app/not-found";
import { deleteProduct, getProducts } from "@/service/productService";
// getProducts aur deleteProduct dono ko import karein


interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  // createdAt: string; // Agar API se aa raha hai, to isko add kar dein
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allProductsRef = useRef<IProduct[]>([]); // Original, unfiltered products store karne ke liye

  // Products fetch karne ka function, jise dobara use kiya ja sake
  const fetchAndSetProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // getProducts ab React.cache se wrapped hai (service/productService.ts mein)
      const response = await getProducts(); // Yeh call memoized ho sakti hai
      allProductsRef.current = response; // allProductsRef mein poori list store karein
      setProducts(response); // products state ko bhi update karein
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []); // useCallback empty dependency array ke saath, taake sirf ek baar bane

  // Component mount hone par products fetch karein
  useEffect(() => {
    fetchAndSetProducts();
  }, [fetchAndSetProducts]); // fetchAndSetProducts dependency mein rakha hai (kyunki woh useCallback hai)

  // Search term change hone par products ko filter karein
  useEffect(() => {
    if (search) {
      const filtered = allProductsRef.current.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(filtered);
    } else {
      setProducts(allProductsRef.current); // Agar search bar khali hai to poori list dikhao
    }
  }, [search]);

  // Product delete karne ka handler
  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Do you really want to delete "${title}"?`)) { 
      try {
        await deleteProduct(id);
        alert("Product  delete  successfully!");
        
        await fetchAndSetProducts(); 
      } catch (error:any) {
        console.error("Product delete karne mein masla hua:", error);
        alert(`Product delete nahi ho saka: ${error?.message}`); 
      
      }
    }
  };

  // --- Early Returns for Loading and Error States ---
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-lg font-medium text-red-600">
        Products load karne mein masla hua: {error}
      </div>
    );
  }

  // Agar initially koi products nahi mile (ya filter ke baad koi product nahi)
  if (allProductsRef.current.length === 0 && !loading && !error) {
    return <NotFound />;
  }

  return (
    <div className="p-6">
      <Searchbar search={search} setSearch={setSearch} />

      {/* Conditionally display message or product grid */}
      {products.length === 0 && search.length > 0 ? (
        // Search query ke liye koi products nahi mile
        <div className="text-center text-lg font-medium mt-4">
          Koi product nahi mila "{search}" ke liye.
        </div>
      ) : (
        // Products ka grid display karein
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={product.imageUrl}
                  placeholder="blur"
                  blurDataURL={product.imageUrl}
                  loading="lazy"
                  width={500}
                  height={500}
                  alt={product.title}
                  style={{ borderRadius: "10%" }}
                />
                <div className="py-5">
                  <p className="text-sm font-medium">Rs. {product.price}</p>
                  <p className="text-sm font-medium">{product.description}</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-between">
                  <Link href={`/dashboard/edit/${product?.id}`}>
                    <Button className="bg-blue-600 text-white">Edit</Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(product.id, product.title)} // Product title bhi pass kiya
                    className="bg-red-600 text-white"
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