"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Package,
  ClipboardList,
  Settings,
  Image as ImageIcon,
  LogOut,
  Tag,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/homepage", label: "Homepage", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ title, children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[13px] text-ink-soft">Loading...</p>
      </div>
    );
  }

  function isActive(href) {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-line bg-surface sm:flex sm:flex-col">
        <div className="px-6 py-6">
          <p className="font-display text-[20px] font-medium text-ink">KabbirMart</p>
          <p className="text-[12px] text-ink-soft">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-colors ${
                isActive(href) ? "bg-moss-light text-moss-dark" : "text-ink-soft hover:bg-line/40"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => logout()}
          className="mx-3 mb-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-ink-soft hover:bg-line/40"
        >
          <LogOut size={17} strokeWidth={1.75} />
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 pb-20 sm:pb-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bone/90 px-5 backdrop-blur sm:h-16 sm:px-8">
          <h1 className="text-[16px] font-medium text-ink sm:text-[18px]">{title}</h1>
          <button
            onClick={() => logout()}
            className="p-1.5 text-ink-soft sm:hidden"
            aria-label="Sign out"
          >
            <LogOut size={19} strokeWidth={1.75} />
          </button>
        </header>
        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface/95 backdrop-blur sm:hidden">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 px-1 py-2.5 text-[9.5px] leading-tight ${
              isActive(href) ? "text-moss" : "text-ink-soft"
            }`}
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
