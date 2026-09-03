"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/utils";
import { getStoreSettings } from "@/lib/settings";
import { createOrder } from "@/lib/orders";
import { DEFAULT_SETTINGS } from "@/lib/data";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Banknote,
  CheckCircle2,
  MapPin,
  User,
  Phone,
  ClipboardList,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, ready, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryArea: "",
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
  }, [ready, items.length, submitting, router]);

  // Delivery charge
  const deliveryCharge = useMemo(() => {
    if (form.deliveryArea === "ঢাকার ভিতরে") return 80;
    if (form.deliveryArea === "ঢাকার বাহিরে") return 120;
    return 0;
  }, [form.deliveryArea]);

  const codCharge = settings.codCharge || 0;

  const total = subtotal + deliveryCharge + codCharge;

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.deliveryArea
    ) {
      setError("⚠️ দয়া করে প্রয়োজনীয় সব তথ্য পূরণ করুন।");
      return;
    }

    const cleanPhone = form.phone.replace(/[\s-]/g, "");

    if (!/^01[0-9]{9}$/.test(cleanPhone)) {
      setError("⚠️ সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।");
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

        customer: {
          name: form.name,
          phone: cleanPhone,
          address: form.address,
          deliveryArea: form.deliveryArea,
          note: form.note,

          // Existing order structure compatibility
          division: "",
          district: "",
          area: form.address,
          upazila: "",
        },

        subtotal,
        deliveryCharge,
        codCharge,
      });

      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      setError(
        "❌ অর্ডার সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
      setSubmitting(false);
    }
  }

  if (!ready || items.length === 0) return null;

  return (
    <div className="container-page py-6 sm:py-10">

      {/* ================= HEADER ================= */}
      <div className="mx-auto max-w-2xl text-center">

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 shadow-sm">
          <CheckCircle2
            size={28}
            strokeWidth={2.5}
            className="text-emerald-700"
          />
        </div>

        <h1 className="font-display text-[30px] font-bold tracking-tight text-ink sm:text-[36px]">
          অর্ডার কনফার্ম করুন
        </h1>

        <p className="mt-2 text-[14px] font-medium leading-6 text-ink-soft sm:text-[15px]">
          আপনার তথ্য দিয়ে অর্ডারটি সম্পন্ন করুন
        </p>

      </div>

      {/* ================= TRUST CARDS ================= */}
      <div className="mx-auto mt-7 grid max-w-4xl grid-cols-3 gap-2">

        {/* Delivery */}
        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-2 py-4 text-center shadow-sm">

          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-sky-100">
            <Truck
              size={19}
              strokeWidth={2.5}
              className="text-sky-700"
            />
          </div>

          <p className="text-[11px] font-bold text-sky-900 sm:text-[13px]">
            সারা বাংলাদেশে
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-sky-700 sm:text-[11px]">
            হোম ডেলিভারি
          </p>

        </div>

        {/* COD */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-2 py-4 text-center shadow-sm">

          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
            <Banknote
              size={19}
              strokeWidth={2.5}
              className="text-amber-700"
            />
          </div>

          <p className="text-[11px] font-bold text-amber-900 sm:text-[13px]">
            ক্যাশ অন ডেলিভারি
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-amber-700 sm:text-[11px]">
            হাতে পেয়ে পেমেন্ট
          </p>

        </div>

        {/* Security */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-2 py-4 text-center shadow-sm">

          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
            <ShieldCheck
              size={19}
              strokeWidth={2.5}
              className="text-emerald-700"
            />
          </div>

          <p className="text-[11px] font-bold text-emerald-900 sm:text-[13px]">
            নিরাপদ অর্ডার
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-emerald-700 sm:text-[11px]">
            সহজ ও ঝামেলামুক্ত
          </p>

        </div>

      </div>

      {/* ================= MAIN ================= */}
      <div className="mx-auto mt-7 max-w-5xl">

        <form onSubmit={handleSubmit}>

          {/* ================= CUSTOMER INFORMATION ================= */}
          <div className="overflow-hidden rounded-3xl border border-violet-200 bg-violet-50 shadow-sm">

            {/* Header */}
            <div className="border-b border-violet-200 bg-violet-100/70 px-5 py-5 sm:px-7">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <User
                    size={21}
                    strokeWidth={2.5}
                    className="text-violet-700"
                  />
                </div>

                <div>

                  <h2 className="text-[18px] font-bold text-violet-950 sm:text-[20px]">
                    ডেলিভারি তথ্য
                  </h2>

                  <p className="mt-0.5 text-[12px] font-medium text-violet-700 sm:text-[13px]">
                    সঠিক তথ্য দিয়ে অর্ডারটি সম্পন্ন করুন
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 sm:p-7">

              {/* Name */}
              <div className="mb-5">

                <label
                  className="mb-2 block text-[13px] font-bold text-ink sm:text-[14px]"
                  htmlFor="name"
                >
                  আপনার নাম *
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                  />

                  <input
                    id="name"
                    className="input-field pl-11 text-[14px] font-medium sm:text-[15px]"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    autoComplete="name"
                    required
                  />

                </div>

              </div>

              {/* Phone */}
              <div className="mb-5">

                <label
                  className="mb-2 block text-[13px] font-bold text-ink sm:text-[14px]"
                  htmlFor="phone"
                >
                  মোবাইল নম্বর *
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                  />

                  <input
                    id="phone"
                    className="input-field pl-11 text-[14px] font-medium sm:text-[15px]"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="01XXXXXXXXX"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                  />

                </div>

                <p className="mt-2 text-[11px] font-medium text-ink-soft sm:text-[12px]">
                  📞 অর্ডার কনফার্ম করার জন্য এই নম্বরে যোগাযোগ করা হবে।
                </p>

              </div>

              {/* Full Address */}
              <div className="mb-5">

                <label
                  className="mb-2 block text-[13px] font-bold text-ink sm:text-[14px]"
                  htmlFor="address"
                >
                  সম্পূর্ণ ঠিকানা *
                </label>

                <textarea
                  id="address"
                  className="input-field min-h-[120px] resize-none text-[14px] font-medium leading-6 sm:text-[15px]"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="জেলা / থানা / গ্রাম / বাড়ি / রোড লিখুন"
                  autoComplete="street-address"
                  required
                />

                <p className="mt-2 text-[11px] font-medium text-ink-soft sm:text-[12px]">
                  📍 যত বিস্তারিত ঠিকানা দেবেন, তত সহজে আপনার পণ্য পৌঁছে দেওয়া সম্ভব হবে।
                </p>

              </div>

              {/* ================= DELIVERY AREA ================= */}
              <div>

                <label
                  className="mb-2 block text-[13px] font-bold text-ink sm:text-[14px]"
                  htmlFor="deliveryArea"
                >
                  ডেলিভারি এলাকা *
                </label>

                <div className="relative">

                  <Truck
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                  />

                  <select
                    id="deliveryArea"
                    className="input-field pl-11 text-[14px] font-bold sm:text-[15px]"
                    value={form.deliveryArea}
                    onChange={(e) =>
                      update("deliveryArea", e.target.value)
                    }
                    required
                  >

                    <option value="">
                      ডেলিভারি এলাকা নির্বাচন করুন
                    </option>

                    <option value="ঢাকার ভিতরে">
                      ঢাকার ভিতরে — ৳80
                    </option>

                    <option value="ঢাকার বাহিরে">
                      ঢাকার বাহিরে — ৳120
                    </option>

                  </select>

                </div>

                <p className="mt-2 text-[11px] font-medium text-ink-soft sm:text-[12px]">
                  🚚 আপনার ঠিকানা অনুযায়ী সঠিক ডেলিভারি অপশন নির্বাচন করুন।
                </p>

              </div>

              {/* Note */}
              <div className="mt-5">

                <label
                  className="mb-2 block text-[13px] font-bold text-ink sm:text-[14px]"
                  htmlFor="note"
                >
                  অতিরিক্ত নির্দেশনা
                </label>

                <textarea
                  id="note"
                  className="input-field min-h-[80px] resize-none text-[14px] font-medium leading-6 sm:text-[15px]"
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                  placeholder="ডেলিভারি সংক্রান্ত কোনো নির্দেশনা থাকলে লিখুন (ঐচ্ছিক)"
                />

              </div>

            </div>

          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-amber-200 bg-amber-50 shadow-sm">

            {/* Header */}
            <div className="border-b border-amber-200 bg-amber-100/70 px-5 py-5 sm:px-7">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">

                  <ClipboardList
                    size={21}
                    strokeWidth={2.5}
                    className="text-amber-700"
                  />

                </div>

                <div>

                  <p className="text-[18px] font-bold text-amber-950 sm:text-[20px]">
                    আপনার অর্ডার
                  </p>

                  <p className="mt-0.5 text-[12px] font-medium text-amber-700 sm:text-[13px]">
                    {items.length}টি পণ্য
                  </p>

                </div>

              </div>

            </div>

            {/* Products */}
            <div className="space-y-4 px-5 py-5 sm:px-7">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-white p-3 shadow-sm"
                >

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-xl border border-line object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                      <ShoppingBag
                        size={20}
                        className="text-amber-700"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">

                    <p className="line-clamp-2 text-[13px] font-bold leading-5 text-ink sm:text-[14px]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-[11px] font-medium text-ink-soft sm:text-[12px]">
                      পরিমাণ: {item.qty}
                    </p>

                  </div>

                  <span className="shrink-0 text-[13px] font-bold text-ink sm:text-[14px]">
                    {formatBDT(item.price * item.qty)}
                  </span>

                </div>
              ))}

            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-amber-200 bg-white/60 px-5 py-5 text-[13px] sm:px-7 sm:text-[14px]">

              <div className="flex justify-between text-ink-soft">

                <span className="font-semibold">
                  পণ্যের মূল্য
                </span>

                <span className="font-bold text-ink">
                  {formatBDT(subtotal)}
                </span>

              </div>

              <div className="flex justify-between text-ink-soft">

                <span className="font-semibold">
                  ডেলিভারি চার্জ
                </span>

                <span className="font-bold text-ink">
                  {deliveryCharge > 0
                    ? formatBDT(deliveryCharge)
                    : "এলাকা নির্বাচন করুন"}
                </span>

              </div>

              {codCharge > 0 && (
                <div className="flex justify-between text-ink-soft">

                  <span className="font-semibold">
                    COD চার্জ
                  </span>

                  <span className="font-bold text-ink">
                    {formatBDT(codCharge)}
                  </span>

                </div>
              )}

            </div>

            {/* Total */}
            <div className="border-t border-emerald-200 bg-emerald-100 px-5 py-6 sm:px-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[12px] font-bold text-emerald-800 sm:text-[13px]">
                    সর্বমোট মূল্য
                  </p>

                  <p className="mt-1 text-[27px] font-extrabold tracking-tight text-emerald-950 sm:text-[30px]">
                    {formatBDT(total)}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

                  <CheckCircle2
                    size={27}
                    strokeWidth={2.5}
                    className="text-emerald-700"
                  />

                </div>

              </div>

            </div>

            {/* COD Info */}
            <div className="px-5 py-5 sm:px-7">

              <div className="flex gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">

                  <Banknote
                    size={20}
                    strokeWidth={2.5}
                    className="text-sky-700"
                  />

                </div>

                <div>

                  <p className="text-[13px] font-bold text-sky-950 sm:text-[14px]">
                    ক্যাশ অন ডেলিভারি
                  </p>

                  <p className="mt-1 text-[11px] font-medium leading-5 text-sky-800 sm:text-[12px]">
                    পণ্য হাতে পাওয়ার পর মূল্য পরিশোধ করুন।
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================= ERROR ================= */}
          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-[13px] font-bold leading-6 text-red-700">
              {error}
            </div>
          )}

          {/* ================= CONFIRM BUTTON ================= */}
          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 py-4 text-[15px] font-extrabold text-white shadow-lg transition hover:from-emerald-800 hover:to-teal-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-5 sm:text-[16px]"
            disabled={submitting}
          >
            {submitting
              ? "অর্ডার কনফার্ম করা হচ্ছে..."
              : `অর্ডার কনফার্ম করুন — ${formatBDT(total)}`}
          </button>

          <p className="mt-3 text-center text-[11px] font-medium leading-5 text-ink-soft sm:text-[12px]">
            অর্ডার করার পর আমাদের প্রতিনিধি প্রয়োজন হলে ফোন করে অর্ডারটি নিশ্চিত করবেন।
          </p>

        </form>

      </div>

    </div>
  );
}
