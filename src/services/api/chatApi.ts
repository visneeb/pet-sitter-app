import { privateApi } from "./client";

export type ConversationResponse = {
  conversationId: string;
  ownerUserId: string;
  petSitterId: number;
};

export type ConversationListItemResponse = {
  conversationId: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type MessageResponse = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export const chatApi = {
  findOrCreateConversation: (sitterId: number): Promise<ConversationResponse> =>
    privateApi
      .post("/chat/conversations/find-or-create", { sitterId })
      .then((res) => res.data),

  getConversations: (): Promise<{ conversations: ConversationListItemResponse[] }> =>
    privateApi.get("/chat/conversations").then((res) => res.data),

  getConversationById: (conversationId: string): Promise<ConversationResponse> =>
    privateApi
      .get(`/chat/conversations/${conversationId}`)
      .then((res) => res.data),
  
  getConversationMessages: (conversationId: string): Promise<{ messages: MessageResponse[] }> =>
    privateApi
      .get(`/chat/conversations/${conversationId}/messages`)
      .then((res) => res.data),
};
