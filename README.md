# KabbirMart

A simple, mobile-first e-commerce site for a tech gadget shop, built with Next.js (App Router), Firebase (Auth + Firestore), and Tailwind CSS. Cash on Delivery only — no online payments, no customer accounts.

## How to get this live (no terminal needed)

### 1. Upload to GitHub

Create a new repository on GitHub and upload every file/folder in this project through the GitHub website (drag-and-drop or "Add file → Upload files"). Keep the folder structure as-is.

### 2. Import into Vercel

In Vercel, click **Add New → Project**, and import the GitHub repo you just created.

### 3. Add environment variables

Before (or right after) deploying, add these under **Project → Settings → Environment Variables** in Vercel, using the values from **Firebase Console → Project Settings → General → Your apps → SDK setup and configuration**:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

(`.env.example` in this project lists the same variables for reference.)

Deploy. Your site will be live at `your-project.vercel.app`, and the admin panel at `your-project.vercel.app/admin`.

### 4. Set up Firestore security rules

In **Firebase Console → Firestore Database → Rules**, paste in the contents of `firestore.rules` (included in this project) and publish. This lets the public site read products/settings and place orders, while only your signed-in admin account can manage products, orders, and settings.

If you haven't already, also make sure **Firestore Database** exists in your Firebase project, and that **Authentication → Sign-in method → Email/Password** is enabled with your existing admin user.

### 5. Load sample data — one click

Sign in at `your-project.vercel.app/admin` with your existing admin account. The Dashboard will show a **"Load default data"** button — click it once to populate the store with 12 sample products, default delivery/COD charges, and default homepage content, so the site looks complete immediately.

It's safe to click again later — it skips any sample product that already exists.

## What's editable from the admin panel

- **Dashboard** — order/product stats, and the "Load default data" button.
- **Products** — add/edit/delete, image URL(s), price, discount price, description, stock, category, featured/trending flags, available/hidden toggle.
- **Orders** — view all orders and their items, change order status (Pending → Confirmed → Processing → Shipped → Delivered → Cancelled).
- **Homepage** — hero title/subtitle/image/button, promotional section text and image.
- **Settings** — delivery charge (Dhaka vs. outside Dhaka), COD charge, basic store info.

## Notes

- There are intentionally no customer accounts, wishlists, reviews, coupons, or online payments — checkout is Cash on Delivery only, matching the brief.
- Product images are plain URLs (no file upload/storage integration) — paste any publicly accessible image URL from the admin panel.
- The cart is stored in the visitor's browser (localStorage), not in Firestore, so it's per-device.
- The domain isn't hard-coded anywhere, so moving to a custom domain later needs no code changes.
