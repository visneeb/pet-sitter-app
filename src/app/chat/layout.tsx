import Navbar from "@/components/common/nav-bar/Navbar";
import ChatLayoutClient from "../../components/chat/ChatLayoutClient";

export default function PetSitterLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ChatLayoutClient />
      </main>
    </div>
  );
}
