import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Dummy product (normally yeh DB se aayega)
  const product = {
    id,
    title: "Dummy Title",
    price: 1234,
    desc: "Dummy Description",
    imageUrl: "https://res.cloudinary.com/dmn5oyuzx/image/upload/v1753210169/products/zipz2rppfqvhiorgofzs.jpg",
  };

  // Yeh check filhal zarurat nahi, because dummy hamesha exist karega
  if (!product) return notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* 🔙 Back to Dashboard Button */}
      <div className="mb-4">
        <Link href="/dashboard">
          <button className="text-sm text-blue-600 hover:underline">&larr; Back to Dashboard</button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Edit Product - {product.title}</h1>

      <form className="space-y-4 bg-white dark:bg-zinc-900 rounded-lg p-6 shadow">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input type="text" defaultValue={product.title} className="w-full p-2 rounded border" />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input type="number" defaultValue={product.price} className="w-full p-2 rounded border" />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea defaultValue={product.desc} className="w-full p-2 rounded border" />
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <img src={product.imageUrl} alt={product.title} className="w-40 h-40 object-cover rounded mb-2" />
          <input type="file" accept="image/*" className="w-full" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
}
