import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#05070d] px-6 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-100">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Route not found</h1>
        <p className="mt-4 text-white/60">
          The requested workspace route is not available.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
