export type ChatbotConfidence = "High" | "Medium" | "Low";

export interface ChatbotSitter {
  sitterId: string;
  tradeName: string;
  description: string;
}

export interface ChatbotResponse {
  query: string;
  introduction: string;
  petSitters: ChatbotSitter[];
  confidence: ChatbotConfidence;
}

export interface ChatbotRequest {
  query: string;
  topK?: number;
}
