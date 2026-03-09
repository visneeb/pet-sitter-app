"use client";

import { useEffect } from "react";

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[300px] flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">เกิดข้อผิดพลาด</h1>
      <p className="text-gray-600">โปรดลองใหม่อีกครั้ง</p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
      >
        ลองใหม่
      </button>
    </section>
  );
}