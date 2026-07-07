import { createErrorLog, listErrorLogs } from "@/features/admin/admin-service";
import { fail, ok } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  try {
    return ok(await listErrorLogs());
  } catch (error) {
    return fail(error, 500);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return ok(await createErrorLog(body, user?.id), { status: 201 });
  } catch (error) {
    return fail(error);
  }
}
