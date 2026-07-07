import { ErrorSeverity, KanbanPriority } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseChatIntent } from "@/features/chat/intent";
import { optionalString, requiredDate, requiredInt, requiredString } from "./admin-validation";

const DEFAULT_COLUMNS = ["Backlog", "In Progress", "Review", "Done"];

export async function getDashboardOverview() {
  const [users, offers, queries, recentQueries, recentOffers, errors, events, cards] = await Promise.all([
    prisma.user.count(),
    prisma.jobOffer.count(),
    prisma.queryHistory.count(),
    prisma.queryHistory.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.jobOffer.findMany({ orderBy: { collectedAt: "desc" }, take: 5 }),
    prisma.errorLog.count({ where: { resolvedAt: null } }),
    prisma.calendarEvent.count({ where: { startsAt: { gte: new Date() } } }),
    prisma.kanbanCard.count(),
  ]);

  const byCity = await prisma.jobOffer.groupBy({
    by: ["city"],
    _count: { city: true },
    orderBy: { _count: { city: "desc" } },
    take: 6,
  });

  return { users, offers, queries, errors, events, cards, byCity, recentQueries, recentOffers };
}

export async function listChatMessages(userId?: string) {
  return prisma.chatMessage.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "asc" },
    take: 100,
  });
}

export async function createChatMessage(content: unknown, userId?: string) {
  const prompt = requiredString(content, "Message", 2000);
  const intent = parseChatIntent(prompt);
  const userMessage = await prisma.chatMessage.create({
    data: { userId, role: "user", content: prompt, metadata: { intent } },
  });
  const reply = `I found a ${intent.role} request for ${intent.country}. You can launch a gather job from the public workflow, then monitor offers and query history here.`;
  const assistantMessage = await prisma.chatMessage.create({
    data: { userId, role: "assistant", content: reply, metadata: { nextAction: "/api/gather", intent } },
  });
  return { userMessage, assistantMessage };
}

export async function listCalendarEvents(userId?: string) {
  return prisma.calendarEvent.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { startsAt: "asc" },
  });
}

export async function createCalendarEvent(body: Record<string, unknown>, userId?: string) {
  const startsAt = requiredDate(body.startsAt, "Start date");
  const endsAt = requiredDate(body.endsAt, "End date");
  if (endsAt <= startsAt) throw new Error("End date must be after start date");
  return prisma.calendarEvent.create({
    data: {
      userId,
      title: requiredString(body.title, "Title"),
      description: optionalString(body.description),
      location: optionalString(body.location, 160),
      color: optionalString(body.color, 32) ?? "primary",
      startsAt,
      endsAt,
    },
  });
}

export async function updateCalendarEvent(id: string, body: Record<string, unknown>) {
  const startsAt = requiredDate(body.startsAt, "Start date");
  const endsAt = requiredDate(body.endsAt, "End date");
  if (endsAt <= startsAt) throw new Error("End date must be after start date");
  return prisma.calendarEvent.update({
    where: { id },
    data: {
      title: requiredString(body.title, "Title"),
      description: optionalString(body.description),
      location: optionalString(body.location, 160),
      color: optionalString(body.color, 32) ?? "primary",
      startsAt,
      endsAt,
    },
  });
}

export async function getProfile(userId: string, email: string, name: string) {
  return prisma.adminProfile.upsert({
    where: { userId },
    update: {},
    create: { userId, title: "Admin", bio: null, city: null, country: "Morocco" },
    include: { user: { select: { email: true, name: true, role: true } } },
  }).then((profile) => ({
    ...profile,
    user: { email, name, role: profile.user.role },
  }));
}

export async function updateProfile(userId: string, body: Record<string, unknown>) {
  return prisma.adminProfile.upsert({
    where: { userId },
    create: {
      userId,
      title: requiredString(body.title, "Title", 120),
      phone: optionalString(body.phone, 60),
      location: optionalString(body.location, 160),
      bio: optionalString(body.bio),
      company: optionalString(body.company, 120),
      website: optionalString(body.website, 240),
      avatarUrl: optionalString(body.avatarUrl, 240) ?? "/admin-assets/images/profile/user-1.jpg",
      addressLine: optionalString(body.addressLine, 240),
      city: optionalString(body.city, 120),
      country: optionalString(body.country, 120) ?? "Morocco",
    },
    update: {
      title: requiredString(body.title, "Title", 120),
      phone: optionalString(body.phone, 60),
      location: optionalString(body.location, 160),
      bio: optionalString(body.bio),
      company: optionalString(body.company, 120),
      website: optionalString(body.website, 240),
      avatarUrl: optionalString(body.avatarUrl, 240) ?? "/admin-assets/images/profile/user-1.jpg",
      addressLine: optionalString(body.addressLine, 240),
      city: optionalString(body.city, 120),
      country: optionalString(body.country, 120) ?? "Morocco",
    },
  });
}

export async function getKanbanBoard() {
  const count = await prisma.kanbanColumn.count();
  if (count === 0) {
    await prisma.kanbanColumn.createMany({
      data: DEFAULT_COLUMNS.map((title, position) => ({ title, position })),
    });
  }
  return prisma.kanbanColumn.findMany({
    orderBy: { position: "asc" },
    include: { cards: { orderBy: { position: "asc" } } },
  });
}

export async function createKanbanCard(body: Record<string, unknown>, userId?: string) {
  const columnId = requiredString(body.columnId, "Column");
  const position = await prisma.kanbanCard.count({ where: { columnId } });
  return prisma.kanbanCard.create({
    data: {
      columnId,
      userId,
      title: requiredString(body.title, "Title"),
      description: optionalString(body.description),
      priority: (String(body.priority ?? "MEDIUM").toUpperCase() as KanbanPriority) || KanbanPriority.MEDIUM,
      imageUrl: optionalString(body.imageUrl, 240),
      dueDate: body.dueDate ? requiredDate(body.dueDate, "Due date") : null,
      position,
    },
  });
}

export async function updateKanbanCard(id: string, body: Record<string, unknown>) {
  return prisma.kanbanCard.update({
    where: { id },
    data: {
      columnId: body.columnId ? requiredString(body.columnId, "Column") : undefined,
      title: body.title ? requiredString(body.title, "Title") : undefined,
      description: "description" in body ? optionalString(body.description) : undefined,
      priority: body.priority ? (String(body.priority).toUpperCase() as KanbanPriority) : undefined,
      imageUrl: "imageUrl" in body ? optionalString(body.imageUrl, 240) : undefined,
      dueDate: body.dueDate ? requiredDate(body.dueDate, "Due date") : undefined,
      position: body.position == null ? undefined : requiredInt(body.position, "Position"),
    },
  });
}

export async function listErrorLogs() {
  return prisma.errorLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}

export async function createErrorLog(body: Record<string, unknown>, userId?: string) {
  return prisma.errorLog.create({
    data: {
      userId,
      statusCode: requiredInt(body.statusCode, "Status code"),
      title: requiredString(body.title, "Title"),
      message: requiredString(body.message, "Message", 2000),
      severity: (String(body.severity ?? "ERROR").toUpperCase() as ErrorSeverity) || ErrorSeverity.ERROR,
      path: optionalString(body.path, 240),
      stack: optionalString(body.stack, 4000),
    },
  });
}
