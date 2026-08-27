import { getDocument } from "@/app/actions/document";
import Editor from "@/components/Editor";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const doc = await getDocument(id);

  if (!doc) {
    notFound();
  }

  const isOwner = doc.ownerId === session?.user?.id;
  const isSharedEdit = doc.shares.some(s => s.userId === session?.user?.id && s.permission === "EDIT");
  const readOnly = !isOwner && !isSharedEdit;

  return (
    <Editor 
      documentId={doc.id} 
      initialContent={doc.content} 
      title={doc.title}
      readOnly={readOnly}
      isOwner={isOwner}
      shares={doc.shares}
    />
  );
}
