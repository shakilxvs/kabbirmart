import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "Admin — KabbirMart",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return (
    <div className="min-h-screen bg-bone font-sans">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
