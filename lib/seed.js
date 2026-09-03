import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SEED_PRODUCTS, SEED_CATEGORIES, DEFAULT_SETTINGS, DEFAULT_HOMEPAGE } from "@/lib/data";
import { slugify } from "@/lib/utils";

// Populates Firestore with sample categories, sample products, default
// store settings, and default homepage content. Safe to run more than
// once — categories/products already present (matched by slug) are
// skipped; settings/homepage are overwritten with defaults each time so
// the "reset to defaults" behaviour is predictable.
export async function seedSampleData() {
  const categoriesRef = collection(db, "categories");
  for (const category of SEED_CATEGORIES) {
    const slug = slugify(category.label);
    const existing = await getDocs(query(categoriesRef, where("slug", "==", slug)));
    if (existing.empty) {
      await setDoc(doc(categoriesRef), { label: category.label, slug, createdAt: Date.now() });
    }
  }

  const productsRef = collection(db, "products");
  let created = 0;
  let skipped = 0;

  for (const product of SEED_PRODUCTS) {
    const existing = await getDocs(query(productsRef, where("slug", "==", product.slug)));
    if (!existing.empty) {
      skipped++;
      continue;
    }
    const ref = doc(productsRef);
    await setDoc(ref, { ...product, createdAt: Date.now() });
    created++;
  }

  await setDoc(doc(db, "settings", "store"), DEFAULT_SETTINGS, { merge: true });
  await setDoc(doc(db, "settings", "homepage"), DEFAULT_HOMEPAGE, { merge: true });

  return { created, skipped };
}
