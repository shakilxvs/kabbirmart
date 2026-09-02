import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_SETTINGS, DEFAULT_HOMEPAGE } from "@/lib/data";

const SETTINGS_DOC = doc(db, "settings", "store");
const HOMEPAGE_DOC = doc(db, "settings", "homepage");

export async function getStoreSettings() {
  const snap = await getDoc(SETTINGS_DOC);
  if (!snap.exists()) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...snap.data() };
}

export async function updateStoreSettings(data) {
  return setDoc(SETTINGS_DOC, data, { merge: true });
}

export async function getHomepageContent() {
  const snap = await getDoc(HOMEPAGE_DOC);
  if (!snap.exists()) return DEFAULT_HOMEPAGE;
  return { ...DEFAULT_HOMEPAGE, ...snap.data() };
}

export async function updateHomepageContent(data) {
  return setDoc(HOMEPAGE_DOC, data, { merge: true });
}
