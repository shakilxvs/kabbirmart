"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { getAllCategories, createCategory, deleteCategory } from "@/lib/categories";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    return getAllCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    const trimmed = label.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.label.toLowerCase() === trimmed.toLowerCase())) {
      setError("That category already exists.");
      return;
    }
    setSaving(true);
    try {
      await createCategory(trimmed);
      setLabel("");
      await load();
    } catch (err) {
      setError("Could not add category. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, categoryLabel) {
    if (!confirm(`Remove "${categoryLabel}"? Products already using it will keep showing but won't appear under this category anymore.`)) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <AdminShell title="Categories">
      <form onSubmit={handleAdd} className="mb-6 flex max-w-md gap-2">
        <input
          className="input-field"
          placeholder="e.g. Laptop Bags"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button type="submit" className="btn-accent shrink-0 px-4 py-2 text-[13px]" disabled={saving}>
          <Plus size={16} />
          Add
        </button>
      </form>
      {error && <p className="mb-4 max-w-md text-[13px] text-clay">{error}</p>}

      <div className="max-w-md space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3"
          >
            <span className="text-[13.5px] text-ink">{c.label}</span>
            <button
              onClick={() => handleDelete(c.id, c.label)}
              className="rounded-full p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600"
              aria-label={`Delete ${c.label}`}
            >
              <Trash2 size={15} strokeWidth={1.75} />
            </button>
          </div>
        ))}
        {!loading && categories.length === 0 && (
          <p className="py-8 text-center text-[13px] text-ink-soft">
            No categories yet. Add your first one above.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
