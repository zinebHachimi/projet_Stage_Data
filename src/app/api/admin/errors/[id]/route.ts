import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = (await request.json().catch(() => ({}))) as { resolved?: boolean };
    return ok(await prisma.errorLog.update({
      where: { id: (await params).id },
      data: { resolvedAt: body.resolved === false ? null : new Date() },
    }));
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    return ok(await prisma.errorLog.delete({ where: { id: (await params).id } }));
  } catch (error) {
    return fail(error);
  }
}
