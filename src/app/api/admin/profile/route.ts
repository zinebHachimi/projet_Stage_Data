import { fail, ok } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/current-user";
import { getProfile, updateProfile } from "@/features/admin/admin-service";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail(new Error("Authentication required"), 401);
    return ok(await getProfile(user.id, user.email, user.name ?? ""));
  } catch (error) {
    return fail(error, 500);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail(new Error("Authentication required"), 401);
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return ok(await updateProfile(user.id, body));
  } catch (error) {
    return fail(error);
  }
}
