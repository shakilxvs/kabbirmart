import Image from "next/image";
import { notFound } from "next/navigation";
import { Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found — KabbirMart" };
  return {
    title: `${product.name} — KabbirMart`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-line/40">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>

        <div className="lg:pt-2">
          <p className="text-[13px] font-medium capitalize text-moss">{product.category}</p>
          <h1 className="mt-2 font-display text-[28px] font-medium leading-tight tracking-tight text-ink sm:text-[32px]">
            {product.name}
          </h1>

          <ProductDetailClient product={product} />

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
            <Truck size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-moss" />
            <div>
              <p className="text-[13px] font-medium text-ink">Cash on Delivery available</p>
              <p className="mt-0.5 text-[12.5px] text-ink-soft">
                Pay when your order arrives at your doorstep, anywhere in Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20 sm:mt-28">
          <SectionHeading title="You may also like" />
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
