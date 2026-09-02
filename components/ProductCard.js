import Link from "next/link";
import Image from "next/image";
import { formatBDT } from "@/lib/utils";

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const outOfStock = product.available === false || product.stock <= 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-line/40">
        {product.images?.[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        )}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-clay px-2.5 py-1 text-[11px] font-medium text-white">
            -{Math.round(100 - (product.discountPrice / product.price) * 100)}%
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-bone/70">
            <span className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-bone">
              Out of stock
            </span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="line-clamp-2 text-[14px] leading-snug text-ink">{product.name}</p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-[15px] font-medium text-ink">
            {formatBDT(hasDiscount ? product.discountPrice : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[13px] text-ink-soft/70 line-through">
              {formatBDT(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
