import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/utils";

const CATEGORIES = "categories";

function withId(snap) {
  return { id: snap.id, ...snap.data() };
}

export async function getAllCategories() {
  const snap = await getDocs(query(collection(db, CATEGORIES), orderBy("label", "asc")));
  return snap.docs.map(withId);
}

export async function createCategory(label) {
  const slug = slugify(label);
  return addDoc(collection(db, CATEGORIES), { label, slug, createdAt: Date.now() });
}

export async function deleteCategory(id) {
  return deleteDoc(doc(db, CATEGORIES, id));
}
