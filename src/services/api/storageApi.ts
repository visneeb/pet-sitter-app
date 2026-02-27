import { privateApi } from "./client";

// TODO: Wait for backend to implement Supabase upload endpoints
// These functions should call backend API endpoints that handle Supabase Storage

// Pet image uploads (stored in pet-assets bucket under user_id folder)
export async function uploadPetImage(
  file: File,
  userId: string,
): Promise<{ publicUrl?: string; error?: string }> {
  // TODO: Call backend endpoint like POST /upload/pet
  // Backend should handle Supabase Storage upload to pet-assets/{userId}/

  // Temporary placeholder until backend implements upload
  return {
    error: "Pet image upload not implemented yet - waiting for backend",
  };
}

export async function deletePetImage(
  publicUrl: string,
  userId: string,
): Promise<{ success?: boolean; error?: string }> {
  // TODO: Call backend endpoint like DELETE /upload/pet
  // Backend should handle Supabase Storage deletion from pet-assets/{userId}/
  
  // Temporary placeholder until backend implements upload
  return { success: true };
}

// Sitter image uploads (stored in sitter-assets bucket, no folder)
export async function uploadSitterImage(
  file: File,
  sitterId: string,
): Promise<{ publicUrl?: string; error?: string }> {
  // TODO: Call backend endpoint like POST /upload/sitter
  // Backend should handle Supabase Storage upload to sitter-assets/
  
  // Temporary placeholder until backend implements upload
  return { error: "Sitter image upload not implemented yet - waiting for backend" };
}

export async function deleteSitterImage(
  publicUrl: string,
  sitterId: string,
): Promise<{ success?: boolean; error?: string }> {
  // TODO: Call backend endpoint like DELETE /upload/sitter
  // Backend should handle Supabase Storage deletion from sitter-assets/
  
  // Temporary placeholder until backend implements upload
  return { success: true };
}
