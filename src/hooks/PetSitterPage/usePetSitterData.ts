import { useState, useEffect } from "react";

export interface PetSitter {
  id: number;
  title: string;
  name: string;
  rating: number;
  location: string;
  petTypes: string[];
  image: string;
}

const mockData: PetSitter[] = [
  {
    id: 1,
    title: "Happy House!",
    name: "Jane Maison",
    rating: 5,
    location: "Senanikom, Bangkok",
    petTypes: ["Dog", "Cat", "Rabbit"],
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "We love cat and your cat",
    name: "Cat Lover",
    rating: 4,
    location: "Senanikom, Bangkok",
    petTypes: ["Cat"],
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Gentle >< for all pet! (Kid friendly)",
    name: "Umai",
    rating: 5,
    location: "Senanikom, Bangkok",
    petTypes: ["Dog", "Cat", "Bird", "Rabbit"],
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Happy energetic pup",
    name: "Nanny Black",
    rating: 3,
    location: "Senanikom, Bangkok",
    petTypes: ["Dog"],
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Cat Mom",
    name: "Mother of Cat",
    rating: 4,
    location: "Senanikom, Bangkok",
    petTypes: ["Dog", "Cat", "Rabbit"],
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export function usePetSitterData() {
  const [data, setData] = useState<PetSitter[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      try {
        // In a real app, this would be a fetch call to your API
        // const response = await fetch("/api/pet-sitters");
        // const result = await response.json();

        // Simulating delay for realistic feel
        await new Promise((resolve) => setTimeout(resolve, 200));

        setData(mockData);
      } catch (error) {
        console.error("Failed to fetch pet sitter data", error);
      }
    };

    fetchData();
  }, []);

  return data;
}
