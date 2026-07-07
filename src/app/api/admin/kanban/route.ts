import { getKanbanBoard } from "@/features/admin/admin-service";
import { fail, ok } from "@/lib/api-response";

export async function GET() {
  try {
    return ok(await getKanbanBoard());
  } catch (error) {
    return fail(error, 500);
  }
}
