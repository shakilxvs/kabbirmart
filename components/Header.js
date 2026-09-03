"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { getAllCategories } from "@/lib/categories";

export default function Header() {
  const { itemCount, ready } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

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
          {categories.slice(0, 5).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
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
        <div className="fixed inset-0 z-[100] sm:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 flex w-[78%] max-w-xs flex-col bg-bone p-6 shadow-2xl"
            style={{ backgroundColor: "#FAFAF7" }}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl font-medium text-ink">Menu</span>
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-1 text-ink">
                <X size={22} strokeWidth={1.75} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 overflow-y-auto">
              <Link href="/" className="rounded-lg px-2 py-3 text-[15px] text-ink">
                Home
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
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
