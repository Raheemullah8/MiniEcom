import axiosInstance from "@/lib/axiosInstance";

interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  createdAt: string;
}

interface DeleteProductResponse {
  message: string;
}

interface ProductPayload {
  title: string;
  price: number;
  description: string;
  imageBase64: string;
}

interface CreateProductResponse {
  message: string;
  data: IProduct;
}

interface UpdateProductResponse {
  message: string;
  data: IProduct;
}

export async function createProduct(
  payload: ProductPayload
): Promise<CreateProductResponse> {
  try {
    const response = await axiosInstance.post<CreateProductResponse>(
      "/api/products",
      payload
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    throw new Error("Product creation failed.");
  }
}

export const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await axiosInstance.get<{
      message: string;
      data: IProduct[];
    }>("/api/products");
    return response.data.data;
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
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

export async function singleProduct(id: number): Promise<IProduct> {
  try {
    const response = await axiosInstance.get(`/api/products/singleproducts/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw new Error(`Failed to fetch product with ID ${id}.`);
  }
}

export async function updateProduct(
  id: number,
  payload: ProductPayload
): Promise<UpdateProductResponse> {
  try {
    const response = await axiosInstance.patch<UpdateProductResponse>(
      `/api/products/update/${id}`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw new Error(`Failed to update product with ID ${id}.`);
  }
}