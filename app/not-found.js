import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-28 text-center">
      <p className="font-display text-[64px] italic leading-none text-ink">404</p>
      <p className="mt-4 text-[15px] text-ink-soft">
        We couldn't find that page.
      </p>
      <Link href="/" className="btn-primary mt-7">
        Back to KabbirMart
      </Link>
    </div>
  );
}
