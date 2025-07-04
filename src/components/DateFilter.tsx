"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function DateFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const date = searchParams.get("date") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams([...searchParams.entries()]);
    if (e.target.value) {
      params.set("date", e.target.value);
    } else {
      params.delete("date");
    }
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <input
      type="date"
      className="w-full md:w-auto px-4 py-2 border-2 border-neutral-300 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all text-base min-w-[150px]"
      value={date}
      onChange={handleChange}
    />
  );
} 