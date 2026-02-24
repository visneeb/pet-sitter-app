import { NextResponse } from "next/server";
import type { Pet } from "@/types/pet";

const MOCK_PETS: Pet[] = [
  {
    id: "1",
    name: "Bubba",
    species: "Dog",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Daisy",
    species: "Dog",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "I Som",
    species: "Cat",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Noodle Birb",
    species: "Bird",
    imageUrl: "",
  },
];

export async function GET() {
  return NextResponse.json(MOCK_PETS);
}
