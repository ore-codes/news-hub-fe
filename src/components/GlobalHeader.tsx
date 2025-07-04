import { Icon } from "@iconify/react";
import Link from "next/link";
import type { FC } from "react";

export const GlobalHeader: FC = () => {
  return (
    <header className="flex justify-between items-center container mx-auto p-4 border-b border-neutral-200">
      <Link href="/" className="hover:opacity-70">
        <h1 className="text-2xl font-bold">News Hub</h1>
      </Link>
      <button className="flex gap-4 items-center rounded bg-neutral-100 border border-neutral-600 px-4 py-2 text-neutral-600 hover:brightness-90 hover:cursor-text">
        <Icon icon="mdi:search" className="size-5" />
        <div className="text-neutral-600">Search</div>
      </button>
    </header>
  )
}
