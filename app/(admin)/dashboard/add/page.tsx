"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AddProductForm() {
  async function addProduct(prevState: unknown, formData: FormData) {
    const title = formData.get("title")
    const price = formData.get("price")
    const description = formData.get("description")
    const image = formData.get("image")

    console.log({
      title,
      price,
      description,
      image,
    })

    return { message: "Product data logged to console." }
  }

  const [state, formAction, isPending] = useActionState(addProduct, { message: "" })

  return (
    <form action={formAction} className="space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Add Product</h2>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Product title" />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" placeholder="Price" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Description..." />
      </div>

      {/* Image File Upload */}
      <div className="space-y-2">
        <Label htmlFor="image">Image Upload</Label>
        <Input id="image" name="image" type="file" accept="image/*" />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Adding..." : "Add Product"}
      </Button>

      {state.message && <p className="text-green-600 mt-4">{state.message}</p>}
    </form>
  )
}
