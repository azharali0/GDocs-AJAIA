"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import mammoth from "mammoth";

export async function uploadDocument(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  let htmlContent = "";

  const buffer = Buffer.from(await file.arrayBuffer());

  if (extension === "txt" || extension === "md") {
    // Basic text parsing
    const text = buffer.toString("utf-8");
    htmlContent = `<p>${text.replace(/\n/g, "<br/>")}</p>`;
  } else if (extension === "docx") {
    // Parse docx using mammoth
    try {
      const result = await mammoth.convertToHtml({ buffer });
      htmlContent = result.value;
    } catch (e) {
      console.error("Mammoth parsing error", e);
      throw new Error("Failed to parse docx file");
    }
  } else {
    throw new Error("Unsupported file type");
  }

  // Tiptap can consume HTML directly, so we just wrap it in a root node
  // However, Tiptap JSON format is what we've been storing. 
  // Wait, Tiptap can accept HTML on init if we pass it HTML, but our Editor expects JSON. 
  // Actually, we can just store the HTML as a string and pass it to Tiptap's `content` prop!
  // Tiptap handles both HTML strings and JSON objects.
  
  const doc = await prisma.document.create({
    data: {
      title,
      ownerId: session.user.id,
      content: htmlContent, // Storing HTML string
    },
  });

  revalidatePath("/dashboard");
  return doc.id;
}
