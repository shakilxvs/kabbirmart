"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/utils";

export default function CartPage() {
  const { items, ready, removeItem, updateQty, subtotal } = useCart();

  if (ready && items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag size={36} strokeWidth={1.25} className="text-ink-soft/50" />
        <p className="mt-5 font-display text-[22px] text-ink">Your cart is empty</p>
        <p className="mt-1.5 text-[14px] text-ink-soft">Find something worth adding.</p>
        <Link href="/" className="btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="font-display text-[28px] font-medium tracking-tight text-ink sm:text-[32px]">
        Your Cart
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,360px]">
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-line/40 sm:h-28 sm:w-24">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="120px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/product/${item.slug}`} className="text-[14px] leading-snug text-ink">
                    {item.name}
                  </Link>
                  <button
                    aria-label="Remove item"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 p-1 text-ink-soft transition-colors hover:text-clay"
                  >
                    <X size={17} strokeWidth={1.75} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full border border-line">
                    <button
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center text-[13px] font-medium">{item.qty}</span>
                    <button
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center disabled:opacity-30"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      disabled={item.qty >= (item.stock || 10)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-[14px] font-medium text-ink">
                    {formatBDT(item.price * item.qty)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-line bg-surface p-6">
          <p className="text-[15px] font-medium text-ink">Order Summary</p>
          <div className="mt-4 flex justify-between text-[14px] text-ink-soft">
            <span>Subtotal</span>
            <span className="text-ink">{formatBDT(subtotal)}</span>
          </div>
          <p className="mt-2 text-[12.5px] text-ink-soft">
            Delivery charge is calculated at checkout based on your location.
          </p>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Checkout
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
