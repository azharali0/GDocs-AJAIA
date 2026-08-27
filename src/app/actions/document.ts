"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getDocuments() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [myDocs, sharedDocs] = await Promise.all([
    prisma.document.findMany({
      where: { ownerId: session.user.id },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.share.findMany({
      where: { userId: session.user.id },
      include: {
        document: {
          include: {
            owner: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: {
        document: { updatedAt: "desc" },
      },
    }),
  ]);

  return { myDocs, sharedDocs: sharedDocs.map((s) => s.document) };
}

export async function createDocument(title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const doc = await prisma.document.create({
    data: {
      title,
      ownerId: session.user.id,
      content: JSON.stringify({ type: "doc", content: [{ type: "paragraph" }] }),
    },
  });

  revalidatePath("/dashboard");
  return doc;
}

export async function getDocument(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const doc = await prisma.document.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, email: true } },
      shares: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
  });

  if (!doc) return null;

  // Check access
  const isOwner = doc.ownerId === session.user.id;
  const isShared = doc.shares.some((s) => s.userId === session.user.id);
  
  if (!isOwner && !isShared) throw new Error("Unauthorized");

  return doc;
}

export async function updateDocumentContent(id: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Basic access check
  const doc = await prisma.document.findUnique({
    where: { id },
    include: { shares: true },
  });

  if (!doc) throw new Error("Not found");
  
  const isOwner = doc.ownerId === session.user.id;
  const isShared = doc.shares.some(s => s.userId === session.user.id && s.permission === "EDIT");
  
  if (!isOwner && !isShared) throw new Error("Unauthorized or Read Only");

  await prisma.document.update({
    where: { id },
    data: { content },
  });
  
  revalidatePath(`/dashboard`);
  revalidatePath(`/editor/${id}`);
}

export async function deleteDocument(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc || doc.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.document.delete({ where: { id } });
  revalidatePath("/dashboard");
}
