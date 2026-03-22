import { io, Socket } from "socket.io-client";

export interface SendMessagePayload {
  conversationId: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface MessageReadEvent {
  conversationId: string;
  messageId: string;
  userId: string;
  readAt: string;
}

type SocketAck<T = undefined> = {
  ok: boolean;
  data?: T;
  error?: string;
};

class ChatService {
  private socket: Socket | null = null;
  /** Keep joined rooms for reconnect. */
  private joinedConversationIds = new Set<string>();
  /** Queue latest read marker per conversation while socket is disconnected. */
  private pendingReadMarkers = new Map<string, string>();

  private flushPendingReadMarkers() {
    if (!this.socket || !this.socket.connected) return;

    for (const [
      conversationId,
      messageId,
    ] of this.pendingReadMarkers.entries()) {
      this.emitMarkAsRead(conversationId, messageId);
    }
    this.pendingReadMarkers.clear();
  }

  private emitMarkAsRead(conversationId: string, messageId: string) {
    if (!this.socket || !this.socket.connected) return;

    this.socket.emit(
      "mark-as-read",
      { conversationId, messageId },
      (response: SocketAck) => {
        if (!response?.ok) {
          console.warn("Failed to mark message as read:", response?.error);
        }
      },
    );
  }

  connect() {
    if (this.socket) {
      if (this.socket.disconnected) {
        this.socket.connect();
      }
      return this.socket;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    this.socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
      {
        auth: { token: token ?? undefined },
        withCredentials: true,
        transports: ["websocket"],
      },
    );

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
      for (const conversationId of this.joinedConversationIds) {
        this.socket?.emit("join-conversation", {
          conversationId,
        });
      }
      this.flushPendingReadMarkers();
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
    const alreadyJoined = this.joinedConversationIds.has(conversationId);
    this.joinedConversationIds.add(conversationId);
    if (!this.socket) return;
    if (this.socket.connected && !alreadyJoined) {
      this.socket.emit("join-conversation", { conversationId });
    }
  }

  sendMessage(payload: SendMessagePayload) {
    if (!this.socket) return;
    this.socket.emit("send-message", payload);
  }

  markAsRead(conversationId: string, messageId: string) {
    this.pendingReadMarkers.set(conversationId, messageId);
    const socket = this.connect();
    if (!socket || !socket.connected) return;

    this.emitMarkAsRead(conversationId, messageId);
    this.pendingReadMarkers.delete(conversationId);
  }

  onNewMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;
    this.socket.on("new-message", callback);
  }

  offNewMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) return;

    this.socket.off("new-message", callback);
  }

  onMessageRead(callback: (payload: MessageReadEvent) => void) {
    if (!this.socket) return;
    this.socket.on("message-read", callback);
  }

  offMessageRead(callback: (payload: MessageReadEvent) => void) {
    if (!this.socket) return;
    this.socket.off("message-read", callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.joinedConversationIds.clear();
    this.pendingReadMarkers.clear();
  }
}

const chatService = new ChatService();
export default chatService;
