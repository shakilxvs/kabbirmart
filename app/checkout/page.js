"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/utils";
import { getStoreSettings } from "@/lib/settings";
import { createOrder } from "@/lib/orders";
import { BD_DIVISIONS, DEFAULT_SETTINGS } from "@/lib/data";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, ready, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    division: "",
    district: "",
    area: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getStoreSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    if (ready && items.length === 0 && !submitting) {
      router.replace("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, items.length]);

  const deliveryCharge = useMemo(() => {
    if (form.division === "Dhaka") return settings.deliveryChargeDhaka ?? settings.deliveryCharge;
    return settings.deliveryCharge;
  }, [form.division, settings]);

  const codCharge = settings.codCharge || 0;
  const total = subtotal + deliveryCharge + codCharge;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value, ...(field === "division" ? { district: "" } : {}) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.address || !form.division || !form.district) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^0?1[0-9]{9}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      setError("Please enter a valid Bangladeshi mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          image: i.image,
        })),
        customer: form,
        subtotal,
        deliveryCharge,
        codCharge,
      });
      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      setError("Something went wrong placing your order. Please try again.");
      setSubmitting(false);
    }
  }

  if (!ready || items.length === 0) return null;

  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="font-display text-[28px] font-medium tracking-tight text-ink sm:text-[32px]">
        Checkout
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,380px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-field" htmlFor="name">Full name *</label>
            <input
              id="name"
              className="input-field"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="phone">Mobile number *</label>
            <input
              id="phone"
              className="input-field"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="01XXXXXXXXX"
              inputMode="numeric"
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="address">Address *</label>
            <textarea
              id="address"
              className="input-field min-h-[88px] resize-none"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="House, road, area details"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field" htmlFor="division">Division *</label>
              <select
                id="division"
                className="input-field"
                value={form.division}
                onChange={(e) => update("division", e.target.value)}
                required
              >
                <option value="">Select</option>
                {Object.keys(BD_DIVISIONS).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field" htmlFor="district">District *</label>
              <select
                id="district"
                className="input-field"
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                required
                disabled={!form.division}
              >
                <option value="">Select</option>
                {(BD_DIVISIONS[form.division] || []).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-field" htmlFor="area">Area / Upazila</label>
            <input
              id="area"
              className="input-field"
              value={form.area}
              onChange={(e) => update("area", e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="label-field" htmlFor="note">Order note</label>
            <textarea
              id="note"
              className="input-field min-h-[70px] resize-none"
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="Optional — delivery instructions, etc."
            />
          </div>

          {error && <p className="text-[13px] text-clay">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Placing order..." : `Place Order — ${formatBDT(total)}`}
          </button>
        </form>

        <div className="h-fit space-y-5 rounded-2xl border border-line bg-surface p-6">
          <p className="text-[15px] font-medium text-ink">Order Summary</p>

          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-2 text-[13px]">
                <ShoppingBag size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 text-ink-soft" />
                <span className="flex-1 text-ink-soft">
                  {item.name} <span className="text-ink">× {item.qty}</span>
                </span>
                <span className="text-ink">{formatBDT(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-line pt-4 text-[13px]">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="text-ink">{formatBDT(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Delivery charge</span>
              <span className="text-ink">{formatBDT(deliveryCharge)}</span>
            </div>
            {codCharge > 0 && (
              <div className="flex justify-between text-ink-soft">
                <span>COD charge</span>
                <span className="text-ink">{formatBDT(codCharge)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between border-t border-line pt-4 text-[15px] font-medium text-ink">
            <span>Total</span>
            <span>{formatBDT(total)}</span>
          </div>

          <p className="rounded-xl bg-moss-light px-3 py-2.5 text-[12.5px] text-moss-dark">
            Payment method: Cash on Delivery
          </p>
        </div>
      </div>
    </div>
  );
}
