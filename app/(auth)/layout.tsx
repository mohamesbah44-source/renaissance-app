import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <Link
        href="/"
        className="mb-10 font-rr-display text-2xl italic tracking-wide text-rr-ivoire transition-colors hover:text-rr-ivoire"
      >
        Renaissance
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
