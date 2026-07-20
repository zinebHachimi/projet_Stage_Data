import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
