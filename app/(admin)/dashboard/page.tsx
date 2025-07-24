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
import { useState } from "react";
import Link from "next/link"; // ✅ This is correct now

const dummyProducts = [
  {
    id: 1,
    title: "Cool T-Shirt",
    price: 999,
    desc: "Comfortable and stylish",
    imageUrl:
      "https://res.cloudinary.com/dmn5oyuzx/image/upload/v1753210169/products/zipz2rppfqvhiorgofzs.jpg",
  },
  {
    id: 2,
    title: "Stylish Jeans",
    price: 1499,
    desc: "Perfect fit for daily wear",
    imageUrl:
      "https://res.cloudinary.com/dmn5oyuzx/image/upload/v1753210169/products/zipz2rppfqvhiorgofzs.jpg",
  },
  {
    id: 3,
    title: "Modern Jacket",
    price: 1999,
    desc: "Keep yourself warm in style",
    imageUrl:
      "https://res.cloudinary.com/dmn5oyuzx/image/upload/v1753210169/products/zipz2rppfqvhiorgofzs.jpg",
  },
];

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  const filteredProducts = dummyProducts.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <Searchbar search={search} setSearch={setSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
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
                <p className="text-sm font-medium">{product.desc}</p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full justify-between">
                <Link href={`/dashboard/edit/${product.id}`}>
                  <Button className="bg-blue-600 text-white">Edit</Button>
                </Link>
                <Button className="bg-red-600 text-white">Delete</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
