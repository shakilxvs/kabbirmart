import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateOrderNumber } from "@/lib/utils";

const ORDERS = "orders";

function withId(snap) {
  return { id: snap.id, ...snap.data() };
}

export async function createOrder({ items, customer, subtotal, deliveryCharge, codCharge }) {
  const orderNumber = generateOrderNumber();
  const total = subtotal + deliveryCharge + codCharge;
  const payload = {
    orderNumber,
    items,
    customer,
    subtotal,
    deliveryCharge,
    codCharge,
    total,
    status: "Pending",
    createdAt: Date.now(),
  };
  const ref = await addDoc(collection(db, ORDERS), payload);
  return { id: ref.id, ...payload };
}

export async function getAllOrders() {
  const snap = await getDocs(
    query(collection(db, ORDERS), orderBy("createdAt", "desc"))
  );
  return snap.docs.map(withId);
}

export async function getOrderById(id) {
  const ref = doc(db, ORDERS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return withId(snap);
}

export async function updateOrderStatus(id, status) {
  const ref = doc(db, ORDERS, id);
  return updateDoc(ref, { status });
}
