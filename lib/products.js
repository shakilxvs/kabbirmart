import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/utils";

const PRODUCTS = "products";

function withId(snap) {
  return { id: snap.id, ...snap.data() };
}

export async function getAllProducts() {
  const snap = await getDocs(
    query(collection(db, PRODUCTS), orderBy("createdAt", "desc"))
  );
  return snap.docs.map(withId);
}

export async function getAvailableProducts() {
  const all = await getAllProducts();
  return all.filter((p) => p.available !== false);
}

export async function getFeaturedProducts() {
  const all = await getAvailableProducts();
  return all.filter((p) => p.featured);
}

export async function getTrendingProducts() {
  const all = await getAvailableProducts();
  return all.filter((p) => p.trending);
}

export async function getProductsByCategory(category) {
  const all = await getAvailableProducts();
  return all.filter((p) => p.category === category);
}

export async function getProductBySlug(slug) {
  const snap = await getDocs(
    query(collection(db, PRODUCTS), where("slug", "==", slug))
  );
  if (snap.empty) return null;
  return withId(snap.docs[0]);
}

export async function getProductById(id) {
  const ref = doc(db, PRODUCTS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return withId(snap);
}

export async function getRelatedProducts(product, max = 4) {
  const all = await getAvailableProducts();
  return all
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, max);
}

export async function createProduct(data) {
  const payload = {
    ...data,
    slug: data.slug || slugify(data.name),
    createdAt: Date.now(),
  };
  return addDoc(collection(db, PRODUCTS), payload);
}

export async function updateProduct(id, data) {
  const ref = doc(db, PRODUCTS, id);
  return updateDoc(ref, data);
}

export async function deleteProduct(id) {
  const ref = doc(db, PRODUCTS, id);
  return deleteDoc(ref);
}
