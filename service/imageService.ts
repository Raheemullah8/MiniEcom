// services/imageService.ts

import axios from 'axios';

export async function uploadImageService(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post<{ message: string; imageUrl: string }>(
      "/api/upload-image",
      formData,
      {
        headers: {
          // Axios automatically sets 'Content-Type': 'multipart/form-data' for FormData
          // 'Content-Type': 'multipart/form-data' // You can explicitly set it, but Axios usually handles it
        },
      }
    );
    return response.data.imageUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error uploading image:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to upload image via API.");
    } else {
      console.error("An unexpected error occurred during image upload:", error);
      throw new Error("An unexpected error occurred during image upload.");
    }
  }
}