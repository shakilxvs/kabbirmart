"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/products";
import { getAllCategories } from "@/lib/categories";
import { slugify } from "@/lib/utils";

const EMPTY = {
  name: "",
  price: "",
  discountPrice: "",
  description: "",
  images: "",
  stock: "",
  category: "",
  featured: false,
  trending: false,
  available: true,
};

export default function ProductForm({ initial, productId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(() =>
    initial
      ? {
          ...EMPTY,
          ...initial,
          price: initial.price ?? "",
          discountPrice: initial.discountPrice ?? "",
          stock: initial.stock ?? "",
          images: (initial.images || []).join(", "),
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllCategories().then((cats) => {
      setCategories(cats);
      setForm((f) => (f.category ? f : { ...f, category: cats[0]?.slug || "" }));
    });
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || form.stock === "") {
      setError("Name, price, and stock are required.");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name,
      slug: slugify(form.name),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      description: form.description,
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stock: Number(form.stock),
      category: form.category,
      featured: !!form.featured,
      trending: !!form.trending,
      available: !!form.available,
    };

    try {
      if (productId) {
        await updateProduct(productId, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/admin/products");
    } catch (err) {
      setError("Could not save the product. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="label-field">Product name *</label>
        <input
          className="input-field"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">Price (৳) *</label>
          <input
            type="number"
            min="0"
            className="input-field"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label-field">Discount price (৳)</label>
          <input
            type="number"
            min="0"
            className="input-field"
            value={form.discountPrice}
            onChange={(e) => update("discountPrice", e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label className="label-field">Description</label>
        <textarea
          className="input-field min-h-[100px] resize-none"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div>
        <label className="label-field">Image URL(s)</label>
        <input
          className="input-field"
          value={form.images}
          onChange={(e) => update("images", e.target.value)}
          placeholder="https://... (comma-separate for multiple)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-field">Stock *</label>
          <input
            type="number"
            min="0"
            className="input-field"
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label-field">Category</label>
          <select
            className="input-field"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {categories.length === 0 && <option value="">No categories yet</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-5">
        <Checkbox label="Featured" checked={form.featured} onChange={(v) => update("featured", v)} />
        <Checkbox label="Trending" checked={form.trending} onChange={(v) => update("trending", v)} />
        <Checkbox label="Available" checked={form.available} onChange={(v) => update("available", v)} />
      </div>

      {error && <p className="text-[13px] text-clay">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : productId ? "Save changes" : "Add product"}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.push("/admin/products")}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-[13.5px] text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-line accent-moss"
      />
      {label}
    </label>
  );
}
