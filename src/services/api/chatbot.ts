import { publicApi } from "./client";
import { ChatbotRequest, ChatbotResponse } from "@/types/chatbot";

export const chatbotApi = {
  async ask(payload: ChatbotRequest): Promise<ChatbotResponse> {
    const response = await publicApi.post<ChatbotResponse>(
      "/chat/ask",
      payload,
    );
    return response.data;
  },
};
