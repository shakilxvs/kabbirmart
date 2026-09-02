"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getAllProducts } from "@/lib/products";
import { getAllOrders } from "@/lib/orders";
import { seedSampleData } from "@/lib/seed";
import { formatBDT, STATUS_STYLES } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  function loadData() {
    setLoading(true);
    return Promise.all([getAllProducts(), getAllOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    setSeedMessage("");
    try {
      const { created, skipped } = await seedSampleData();
      setSeedMessage(
        created > 0
          ? `Added ${created} sample product${created === 1 ? "" : "s"}${skipped ? ` (${skipped} already existed)` : ""}, plus default settings and homepage content.`
          : "Sample products were already loaded. Settings and homepage defaults were refreshed."
      );
      await loadData();
    } catch (err) {
      setSeedMessage("Something went wrong loading sample data. Please try again.");
    } finally {
      setSeeding(false);
    }
  }

  const pending = orders.filter((o) => o.status === "Pending").length;
  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStock = products.filter((p) => (p.stock ?? 0) <= 5 && p.available !== false).length;

  return (
    <AdminShell title="Dashboard">
      {!loading && products.length === 0 && (
        <div className="mb-6 rounded-2xl border border-moss/30 bg-moss-light p-4">
          <p className="text-[14px] font-medium text-moss-dark">Your store is empty</p>
          <p className="mt-1 text-[13px] text-moss-dark/80">
            Load sample products, delivery settings, and homepage content so the site looks
            complete right away. You can edit or delete anything afterward.
          </p>
          <button onClick={handleSeed} disabled={seeding} className="btn-accent mt-3 px-4 py-2 text-[13px]">
            <Sparkles size={15} />
            {seeding ? "Loading sample data..." : "Load default data"}
          </button>
        </div>
      )}

      {products.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4">
          <div className="flex-1">
            <p className="text-[13.5px] font-medium text-ink">Load default data</p>
            <p className="mt-0.5 text-[12.5px] text-ink-soft">
              Re-adds any missing sample products and resets settings/homepage to defaults.
            </p>
          </div>
          <button onClick={handleSeed} disabled={seeding} className="btn-secondary px-4 py-2 text-[13px]">
            <Sparkles size={15} />
            {seeding ? "Loading..." : "Load default data"}
          </button>
        </div>
      )}

      {seedMessage && (
        <p className="mb-6 rounded-xl bg-moss-light px-4 py-2.5 text-[13px] text-moss-dark">
          {seedMessage}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Stat label="Orders" value={orders.length} loading={loading} />
        <Stat label="Pending" value={pending} loading={loading} />
        <Stat label="Products" value={products.length} loading={loading} />
        <Stat label="Revenue" value={formatBDT(revenue)} loading={loading} />
      </div>

      {lowStock > 0 && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          {lowStock} product{lowStock > 1 ? "s are" : " is"} low on stock (5 or fewer left).
        </p>
      )}

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[14px] font-medium text-ink">Recent orders</p>
          <Link href="/admin/orders" className="text-[13px] text-moss">View all</Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {orders.slice(0, 6).map((o, i) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className={`flex items-center justify-between px-4 py-3.5 text-[13px] ${
                i !== 0 ? "border-t border-line" : ""
              }`}
            >
              <div>
                <p className="font-medium text-ink">{o.orderNumber}</p>
                <p className="text-ink-soft">{o.customer?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-ink">{formatBDT(o.total)}</span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[o.status]}`}>
                  {o.status}
                </span>
              </div>
            </Link>
          ))}
          {!loading && orders.length === 0 && (
            <p className="px-4 py-8 text-center text-[13px] text-ink-soft">No orders yet.</p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function Stat({ label, value, loading }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-[12px] text-ink-soft">{label}</p>
      <p className="mt-1 text-[20px] font-medium text-ink">{loading ? "—" : value}</p>
    </div>
  );
}
