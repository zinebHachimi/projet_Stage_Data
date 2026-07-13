import { ErrorSeverity, KanbanPriority } from "@prisma/client";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import { prisma } from "@/lib/prisma";
import { runChatPipeline } from "@/ai/chat";
import { optionalString, requiredDate, requiredInt, requiredString } from "./admin-validation";

const DEFAULT_COLUMNS = ["Backlog", "In Progress", "Review", "Done"];

type AdminProfileDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  company?: string | null;
  website?: string | null;
  avatarUrl: string;
  addressLine?: string | null;
  city?: string | null;
  country: string;
  createdAt: Date;
  updatedAt: Date;
};

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
  
  // Execute the AI Job Chatbot pipeline
  const result = await runChatPipeline(prompt, userId, userId);

  const db = getMongoDb();
  const chatMessagesCollection = db.collection("ChatMessage");

  const validUserObjectId = userId && ObjectId.isValid(userId) ? new ObjectId(userId) : null;

  const userMessageDoc = {
    userId: validUserObjectId,
    role: "user",
    content: prompt,
    metadata: {
      intent: result.intent,
      entities: result.entities as any,
    },
    createdAt: new Date(),
  };

  const assistantMessageDoc = {
    userId: validUserObjectId,
    role: "assistant",
    content: result.reply,
    metadata: {
      intent: result.intent,
      entities: result.entities as any,
      jobs: result.jobs as any,
      metrics: result.metrics as any,
    },
    createdAt: new Date(),
  };

  const userResult = await chatMessagesCollection.insertOne(userMessageDoc);
  const assistantResult = await chatMessagesCollection.insertOne(assistantMessageDoc);

  const userMessage = {
    id: userResult.insertedId.toHexString(),
    ...userMessageDoc,
    userId: userId || null,
  };

  const assistantMessage = {
    id: assistantResult.insertedId.toHexString(),
    ...assistantMessageDoc,
    userId: userId || null,
  };

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
  const db = getMongoDb();
  const profiles = db.collection<AdminProfileDocument>("AdminProfile");
  const users = db.collection<{ _id: ObjectId; role?: string }>("User");
  const userObjectId = new ObjectId(userId);
  const now = new Date();

  let profile = await profiles.findOne({ userId: userObjectId });

  if (!profile) {
    const profileToCreate: AdminProfileDocument = {
      userId: userObjectId,
      title: "Admin",
      phone: null,
      location: null,
      bio: null,
      company: null,
      website: null,
      avatarUrl: "/admin-assets/images/profile/user-1.jpg",
      addressLine: null,
      city: null,
      country: "Morocco",
      createdAt: now,
      updatedAt: now,
    };

    const result = await profiles.insertOne(profileToCreate);
    profile = { ...profileToCreate, _id: result.insertedId };
  }

  const user = await users.findOne({ _id: userObjectId }, { projection: { role: 1 } });

  return {
    id: profile._id?.toHexString() ?? "",
    userId,
    title: profile.title,
    phone: profile.phone ?? null,
    location: profile.location ?? null,
    bio: profile.bio ?? null,
    company: profile.company ?? null,
    website: profile.website ?? null,
    avatarUrl: profile.avatarUrl,
    addressLine: profile.addressLine ?? null,
    city: profile.city ?? null,
    country: profile.country,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    user: { email, name, role: user?.role ?? "ANALYST" },
  };
}

export async function updateProfile(userId: string, body: Record<string, unknown>) {
  const profiles = getMongoDb().collection<AdminProfileDocument>("AdminProfile");
  const userObjectId = new ObjectId(userId);
  const now = new Date();
  const profileData = {
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
    updatedAt: now,
  };

  const existingProfile = await profiles.findOne({ userId: userObjectId });

  if (!existingProfile) {
    const profileToCreate: AdminProfileDocument = {
      userId: userObjectId,
      ...profileData,
      createdAt: now,
    };
    const result = await profiles.insertOne(profileToCreate);
    return { ...profileToCreate, id: result.insertedId.toHexString(), userId };
  }

  await profiles.updateOne({ userId: userObjectId }, { $set: profileData });
  const updatedProfile = await profiles.findOne({ userId: userObjectId });

  return {
    ...updatedProfile,
    id: updatedProfile?._id?.toHexString() ?? "",
    userId,
    _id: undefined,
  };
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
