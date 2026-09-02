"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { getAllProducts, deleteProduct } from "@/lib/products";
import { formatBDT } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <AdminShell title="Products">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[13px] text-ink-soft">{loading ? "Loading..." : `${products.length} products`}</p>
        <Link href="/admin/products/new" className="btn-accent px-4 py-2 text-[13px]">
          <Plus size={16} />
          Add product
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-line/40">
              {p.images?.[0] && (
                <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-medium text-ink">{p.name}</p>
              <p className="text-[12.5px] text-ink-soft">
                {formatBDT(p.discountPrice || p.price)} · Stock: {p.stock}
                {p.available === false && " · Hidden"}
              </p>
              <div className="mt-1 flex gap-1.5">
                {p.featured && <Tag>Featured</Tag>}
                {p.trending && <Tag>Trending</Tag>}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Link
                href={`/admin/products/${p.id}`}
                className="rounded-full p-2 text-ink-soft hover:bg-line/40 hover:text-ink"
                aria-label="Edit"
              >
                <Pencil size={16} strokeWidth={1.75} />
              </Link>
              <button
                onClick={() => handleDelete(p.id, p.name)}
                className="rounded-full p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
                aria-label="Delete"
              >
                <Trash2 size={16} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        ))}
        {!loading && products.length === 0 && (
          <p className="py-12 text-center text-[13px] text-ink-soft">
            No products yet. Add your first one.
          </p>
        )}
      </div>
    </AdminShell>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full bg-moss-light px-2 py-0.5 text-[10.5px] font-medium text-moss-dark">
      {children}
    </span>
  );
}
