"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getHomepageContent, updateHomepageContent } from "@/lib/settings";
import { DEFAULT_HOMEPAGE } from "@/lib/data";

export default function AdminHomepagePage() {
  const [form, setForm] = useState(DEFAULT_HOMEPAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getHomepageContent()
      .then(setForm)
      .finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await updateHomepageContent(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return <AdminShell title="Homepage"><p className="text-[13px] text-ink-soft">Loading...</p></AdminShell>;
  }

  return (
    <AdminShell title="Homepage">
      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        <p className="text-[13px] font-medium text-ink">Hero section</p>

        <div>
          <label className="label-field">Hero title</label>
          <input className="input-field" value={form.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} />
        </div>
        <div>
          <label className="label-field">Hero subtitle</label>
          <textarea className="input-field min-h-[80px] resize-none" value={form.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} />
        </div>
        <div>
          <label className="label-field">Hero image URL</label>
          <input className="input-field" value={form.heroImage} onChange={(e) => update("heroImage", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Button text</label>
            <input className="input-field" value={form.heroButtonText} onChange={(e) => update("heroButtonText", e.target.value)} />
          </div>
          <div>
            <label className="label-field">Button link</label>
            <input className="input-field" value={form.heroButtonLink} onChange={(e) => update("heroButtonLink", e.target.value)} />
          </div>
        </div>

        <p className="pt-2 text-[13px] font-medium text-ink">Promotional section</p>

        <div>
          <label className="label-field">Promo title</label>
          <input className="input-field" value={form.promoTitle} onChange={(e) => update("promoTitle", e.target.value)} />
        </div>
        <div>
          <label className="label-field">Promo text</label>
          <textarea className="input-field min-h-[80px] resize-none" value={form.promoText} onChange={(e) => update("promoText", e.target.value)} />
        </div>
        <div>
          <label className="label-field">Promo image URL</label>
          <input className="input-field" value={form.promoImage} onChange={(e) => update("promoImage", e.target.value)} />
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved" : "Save homepage"}
        </button>
      </form>

      <div className="mt-8 max-w-md rounded-2xl border border-line bg-surface p-4">
        <p className="text-[13px] text-ink-soft">
          Featured and trending products are chosen from each product's edit page.
        </p>
        <Link href="/admin/products" className="mt-2 inline-block text-[13px] font-medium text-moss">
          Go to products →
        </Link>
      </div>
    </AdminShell>
  );
}
