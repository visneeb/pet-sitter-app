import { ActionButton, NavigationButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex gap-4">
        <ActionButton variant="primary">Button </ActionButton>
        <NavigationButton variant="primary" href="/">
          Primary
        </NavigationButton>
        <NavigationButton variant="secondary" href="/test">
          Go to Test Page
        </NavigationButton>

        <Input type="name" placeholder="Place Holder" ></Input>
      </main>
    </div>
  );
}
