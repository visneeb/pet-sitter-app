import { API_BASE_URL } from "./client";
import type { Pet } from "@/types/pet";

const PETS_ENDPOINT = "/pets";

/**
 * Fetch pets list.
 * Uses Next.js API route (/api/pets) when no backend. When backend is ready,
 * change PETS_URL to `${API_BASE_URL}${PETS_ENDPOINT}`.
 */
const PETS_URL =
  typeof window !== "undefined" ? "/api/pets" : `${API_BASE_URL}${PETS_ENDPOINT}`;

export async function fetchPets(): Promise<Pet[]> {
  const response = await fetch(PETS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch pets: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.pets ?? [];
}
