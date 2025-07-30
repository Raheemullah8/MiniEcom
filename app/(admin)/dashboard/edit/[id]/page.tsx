import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Dummy product (normally DB se aayega)
  const product = {
    id,
    title: "Dummy Title",
    price: 1234,
    desc: "Dummy Description",
    imageUrl: "https://res.cloudinary.com/dmn5oyuzx/image/upload/v1753210169/products/zipz2rppfqvhiorgofzs.jpg",
  };

  if (!product) return notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* 🔙 Back to Dashboard Button */}
      <div>
        <Link href="/dashboard">
          <Button variant="link" className="p-0 text-sm">&larr; Back to Dashboard</Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Edit Product - {product.title}</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" defaultValue={product.title} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" defaultValue={product.price} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" defaultValue={product.desc} />
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={160}
                height={160}
                className="w-40 h-40 object-cover rounded-md border"
              />
              <Input id="image" type="file" accept="image/*" />
            </div>

            <Button type="submit" className="w-full">Update</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}