import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return (
      <p className="py-12 text-center text-[14px] text-ink-soft">
        No products here yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
