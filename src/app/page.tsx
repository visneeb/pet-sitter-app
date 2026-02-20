import { ActionButton, NavigationButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Navbar from "@/components/common/nav-bar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex gap-4"></main>
      </div>
    </>
  );
}
