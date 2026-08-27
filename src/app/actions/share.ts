"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Permission } from "@prisma/client";

export async function shareDocument(documentId: string, targetEmail: string, permission: Permission = "VIEW") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify ownership
  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc || doc.ownerId !== session.user.id) {
    throw new Error("Unauthorized or document not found");
  }

  // Find target user
  const targetUser = await prisma.user.findUnique({ where: { email: targetEmail } });
  if (!targetUser) {
    throw new Error("User not found with that email");
  }
  
  if (targetUser.id === session.user.id) {
    throw new Error("Cannot share with yourself");
  }

  // Upsert share
  const share = await prisma.share.upsert({
    where: {
      documentId_userId: {
        documentId,
        userId: targetUser.id,
      },
    },
    update: {
      permission,
    },
    create: {
      documentId,
      userId: targetUser.id,
      permission,
    },
  });

  revalidatePath(`/editor/${documentId}`);
  revalidatePath("/dashboard");
  
  return share;
}

export async function removeShare(documentId: string, targetUserId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc || doc.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.share.delete({
    where: {
      documentId_userId: {
        documentId,
        userId: targetUserId,
      },
    },
  });

  revalidatePath(`/editor/${documentId}`);
  revalidatePath("/dashboard");
}
