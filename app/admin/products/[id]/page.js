"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/products";

export default function EditProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(params.id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminShell title="Edit product">
      {loading ? (
        <p className="text-[13px] text-ink-soft">Loading...</p>
      ) : product ? (
        <ProductForm initial={product} productId={product.id} />
      ) : (
        <p className="text-[13px] text-ink-soft">Product not found.</p>
      )}
    </AdminShell>
  );
}
