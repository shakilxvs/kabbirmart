"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/utils";

export default function ProductDetailClient({ product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  const outOfStock =
    product.available === false || product.stock <= 0;

  const maxQty = Math.max(
    1,
    Math.min(product.stock || 1, 10)
  );

  function trackAddToCart() {
    if (typeof window !== "undefined" && window.fbq) {
      const productPrice =
        hasDiscount ? product.discountPrice : product.price;

      window.fbq("track", "AddToCart", {
        content_ids: [String(product.id || product.slug || product.name)],
        content_name: product.name,
        content_type: "product",
        value: productPrice * qty,
        currency: "BDT",
        num_items: qty,
      });
    }
  }

  function handleAddToCart() {
    addItem(product, qty);
    trackAddToCart();

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  function handleBuyNow() {
    addItem(product, qty);
    trackAddToCart();
    router.push("/checkout");
  }

  return (
    <div>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="text-[22px] font-medium text-ink">
          {formatBDT(
            hasDiscount ? product.discountPrice : product.price
          )}
        </span>

        {hasDiscount && (
          <span className="text-[15px] text-ink-soft/70 line-through">
            {formatBDT(product.price)}
          </span>
        )}
      </div>

      <p className="mt-2 text-[13px]">
        {outOfStock ? (
          <span className="font-medium text-clay">
            Out of stock
          </span>
        ) : product.stock <= 5 ? (
          <span className="font-medium text-clay">
            Only {product.stock} left in stock
          </span>
        ) : (
          <span className="font-medium text-moss">
            In stock
          </span>
        )}
      </p>

      <p className="mt-5 max-w-md text-[14px] leading-relaxed text-ink-soft">
        {product.description}
      </p>

      {!outOfStock && (
        <>
          <div className="mt-7">
            <p className="label-field">Quantity</p>

            <div className="inline-flex items-center rounded-full border border-line">
              <button
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center text-ink disabled:opacity-30"
                onClick={() =>
                  setQty((q) => Math.max(1, q - 1))
                }
                disabled={qty <= 1}
              >
                <Minus size={16} />
              </button>

              <span className="w-8 text-center text-[15px] font-medium">
                {qty}
              </span>

              <button
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center text-ink disabled:opacity-30"
                onClick={() =>
                  setQty((q) => Math.min(maxQty, q + 1))
                }
                disabled={qty >= maxQty}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="btn-secondary flex-1"
            >
              {added ? (
                <Check size={16} />
              ) : (
                <ShoppingBag
                  size={16}
                  strokeWidth={1.75}
                />
              )}

              {added
                ? "Added to cart"
                : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              className="btn-primary flex-1"
            >
              <Zap
                size={16}
                strokeWidth={1.75}
              />
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}
