"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#05070d] px-6 text-white">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-100">
          Error
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Something went wrong</h1>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
