import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, PackageCheck, BadgeCheck } from "lucide-react";
import { getFeaturedProducts, getTrendingProducts } from "@/lib/products";
import { getHomepageContent } from "@/lib/settings";
import { getAllCategories } from "@/lib/categories";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, featured, trending, categories] = await Promise.all([
    getHomepageContent(),
    getFeaturedProducts(),
    getTrendingProducts(),
    getAllCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="container-page pt-8 sm:pt-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="text-[13px] font-medium text-moss">KabbirMart</p>
            <h1 className="mt-3 font-display text-[38px] italic leading-[1.08] tracking-tight text-ink sm:text-[46px] lg:text-[52px]">
              {content.heroTitle}
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
              {content.heroSubtitle}
            </p>
            <div className="mt-7">
              <Link href={content.heroButtonLink || "/#featured"} className="btn-primary">
                {content.heroButtonText || "Shop the collection"}
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:col-span-7 lg:aspect-auto">
            {content.heroImage && (
              <Image
                src={content.heroImage}
                alt="Featured tech gadgets"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page mt-16 sm:mt-24">
        <SectionHeading title="Shop by category" />
        {categories.length > 0 ? (
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-8">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="flex shrink-0 items-center justify-center rounded-2xl border border-line bg-surface px-5 py-4 text-[13px] font-medium text-ink transition-colors hover:border-moss hover:text-moss sm:px-3 sm:text-center"
              >
                {c.label}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-ink-soft">
            No categories yet — add some from the admin panel.
          </p>
        )}
      </section>

      {/* Featured */}
      <section id="featured" className="container-page mt-16 scroll-mt-24 sm:mt-24">
        <SectionHeading
          title="Featured"
          subtitle="A short list of what we'd put on our own desk this month."
        />
        <ProductGrid products={featured} />
      </section>

      {/* Promo */}
      <section className="mt-20 sm:mt-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-ink">
            <div className="relative z-10 grid gap-6 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
              <div>
                <h2 className="font-display text-[28px] italic leading-tight text-bone sm:text-[34px]">
                  {content.promoTitle}
                </h2>
                <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-bone/70">
                  {content.promoText}
                </p>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl lg:aspect-[4/3]">
                {content.promoImage && (
                  <Image
                    src={content.promoImage}
                    alt="Cash on delivery"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="container-page mt-20 sm:mt-28">
          <SectionHeading title="Trending now" subtitle="What customers are adding to cart most." />
          <ProductGrid products={trending} />
        </section>
      )}

      {/* Why shop with us */}
      <section className="container-page mt-20 sm:mt-28">
        <SectionHeading title="Why shop with us" />
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Truck size={22} strokeWidth={1.5} className="text-moss" />
            <p className="mt-4 text-[15px] font-medium text-ink">Cash on Delivery</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              Order without a card. Pay in cash the moment it reaches your door, anywhere in Bangladesh.
            </p>
          </div>
          <div>
            <PackageCheck size={22} strokeWidth={1.5} className="text-moss" />
            <p className="mt-4 text-[15px] font-medium text-ink">Quality checked</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              Every item is inspected and tested before it's packed for delivery.
            </p>
          </div>
          <div>
            <BadgeCheck size={22} strokeWidth={1.5} className="text-moss" />
            <p className="mt-4 text-[15px] font-medium text-ink">Fair, honest pricing</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              No inflated prices before a "sale." What you see is what you pay.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
