"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { CATEGORIES } from "@/lib/data";

export default function Header() {
  const { itemCount, ready } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bone/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <button
          className="-ml-2 rounded-full p-2 sm:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>

        <Link
          href="/"
          className="font-display text-[22px] font-medium tracking-tight text-ink sm:text-[26px]"
        >
          KabbirMart
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {CATEGORIES.slice(0, 5).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="text-[14px] text-ink-soft transition-colors hover:text-ink"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          aria-label="View cart"
          className="relative -mr-2 rounded-full p-2"
        >
          <ShoppingBag size={22} strokeWidth={1.75} />
          {ready && itemCount > 0 && (
            <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-moss px-1 text-[10px] font-semibold leading-none text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[78%] max-w-xs animate-slide-in bg-bone p-6 [animation-duration:200ms] [transform:translateX(0)]">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl font-medium">Menu</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-1">
                <X size={22} strokeWidth={1.75} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <Link href="/" className="rounded-lg px-2 py-3 text-[15px] text-ink">
                Home
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  className="rounded-lg px-2 py-3 text-[15px] text-ink"
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
