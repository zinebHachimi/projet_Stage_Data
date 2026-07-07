import Image from "next/image";
import Link from "next/link";
import { AdminCard } from "@/components/admin/AdminShell";

export default function AdminNotFound() {
  return (
    <AdminCard>
      <div className="mx-auto max-w-xl py-10 text-center">
        <Image src="/admin-assets/images/backgrounds/errorimg.svg" width={320} height={220} alt="404" className="mx-auto" />
        <h2 className="mt-6 text-2xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-[#5a6a85bf]">The dashboard page you requested does not exist.</p>
        <Link href="/admin" className="mt-6 inline-flex rounded-md bg-[#5d87ff] px-5 py-3 font-semibold text-white">
          Back to dashboard
        </Link>
      </div>
    </AdminCard>
  );
}
