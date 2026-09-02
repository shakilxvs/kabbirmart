"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, ShieldCheck, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-line/70 bg-surface">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <Truck size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-moss" />
          <div>
            <p className="text-[14px] font-medium text-ink">Cash on Delivery</p>
            <p className="mt-1 text-[13px] text-ink-soft">Pay when it arrives, anywhere in Bangladesh.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-moss" />
          <div>
            <p className="text-[14px] font-medium text-ink">Checked before dispatch</p>
            <p className="mt-1 text-[13px] text-ink-soft">Every order is packed and tested by hand.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-moss" />
          <div>
            <p className="text-[14px] font-medium text-ink">Reach us anytime</p>
            <p className="mt-1 text-[13px] text-ink-soft">hello@kabbirmart.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="font-display text-[15px] text-ink">KabbirMart</p>
          <p className="text-[12px] text-ink-soft">
            © {new Date().getFullYear()} KabbirMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
