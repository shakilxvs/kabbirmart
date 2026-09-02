"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getStoreSettings, updateStoreSettings } from "@/lib/settings";
import { DEFAULT_SETTINGS } from "@/lib/data";

export default function AdminSettingsPage() {
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getStoreSettings()
      .then(setForm)
      .finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await updateStoreSettings({
      ...form,
      deliveryCharge: Number(form.deliveryCharge) || 0,
      deliveryChargeDhaka: Number(form.deliveryChargeDhaka) || 0,
      codCharge: Number(form.codCharge) || 0,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return <AdminShell title="Settings"><p className="text-[13px] text-ink-soft">Loading...</p></AdminShell>;
  }

  return (
    <AdminShell title="Settings">
      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Delivery charge — Dhaka (৳)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.deliveryChargeDhaka}
              onChange={(e) => update("deliveryChargeDhaka", e.target.value)}
            />
          </div>
          <div>
            <label className="label-field">Delivery charge — Outside Dhaka (৳)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.deliveryCharge}
              onChange={(e) => update("deliveryCharge", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label-field">COD charge (৳)</label>
          <input
            type="number"
            min="0"
            className="input-field"
            value={form.codCharge}
            onChange={(e) => update("codCharge", e.target.value)}
            placeholder="0 if none"
          />
        </div>

        <div>
          <label className="label-field">Store name</label>
          <input
            className="input-field"
            value={form.storeName}
            onChange={(e) => update("storeName", e.target.value)}
          />
        </div>

        <div>
          <label className="label-field">Store phone</label>
          <input
            className="input-field"
            value={form.storePhone}
            onChange={(e) => update("storePhone", e.target.value)}
          />
        </div>

        <div>
          <label className="label-field">Store email</label>
          <input
            className="input-field"
            value={form.storeEmail}
            onChange={(e) => update("storeEmail", e.target.value)}
          />
        </div>

        <div>
          <label className="label-field">Store address</label>
          <input
            className="input-field"
            value={form.storeAddress}
            onChange={(e) => update("storeAddress", e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved" : "Save settings"}
        </button>
      </form>
    </AdminShell>
  );
}
