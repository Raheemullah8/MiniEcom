// service/productService.ts
import axiosInstance from "@/lib/axiosInstance";

interface ProductPayload {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
}

// Product data type jo API se wapas aayegi
interface IProduct {
  // <--- Ye aapka actual product structure hai
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  createdAt: string; // Agar API se aa raha hai
}

// ProductResponse jo API se aati hai jab single product banate hain
interface CreateProductResponse {
  message: string;
  data: IProduct; // <--- single IProduct object
}

// Response type for successful delete operation
interface DeleteProductResponse {
  message: string;
}

export async function createProduct(
  payload: ProductPayload
): Promise<CreateProductResponse> {
  // Changed to CreateProductResponse
  try {
    const response = await axiosInstance.post<CreateProductResponse>(
      "/api/products",
      payload
    );
    return response.data;
  } catch (error: unknown) {
    console.error(
      "An unexpected error occurred during product creation:",
      error
    );
    throw new Error("An unexpected error occurred.");
  }
}


export const getProducts = async (): Promise<IProduct[]> => {
  console.log("Fetching products from API...");
  try {
    
    const response = await axiosInstance.get<{
      message: string;
      data: IProduct[];
    }>("/api/products");
    return response.data.data; // <--- Yahan data.data ko return karein
  } catch (error: unknown) {
    console.error(
      "An unexpected error occurred while fetching products:",
      error
    );
    throw new Error("Failed to load products.");
  }
};

export async function deleteProduct(
  id: number
): Promise<DeleteProductResponse> {
  try {
    const response = await axiosInstance.delete<DeleteProductResponse>(
      `/api/products/delete/${id}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw new Error(`Failed to delete product with ID ${id}.`);
  }
}
