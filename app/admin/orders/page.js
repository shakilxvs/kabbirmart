"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getAllOrders } from "@/lib/orders";
import { formatBDT, STATUS_STYLES, ORDER_STATUSES } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminShell title="Orders">
      <div className="-mx-5 mb-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
        {["All", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium ${
              filter === s ? "border-ink bg-ink text-bone" : "border-line text-ink-soft"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {filtered.map((o, i) => (
          <Link
            key={o.id}
            href={`/admin/orders/${o.id}`}
            className={`flex items-center justify-between px-4 py-3.5 text-[13px] ${
              i !== 0 ? "border-t border-line" : ""
            }`}
          >
            <div>
              <p className="font-medium text-ink">{o.orderNumber}</p>
              <p className="text-ink-soft">{o.customer?.name} · {o.customer?.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-ink">{formatBDT(o.total)}</span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[o.status]}`}>
                {o.status}
              </span>
            </div>
          </Link>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-[13px] text-ink-soft">No orders here.</p>
        )}
      </div>
    </AdminShell>
  );
}
