"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";
import { Icon } from "@iconify/react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState(() => searchParams.get("q") || "");

  const debouncedUpdateUrl = useMemo(() =>
    debounce((value: string) => {
      const params = new URLSearchParams([...searchParams.entries()]);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`/?${params.toString()}`);
    }, 500)
    , [router, searchParams]);

  useEffect(() => {
    return () => {
      debouncedUpdateUrl.cancel();
    };
  }, [debouncedUpdateUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    debouncedUpdateUrl(value);
  };

  return (
    <div className="relative w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
        <Icon icon="icon-park-outline:search" className="w-5 h-5" />
      </span>
      <input
        type="search"
        placeholder="Search articles..."
        className="w-full pl-12 pr-4 py-2 border border-neutral-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all text-base"
        value={input}
        onChange={handleChange}
      />
    </div>
  );
} 