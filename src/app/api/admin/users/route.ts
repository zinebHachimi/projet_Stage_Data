import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { NextResponse } from "next/server";
import { hashPassword } from "@/features/auth/password";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    const body = await request.json();
    const { name, email, role, password } = body;

    if (!email) {
      return NextResponse.json({ error: "L'adresse e-mail est requise" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Un utilisateur avec cette adresse e-mail existe déjà" }, { status: 400 });
    }

    const created = await prisma.user.create({
      data: {
        name,
        email,
        role: role || "VIEWER",
        passwordHash: hashPassword(password || "AlgoJobDefault2026!"),
      },
    });

    return NextResponse.json({ user: created });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    const { userId, role, name } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "Identifiant utilisateur requis" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        name,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "Identifiant utilisateur requis" }, { status: 400 });
    }

    if (userId === user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte administrateur" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
