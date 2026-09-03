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
      console.error(err);
      setError("❌ অর্ডার সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      setSubmitting(false);
    }
  }

  if (!ready || items.length === 0) {
    return null;
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            অর্ডার কনফার্ম করুন
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            আপনার অর্ডারটি সম্পন্ন করুন
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
            নিচের তথ্যগুলো সঠিকভাবে পূরণ করুন
          </p>
        </div>

        {/* TRUST BOXES */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  সারা বাংলাদেশে
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  হোম ডেলিভারি
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  ক্যাশ অন ডেলিভারি
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  হাতে পেয়ে পেমেন্ট
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  নিরাপদ অর্ডার
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  সহজ ও ঝামেলামুক্ত
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* DELIVERY INFORMATION */}
          <div className="mb-6 overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">

            <div className="border-b border-violet-100 bg-violet-50 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    ডেলিভারি তথ্য
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    যেখানে পণ্যটি ডেলিভারি করতে হবে
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-700">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-14 pr-4 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-700">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-14 pr-4 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <p className="mt-1.5 text-xs font-medium text-slate-400">
                  📱 যে নম্বরে আমাদের ডেলিভারি প্রতিনিধি যোগাযোগ করবেন
                </p>
              </div>

              {/* FULL ADDRESS */}
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-700">
                  সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-4 z-10 h-5 w-5 text-slate-400" />

                  <textarea
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="জেলা / থানা / গ্রাম / বাড়ি / রোড লিখুন"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-14 pr-4 text-sm font-semibold leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <p className="mt-1.5 text-xs font-medium text-slate-400">
                  📍 যত বিস্তারিত ঠিকানা দেবেন, তত সহজে আপনার পণ্য পৌঁছে দেওয়া সম্ভব হবে।
                </p>
              </div>

              {/* DELIVERY AREA */}
              <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 sm:p-5">
                <label className="mb-3 block text-base font-extrabold text-slate-800">
                  ডেলিভারি এলাকা <span className="text-red-500">*</span>
                </label>

                <div className="space-y-3">

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                      form.deliveryArea === "ঢাকার ভিতরে"
                        ? "border-violet-500 bg-violet-100 shadow-sm"
                        : "border-slate-200 bg-white hover:border-violet-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryArea"
                      value="ঢাকার ভিতরে"
                      checked={form.deliveryArea === "ঢাকার ভিতরে"}
                      onChange={(e) =>
                        update("deliveryArea", e.target.value)
                      }
                      className="h-5 w-5 shrink-0 accent-violet-600"
                    />

                    <span className="flex-1 text-sm font-extrabold text-slate-800">
                      ঢাকার ভিতরে
                    </span>

                    <span className="text-sm font-black text-violet-600">
                      ৮০ টাকা
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                      form.deliveryArea === "ঢাকার বাহিরে"
                        ? "border-violet-500 bg-violet-100 shadow-sm"
                        : "border-slate-200 bg-white hover:border-violet-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryArea"
                      value="ঢাকার বাহিরে"
                      checked={form.deliveryArea === "ঢাকার বাহিরে"}
                      onChange={(e) =>
                        update("deliveryArea", e.target.value)
                      }
                      className="h-5 w-5 shrink-0 accent-violet-600"
                    />

                    <span className="flex-1 text-sm font-extrabold text-slate-800">
                      ঢাকার বাহিরে
                    </span>

                    <span className="text-sm font-black text-violet-600">
                      ১২০ টাকা
                    </span>
                  </label>

                </div>
              </div>

              {/* NOTE */}
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-700">
                  অতিরিক্ত নির্দেশনা{" "}
                  <span className="font-medium text-slate-400">
                    (ঐচ্ছিক)
                  </span>
                </label>

                <textarea
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                  placeholder="কোনো বিশেষ নির্দেশনা থাকলে লিখুন..."
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="mb-6 overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm">

            <div className="border-b border-amber-100 bg-amber-50 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <ClipboardList className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    আপনার অর্ডার
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    অর্ডারের বিস্তারিত
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-extrabold text-slate-800">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {item.qty} × {formatBDT(item.price)}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-extrabold text-slate-800">
                      {formatBDT(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-500">
                    পণ্যের মূল্য
                  </span>
                  <span className="font-extrabold text-slate-800">
                    {formatBDT(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-500">
                    ডেলিভারি চার্জ
                  </span>
                  <span className="font-extrabold text-slate-800">
                    {deliveryCharge > 0
                      ? formatBDT(deliveryCharge)
                      : "এলাকা নির্বাচন করুন"}
                  </span>
                </div>

                {codCharge > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-500">
                      COD চার্জ
                    </span>
                    <span className="font-extrabold text-slate-800">
                      {formatBDT(codCharge)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-4">
                  <span className="text-base font-extrabold text-slate-800">
                    সর্বমোট
                  </span>

                  <span className="text-xl font-black text-emerald-600">
                    {formatBDT(total)}
                  </span>
                </div>

              </div>

              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sky-50 p-4">
                <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />

                <div>
                  <p className="text-sm font-extrabold text-sky-800">
                    ক্যাশ অন ডেলিভারি
                  </p>

                  <p className="mt-1 text-xs font-medium leading-5 text-sky-700">
                    পণ্য হাতে পাওয়ার পর ডেলিভারি প্রতিনিধিকে পেমেন্ট করতে পারবেন।
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          {/* CONFIRM BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-base font-extrabold text-white shadow-lg shadow-emerald-100 transition hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                অর্ডার প্রসেস হচ্ছে...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                অর্ডার কনফার্ম করুন
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs font-semibold text-slate-400">
            অর্ডার কনফার্ম করার পর আমাদের প্রতিনিধি প্রয়োজন হলে আপনার সাথে যোগাযোগ করবেন।
          </p>

        </form>
      </div>
    </div>
  );
}
