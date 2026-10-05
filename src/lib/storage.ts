import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param file - The file object from a file input.
 * @param folder - The folder path (e.g., 'gallery', 'blog', 'ministries').
 * @returns Promise<string> - The public download URL.
 */
export const uploadImage = async (file: File, folder: string): Promise<string> => {
  if (!file) throw new Error("No file provided");

  // Create a unique filename to avoid collisions
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image. Please check your connection and Firebase permissions.");
  }
};
