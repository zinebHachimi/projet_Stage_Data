import { getDashboardOverview } from "@/features/admin/admin-service";
import { fail, ok } from "@/lib/api-response";

export async function GET() {
  try {
    return ok(await getDashboardOverview());
  } catch (error) {
    return fail(error, 500);
  }
}
