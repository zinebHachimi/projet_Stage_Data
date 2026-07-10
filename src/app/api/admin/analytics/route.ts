import { getAnalyticsMetrics } from "@/ai/analytics";
import { fail, ok } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return fail("Unauthorized. Please log in.", 401);
    }
    
    const metrics = await getAnalyticsMetrics();
    return ok(metrics);
  } catch (error) {
    return fail(error, 500);
  }
}
