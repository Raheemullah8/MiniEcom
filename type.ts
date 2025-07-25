// types/product.ts
export interface IProductInput {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface IProduct extends IProductInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}