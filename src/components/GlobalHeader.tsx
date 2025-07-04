'use client';

import { Icon } from "@iconify/react";
import Link from "next/link";
import type { FC } from "react";
import { useAuth } from "@/lib/useAuth";
import { useState, useRef, useEffect } from "react";

export const GlobalHeader: FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header className="flex justify-between items-center container mx-auto p-4 border-b border-neutral-200">
      <Link href="/" className="hover:opacity-70">
        <h1 className="text-2xl font-bold">News Hub</h1>
      </Link>
      {user ? (
        <div className="relative" ref={popupRef}>
          <button
            className="flex items-center gap-2 rounded-full bg-neutral-100 border border-neutral-600 p-2 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Profile"
          >
            <Icon icon="icon-park-outline:user" className="w-6 h-6" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 p-4 flex flex-col items-center">
              <div className="bg-neutral-200 rounded-full size-16 grid place-items-center">
                <Icon icon="icon-park-outline:user" className="w-10 h-10 text-neutral-500" />
              </div>
              <button
                onClick={async () => { await logout(); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 self-end hover:bg-neutral-200 transition-colors font-medium"
              >
                <Icon icon="icon-park-outline:logout" className="size-4" />
                <span>Logout</span>
              </button>
              <div className="font-semibold text-lg mb-1">{user.name}</div>
              <div className="text-neutral-500 text-sm mb-4">{user.email}</div>
              <Link
                href="/preferences"
                className="flex items-center gap-2 px-4 py-2 rounded bg-neutral-100 border border-neutral-600 text-neutral-700 self-stretch hover:bg-neutral-200 transition-colors font-medium mb-2"
                onClick={() => setOpen(false)}
              >
                <Icon icon="icon-park-outline:setting" className="w-5 h-5" />
                <span>Preferences</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/signin"
          className="flex gap-2 items-center rounded bg-neutral-100 border border-neutral-600 px-5 py-2 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 transition-colors font-medium"
        >
          <Icon icon="mdi:login" className="size-5" />
          <span>Sign In</span>
        </Link>
      )}
    </header>
  );
};
