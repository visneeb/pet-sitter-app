import { io, Socket } from "socket.io-client";

export interface SendMessagePayload {
  conversationId: string;
  senderId: number;
  text: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: number;
  text: string;
  createdAt: string;
}

class ChatService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return this.socket;

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    this.socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
      auth: { token: token ?? undefined },
      withCredentials: true,
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  joinConversation(conversationId: string) {
    if (!this.socket) return;
    this.socket.emit("join-conversation", conversationId);
  }

  leaveConversation(conversationId: string) {
    if (!this.socket) return;
    this.socket.emit("leave-conversation", conversationId);
  }

  sendMessage(payload: SendMessagePayload) {
    if (!this.socket) return;
    this.socket.emit("send-message", payload);
  }

  onNewMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;

    this.socket.on("new-message", callback);
  }

  offNewMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;

    this.socket.off("new-message", callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

const chatService = new ChatService();
export default chatService;