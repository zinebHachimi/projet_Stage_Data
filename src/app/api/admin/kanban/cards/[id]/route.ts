import { prisma } from "@/lib/prisma";
import { updateKanbanCard } from "@/features/admin/admin-service";
import { fail, ok } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return ok(await updateKanbanCard((await params).id, body));
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    return ok(await prisma.kanbanCard.delete({ where: { id: (await params).id } }));
  } catch (error) {
    return fail(error);
  }
}
