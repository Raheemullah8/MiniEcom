// services/productService.ts

import axios from 'axios';

// Product data type jo API ko bheji jayegi
interface ProductPayload {
  title: string;
  price: number;
  description: string;
  imageUrl: string; // <-- Ab imageUrl hai, imageBase64 nahi
}

// Product data type jo API se wapas aayegi
interface ProductResponse {
  message: string;
  data: {
    id: number;
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    createdAt: string;
  };
}

/**
 * Naya product create karne ke liye API call.
 * @param payload Product details, including the already uploaded image URL.
 * @returns Server se aaya hua response data.
 * @throws AxiosError agar API call fail hoti hai.
 */
export async function createProduct(payload: ProductPayload): Promise<ProductResponse> {
  try {
    const response = await axios.post<ProductResponse>('/api/products', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating product:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to create product via API.");
    } else {
      console.error("An unexpected error occurred during product creation:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
}