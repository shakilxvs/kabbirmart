"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getOrderById, updateOrderStatus } from "@/lib/orders";
import { formatBDT, ORDER_STATUSES, STATUS_STYLES } from "@/lib/utils";

export default function AdminOrderDetailPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getOrderById(params.id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleStatusChange(status) {
    setUpdating(true);
    await updateOrderStatus(params.id, status);
    setOrder((o) => ({ ...o, status }));
    setUpdating(false);
  }

  if (loading) return <AdminShell title="Order"><p className="text-[13px] text-ink-soft">Loading...</p></AdminShell>;
  if (!order) return <AdminShell title="Order"><p className="text-[13px] text-ink-soft">Order not found.</p></AdminShell>;

  return (
    <AdminShell title={`Order ${order.orderNumber}`}>
      <div className="max-w-xl space-y-6">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-ink">Status</p>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[order.status] || "bg-line text-ink-soft"}`}>
              {order.status}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                disabled={updating || s === order.status}
                onClick={() => handleStatusChange(s)}
                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium disabled:opacity-40 ${
                  s === order.status ? "border-ink bg-ink text-bone" : "border-line text-ink-soft hover:border-ink/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-[14px] font-medium text-ink">Customer</p>
          <div className="mt-2 space-y-1 text-[13px] text-ink-soft">
            <p>{order.customer?.name} · {order.customer?.phone}</p>
            <p>{order.customer?.address}</p>
            <p>
              {order.customer?.area ? `${order.customer.area}, ` : ""}
              {order.customer?.district}, {order.customer?.division}
            </p>
            {order.customer?.note && <p>Note: {order.customer.note}</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-[14px] font-medium text-ink">Items</p>
          <ul className="mt-2 divide-y divide-line">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between py-2.5 text-[13px]">
                <span className="text-ink-soft">{item.name} × {item.qty}</span>
                <span className="text-ink">{formatBDT(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 space-y-1.5 border-t border-line pt-3 text-[13px]">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span><span className="text-ink">{formatBDT(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Delivery charge</span><span className="text-ink">{formatBDT(order.deliveryCharge)}</span>
            </div>
            {order.codCharge > 0 && (
              <div className="flex justify-between text-ink-soft">
                <span>COD charge</span><span className="text-ink">{formatBDT(order.codCharge)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 text-[14px] font-medium text-ink">
              <span>Total</span><span>{formatBDT(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
