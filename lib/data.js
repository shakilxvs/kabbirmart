// Static reference data used across the app.

// Default categories, seeded into Firestore's "categories" collection via
// the admin "Load default data" button. After seeding, categories are
// managed from /admin/categories — this array is only the starting set.
export const SEED_CATEGORIES = [
  { label: "Earbuds" },
  { label: "Smart Watches" },
  { label: "Speakers" },
  { label: "Power Banks" },
  { label: "Chargers" },
  { label: "Cables" },
  { label: "Phone Accessories" },
  { label: "Gadgets" },
];

// Bangladesh divisions -> districts (kept short and practical, not exhaustive).
export const BD_DIVISIONS = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Manikganj", "Munshiganj"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Noakhali", "Rangamati"],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna", "Sirajganj", "Natore", "Joypurhat"],
  Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Kushtia", "Narail"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Barguna"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Thakurgaon"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

// Seed data — pushed to Firestore once via the "Load default data" button
// in /admin, so the store looks complete on first load. After seeding, all
// product data lives in Firestore and is managed from /admin.
export const SEED_PRODUCTS = [
  {
    name: "Aria Pro Wireless Earbuds",
    slug: "aria-pro-wireless-earbuds",
    price: 3490,
    discountPrice: 2990,
    description:
      "Active noise cancelling earbuds with a 32-hour total battery life, IPX5 sweat resistance, and a pocket-sized charging case finished in soft-touch matte plastic.",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&q=80"],
    stock: 24,
    category: "earbuds",
    featured: true,
    trending: true,
    available: true,
  },
  {
    name: "Pulse Fit Smart Watch",
    slug: "pulse-fit-smart-watch",
    price: 4990,
    discountPrice: 3990,
    description:
      "A 1.4-inch AMOLED smart watch with heart-rate and SpO2 tracking, 7-day battery life, and 100+ workout modes. Compatible with Android and iOS.",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80"],
    stock: 18,
    category: "smart-watches",
    featured: true,
    trending: true,
    available: true,
  },
  {
    name: "Orbit Mini Bluetooth Speaker",
    slug: "orbit-mini-bluetooth-speaker",
    price: 1990,
    discountPrice: null,
    description:
      "A palm-sized speaker with surprisingly deep bass, 12-hour playtime, and IPX6 water resistance — built for the beach, the shower, and everywhere in between.",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1000&q=80"],
    stock: 30,
    category: "speakers",
    featured: true,
    trending: false,
    available: true,
  },
  {
    name: "Voyage 20000mAh Power Bank",
    slug: "voyage-20000mah-power-bank",
    price: 2490,
    discountPrice: 2190,
    description:
      "20000mAh high-capacity power bank with 22.5W fast charging and dual USB output — enough to charge a phone five times over.",
    images: ["https://images.unsplash.com/photo-1609592806955-d69355f60c1e?w=1000&q=80"],
    stock: 40,
    category: "power-banks",
    featured: false,
    trending: true,
    available: true,
  },
  {
    name: "Volt 30W Fast Charger",
    slug: "volt-30w-fast-charger",
    price: 990,
    discountPrice: null,
    description:
      "A compact 30W GaN charger that fits in your pocket, with intelligent power delivery for phones, tablets, and laptops.",
    images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1000&q=80"],
    stock: 50,
    category: "chargers",
    featured: false,
    trending: false,
    available: true,
  },
  {
    name: "Weave Braided USB-C Cable (1.2m)",
    slug: "weave-braided-usb-c-cable",
    price: 490,
    discountPrice: null,
    description:
      "A durable nylon-braided USB-C cable rated for 20,000+ bends, supporting fast charging and data transfer.",
    images: ["https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?w=1000&q=80"],
    stock: 80,
    category: "cables",
    featured: false,
    trending: false,
    available: true,
  },
  {
    name: "Halo MagSafe Wallet Stand",
    slug: "halo-magsafe-wallet-stand",
    price: 1290,
    discountPrice: 990,
    description:
      "A magnetic leather card holder that snaps onto the back of your phone and folds out into a kickstand.",
    images: ["https://images.unsplash.com/photo-1601593346740-925612772716?w=1000&q=80"],
    stock: 35,
    category: "phone-accessories",
    featured: true,
    trending: false,
    available: true,
  },
  {
    name: "Clip-On Ring Light Mini",
    slug: "clip-on-ring-light-mini",
    price: 890,
    discountPrice: null,
    description:
      "A rechargeable 3-inch clip-on ring light with 3 brightness modes — perfect for video calls and content on the go.",
    images: ["https://images.unsplash.com/photo-1616423641454-6ba86b8b8dfc?w=1000&q=80"],
    stock: 22,
    category: "gadgets",
    featured: false,
    trending: true,
    available: true,
  },
  {
    name: "Anchor Phone Mount for Car",
    slug: "anchor-phone-mount-for-car",
    price: 790,
    discountPrice: null,
    description:
      "A one-hand, spring-loaded car vent mount that holds any phone securely on rough roads.",
    images: ["https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=1000&q=80"],
    stock: 28,
    category: "phone-accessories",
    featured: false,
    trending: false,
    available: true,
  },
  {
    name: "Nimbus Noise-Isolating Headphones",
    slug: "nimbus-noise-isolating-headphones",
    price: 3290,
    discountPrice: 2790,
    description:
      "Over-ear headphones with plush memory-foam cushions, 40-hour battery life, and a folding design for travel.",
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&q=80"],
    stock: 15,
    category: "earbuds",
    featured: false,
    trending: false,
    available: true,
  },
  {
    name: "Flux 4-Port USB Hub",
    slug: "flux-4-port-usb-hub",
    price: 690,
    discountPrice: null,
    description:
      "A slim aluminium 4-port USB 3.0 hub that turns one port into four — ideal for laptops with limited connectivity.",
    images: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=1000&q=80"],
    stock: 33,
    category: "gadgets",
    featured: false,
    trending: false,
    available: true,
  },
  {
    name: "Aster Kids Smart Watch",
    slug: "aster-kids-smart-watch",
    price: 2290,
    discountPrice: 1890,
    description:
      "A durable, colourful smart watch for kids with step tracking, games, and a 2-day battery — no app or SIM required.",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1000&q=80"],
    stock: 20,
    category: "smart-watches",
    featured: false,
    trending: false,
    available: true,
  },
];

export const DEFAULT_SETTINGS = {
  storeName: "KabbirMart",
  storePhone: "+880 1XXX-XXXXXX",
  storeEmail: "hello@kabbirmart.com",
  storeAddress: "Bogra, Rajshahi Division, Bangladesh",
  deliveryCharge: 70,
  deliveryChargeDhaka: 60,
  codCharge: 0,
};

export const DEFAULT_HOMEPAGE = {
  heroTitle: "Everyday tech, made to feel considered.",
  heroSubtitle:
    "Earbuds, watches, speakers and small useful gadgets — chosen for how they work, and how they look on your desk.",
  heroImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1400&q=80",
  heroButtonText: "Shop the collection",
  heroButtonLink: "/#featured",
  promoTitle: "Cash on Delivery, everywhere in Bangladesh",
  promoText:
    "Order without a card. Pay in cash when your package arrives at your door — no account, no hassle.",
  promoImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80",
};
