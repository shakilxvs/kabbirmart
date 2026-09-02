import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/lib/products";
import { CATEGORIES } from "@/lib/data";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const category = CATEGORIES.find((c) => c.id === params.id);
  if (!category) return {};
  return { title: `${category.label} — KabbirMart` };
}

export default async function CategoryPage({ params }) {
  const category = CATEGORIES.find((c) => c.id === params.id);
  if (!category) notFound();

  const products = await getProductsByCategory(params.id);

  return (
    <div className="container-page py-8 sm:py-12">
      <SectionHeading title={category.label} subtitle={`${products.length} product${products.length === 1 ? "" : "s"}`} />
      <ProductGrid products={products} />
    </div>
  );
}
