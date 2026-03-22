import { ImageIcon } from "@/assets/icons/components";
import { MessageIcon } from "@/assets/icons/components";
function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-md animate-pulse bg-gray-200 ${className ?? ""}`}
    />
  );
}

export default function ChatPageSkeleton() {
  return (
    <main className="mx-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <section className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden bg-white">
        {/* Sidebar skeleton */}
        <aside className="flex min-h-0 w-[300px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-black">
          <div className="shrink-0 border-b border-white/10 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Messages</h2>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-hidden p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg px-3 py-3"
              >
                <Bone className="h-12 w-12 shrink-0 rounded-full bg-white/20" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Bone className="h-4 w-3/4 rounded bg-white/20" />
                  <Bone className="h-3 w-full rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main chat area skeleton */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
          {/* Header */}
          <header className="flex h-24 items-center gap-3 bg-gray-100 px-10 py-6">
            <Bone className="h-12 w-12 shrink-0 rounded-full" />
            <Bone className="h-6 w-32" />
          </header>

          {/* Message area */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-6 py-4">
            <div className="flex justify-start">
              <Bone className="h-12 w-48 rounded-2xl rounded-bl-sm" />
            </div>
            <div className="flex justify-end">
              <Bone className="h-12 w-40 rounded-2xl rounded-br-sm" />
            </div>
            <div className="flex justify-start">
              <Bone className="h-10 w-36 rounded-2xl rounded-bl-sm" />
            </div>
          </div>

          {/* Input area */}
          <div className="flex min-h-[100px] items-end justify-center border-t border-gray-200 px-10 py-6 gap-3">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-gray-400 bg-gray-100 transition hover:cursor-pointer hover:text-gray-600">
              <ImageIcon />
            </div>

            <textarea
              placeholder="Message here..."
              rows={1}
              className="min-h-10 flex-1 resize-none overflow-y-hidden style-body-2 px-4 py-2.5 outline-none placeholder:text-gray-400 focus:border-orange-400 max-h-50"
            />

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600">
              <MessageIcon />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
