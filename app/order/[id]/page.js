import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getOrderById } from "@/lib/orders";
import { formatBDT } from "@/lib/utils";

export default async function OrderConfirmationPage({ params }) {
  const order = await getOrderById(params.id);

  if (!order) notFound();

  const purchaseItems = order.items.map((item) => ({
    id: String(item.productId || item.id || item.name),
    quantity: item.qty,
    item_price: item.price,
  }));

  const contentIds = order.items.map((item) =>
    String(item.productId || item.id || item.name)
  );

  const totalValue =
    order.total ||
    Number(order.subtotal || 0) +
      Number(order.deliveryCharge || 0) +
      Number(order.codCharge || 0);

  const purchaseData = {
    content_ids: contentIds,
    content_type: "product",
    contents: purchaseItems,
    value: totalValue,
    currency: "BDT",
    num_items: order.items.reduce(
      (totalQty, item) => totalQty + Number(item.qty || 0),
      0
    ),
  };

  return (
    <div className="container-page py-14 sm:py-20">
      <Script
        id={`meta-purchase-${order.id}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== "undefined" && window.fbq) {
              window.fbq("track", "Purchase", ${JSON.stringify(purchaseData)});
            }
          `,
        }}
      />

      <div className="mx-auto max-w-lg text-center">
        <CheckCircle2
          size={44}
          strokeWidth={1.25}
          className="mx-auto text-moss"
        />

        <h1 className="mt-5 font-display text-[26px] font-medium tracking-tight text-ink sm:text-[30px]">
          Order placed
        </h1>

        <p className="mt-2 text-[14px] text-ink-soft">
          Thank you, {order.customer?.name?.split(" ")[0]}. We'll call you at{" "}
          {order.customer?.phone} to confirm your order.
        </p>

        <p className="mt-4 inline-block rounded-full border border-line px-4 py-1.5 text-[13px] font-medium text-ink">
          Order #{order.orderNumber}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-line bg-surface p-6">
        <ul className="divide-y divide-line">
          {order.items.map((item, i) => (
            <li
              key={i}
              className="flex justify-between py-3 text-[13px]"
            >
              <span className="text-ink-soft">
                {item.name}{" "}
                <span className="text-ink">
                  × {item.qty}
                </span>
              </span>

              <span className="text-ink">
                {formatBDT(item.price * item.qty)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 space-y-2 border-t border-line pt-4 text-[13px]">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span className="text-ink">
              {formatBDT(order.subtotal)}
            </span>
          </div>

          <div className="flex justify-between text-ink-soft">
            <span>Delivery charge</span>
            <span className="text-ink">
              {formatBDT(order.deliveryCharge)}
            </span>
          </div>

          {order.codCharge > 0 && (
            <div className="flex justify-between text-ink-soft">
              <span>COD charge</span>
              <span className="text-ink">
                {formatBDT(order.codCharge)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-between border-t border-line pt-4 text-[15px] font-medium text-ink">
          <span>Total</span>

          <span>
            {formatBDT(totalValue)}
          </span>
        </div>

        <p className="mt-4 rounded-xl bg-moss-light px-3 py-2.5 text-center text-[12.5px] text-moss-dark">
          Payment method: Cash on Delivery
        </p>

        <div className="mt-6 border-t border-line pt-4 text-[13px] text-ink-soft">
          <p>{order.customer?.address}</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="btn-secondary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
