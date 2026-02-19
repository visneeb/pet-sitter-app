import { ActionButton, NavigationButton } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex gap-4">
        <ActionButton variant="primary">Button </ActionButton>
        <NavigationButton variant="primary" href="/">
          Navigation Button
        </NavigationButton>
        <NavigationButton variant="secondary" href="/test">
          Go to Test Page
        </NavigationButton>
      </main>
    </div>
  );
}
