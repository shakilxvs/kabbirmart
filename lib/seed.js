import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SEED_PRODUCTS, DEFAULT_SETTINGS, DEFAULT_HOMEPAGE } from "@/lib/data";

// Populates Firestore with sample products, default store settings, and
// default homepage content. Safe to run more than once — products already
// present (matched by slug) are skipped, and settings/homepage are only
// written with defaults if nothing exists yet (existing values are not
// overwritten).
export async function seedSampleData() {
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
