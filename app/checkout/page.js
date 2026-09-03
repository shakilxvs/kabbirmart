"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatBDT } from "@/lib/utils";
import { getStoreSettings } from "@/lib/settings";
import { createOrder } from "@/lib/orders";
import { BD_DISTRICTS, DEFAULT_SETTINGS } from "@/lib/data";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Banknote,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, ready, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    district: "",
    upazila: "",
    address: "",
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

  // ঢাকা জেলা = ৮০ টাকা
  // ঢাকা ছাড়া সব জেলা = ১২০ টাকা
  const deliveryCharge = useMemo(() => {
    return form.district === "ঢাকা" ? 80 : 120;
  }, [form.district]);

  const codCharge = settings.codCharge || 0;
  const total = subtotal + deliveryCharge + codCharge;

  function update(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
      ...(field === "district" ? { upazila: "" } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.district ||
      !form.upazila ||
      !form.address.trim()
    ) {
      setError("⚠️ দয়া করে প্রয়োজনীয় সব তথ্য পূরণ করুন।");
      return;
    }

    if (!/^0?1[0-9]{9}$/.test(form.phone.replace(/[\s-]/g, ""))) {
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
          ...form,
          division: "",
          district: form.district,
          area: form.upazila,
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

  const districts = Object.keys(BD_DISTRICTS);

  const upazilas = form.district
    ? BD_DISTRICTS[form.district] || []
    : [];

  return (
    <div className="container-page py-6 sm:py-10">

      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">

        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-moss-light">
          <CheckCircle2 size={25} className="text-moss-dark" />
        </div>

        <h1 className="font-display text-[28px] font-medium tracking-tight text-ink sm:text-[34px]">
          অর্ডার কনফার্ম করুন
        </h1>

        <p className="mt-2 text-[13px] leading-6 text-ink-soft">
          আপনার তথ্য দিয়ে অর্ডারটি সম্পন্ন করুন। সময় লাগবে মাত্র ১ মিনিট।
        </p>

      </div>

      {/* Trust Section */}
      <div className="mx-auto mt-6 grid max-w-4xl grid-cols-3 gap-2 rounded-2xl border border-line bg-surface p-3">

        <div className="flex flex-col items-center gap-1 text-center">
          <Truck size={19} className="text-ink" />

          <span className="text-[10px] font-medium text-ink sm:text-[12px]">
            সারা বাংলাদেশে
          </span>

          <span className="text-[9px] text-ink-soft sm:text-[11px]">
            হোম ডেলিভারি
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 border-x border-line text-center">
          <Banknote size={19} className="text-ink" />

          <span className="text-[10px] font-medium text-ink sm:text-[12px]">
            ক্যাশ অন ডেলিভারি
          </span>

          <span className="text-[9px] text-ink-soft sm:text-[11px]">
            হাতে পেয়ে পেমেন্ট
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <ShieldCheck size={19} className="text-ink" />

          <span className="text-[10px] font-medium text-ink sm:text-[12px]">
            নিরাপদ অর্ডার
          </span>

          <span className="text-[9px] text-ink-soft sm:text-[11px]">
            সহজ ও ঝামেলামুক্ত
          </span>
        </div>

      </div>

      {/* Main */}
      <div className="mx-auto mt-7 max-w-5xl">

        <form onSubmit={handleSubmit}>

          {/* Delivery Information */}
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7">

            <div className="mb-6">

              <h2 className="text-[17px] font-semibold text-ink">
                ডেলিভারি তথ্য
              </h2>

              <p className="mt-1 text-[12px] text-ink-soft">
                সঠিক তথ্য দিন যাতে আপনার পণ্যটি সঠিক ঠিকানায় পৌঁছে দিতে পারি।
              </p>

            </div>

            {/* Name */}
            <div className="mb-5">

              <label className="label-field" htmlFor="name">
                আপনার নাম *
              </label>

              <input
                id="name"
                className="input-field"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="আপনার পূর্ণ নাম লিখুন"
                autoComplete="name"
                required
              />

            </div>

            {/* Phone */}
            <div className="mb-5">

              <label className="label-field" htmlFor="phone">
                মোবাইল নম্বর *
              </label>

              <input
                id="phone"
                className="input-field"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="01XXXXXXXXX"
                inputMode="numeric"
                autoComplete="tel"
                required
              />

              <p className="mt-1.5 text-[11px] text-ink-soft">
                📞 অর্ডার কনফার্ম করার জন্য এই নম্বরে যোগাযোগ করা হবে।
              </p>

            </div>

            {/* District */}
            <div className="mb-5">

              <label className="label-field" htmlFor="district">
                জেলা *
              </label>

              <select
                id="district"
                className="input-field"
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                required
              >

                <option value="">
                  জেলা নির্বাচন করুন
                </option>

                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}

              </select>

            </div>

            {/* Upazila / Thana */}
            <div className="mb-5">

              <label className="label-field" htmlFor="upazila">
                থানা / উপজেলা *
              </label>

              <select
                id="upazila"
                className="input-field"
                value={form.upazila}
                onChange={(e) => update("upazila", e.target.value)}
                required
                disabled={!form.district}
              >

                <option value="">
                  {form.district
                    ? "থানা / উপজেলা নির্বাচন করুন"
                    : "প্রথমে জেলা নির্বাচন করুন"}
                </option>

                {upazilas.map((upazila) => (
                  <option key={upazila} value={upazila}>
                    {upazila}
                  </option>
                ))}

              </select>

            </div>

            {/* Full Address */}
            <div className="mb-5">

              <label className="label-field" htmlFor="address">
                সম্পূর্ণ ঠিকানা *
              </label>

              <textarea
                id="address"
                className="input-field min-h-[110px] resize-none"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="বাসা/বাড়ি, রোড, গ্রাম/মহল্লা, ইউনিয়ন, ওয়ার্ড ইত্যাদিসহ সম্পূর্ণ ঠিকানা লিখুন"
                autoComplete="street-address"
                required
              />

              <p className="mt-1.5 text-[11px] text-ink-soft">
                📍 বিস্তারিত ঠিকানা দিলে দ্রুত ও সঠিকভাবে ডেলিভারি দেওয়া সম্ভব হবে।
              </p>

            </div>

            {/* Note */}
            <div>

              <label className="label-field" htmlFor="note">
                অতিরিক্ত নির্দেশনা
              </label>

              <textarea
                id="note"
                className="input-field min-h-[70px] resize-none"
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                placeholder="ডেলিভারি সংক্রান্ত কোনো নির্দেশনা থাকলে লিখুন (ঐচ্ছিক)"
              />

            </div>

          </div>

          {/* Order Box */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">

            <div className="border-b border-line px-5 py-4">

              <p className="text-[16px] font-semibold text-ink">
                আপনার অর্ডার
              </p>

              <p className="mt-0.5 text-[11px] text-ink-soft">
                {items.length}টি পণ্য
              </p>

            </div>

            <div className="space-y-4 px-5 py-5">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3"
                >

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 shrink-0 rounded-lg border border-line object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-moss-light">
                      <ShoppingBag
                        size={18}
                        className="text-ink-soft"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">

                    <p className="line-clamp-2 text-[12px] leading-5 text-ink">
                      {item.name}
                    </p>

                    <p className="mt-0.5 text-[11px] text-ink-soft">
                      পরিমাণ: {item.qty}
                    </p>

                  </div>

                  <span className="shrink-0 text-[12px] font-medium text-ink">
                    {formatBDT(item.price * item.qty)}
                  </span>

                </div>
              ))}

            </div>

            {/* Price */}
            <div className="space-y-2 border-t border-line px-5 py-4 text-[12px]">

              <div className="flex justify-between text-ink-soft">

                <span>পণ্যের মূল্য</span>

                <span className="text-ink">
                  {formatBDT(subtotal)}
                </span>

              </div>

              <div className="flex justify-between text-ink-soft">

                <span>ডেলিভারি চার্জ</span>

                <span className="font-medium text-ink">
                  {formatBDT(deliveryCharge)}
                </span>

              </div>

              {codCharge > 0 && (
                <div className="flex justify-between text-ink-soft">

                  <span>COD চার্জ</span>

                  <span className="text-ink">
                    {formatBDT(codCharge)}
                  </span>

                </div>
              )}

            </div>

            {/* Total */}
            <div className="border-t border-line bg-moss-light px-5 py-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[12px] text-ink-soft">
                    সর্বমোট মূল্য
                  </p>

                  <p className="mt-0.5 text-[22px] font-bold text-ink">
                    {formatBDT(total)}
                  </p>

                </div>

                <CheckCircle2
                  size={25}
                  className="text-moss-dark"
                />

              </div>

            </div>

            {/* COD */}
            <div className="px-5 py-4">

              <div className="flex gap-3 rounded-xl border border-line px-3 py-3">

                <Banknote
                  size={19}
                  className="mt-0.5 shrink-0 text-ink"
                />

                <div>

                  <p className="text-[12px] font-medium text-ink">
                    ক্যাশ অন ডেলিভারি
                  </p>

                  <p className="mt-0.5 text-[10.5px] leading-5 text-ink-soft">
                    পণ্য হাতে পাওয়ার পর মূল্য পরিশোধ করুন।
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-clay/20 bg-clay/5 px-4 py-3 text-[12px] text-clay">
              {error}
            </div>
          )}

          {/* Confirm Order Button */}
          <button
            type="submit"
            className="btn-primary mt-5 w-full py-4 text-[14px] font-semibold"
            disabled={submitting}
          >
            {submitting
              ? "অর্ডার কনফার্ম করা হচ্ছে..."
              : `অর্ডার কনফার্ম করুন — ${formatBDT(total)}`}
          </button>

          <p className="mt-3 text-center text-[10.5px] leading-5 text-ink-soft">
            অর্ডার করার পর আমাদের প্রতিনিধি প্রয়োজন হলে ফোন করে অর্ডারটি নিশ্চিত করবেন।
          </p>

        </form>

      </div>

    </div>
  );
}
