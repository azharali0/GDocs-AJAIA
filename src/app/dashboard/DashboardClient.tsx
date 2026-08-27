"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocument, deleteDocument } from "@/app/actions/document";
import { uploadDocument } from "@/app/actions/upload";
import Link from "next/link";
import { useRef } from "react";

type Doc = {
  id: string;
  title: string;
  updatedAt: Date;
  owner?: { name: string | null; email: string };
};

export default function DashboardClient({ myDocs, sharedDocs }: { myDocs: Doc[], sharedDocs: Doc[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const newDoc = await createDocument("Untitled Document");
      router.push(`/editor/${newDoc.id}`);
    } catch (e) {
      console.error(e);
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const newDocId = await uploadDocument(formData);
      router.push(`/editor/${newDocId}`);
    } catch (err: any) {
      alert("Failed to upload: " + err.message);
      setIsUploading(false);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(id);
    }
  };

  const DocCard = ({ doc, isShared }: { doc: Doc; isShared?: boolean }) => (
    <Link href={`/editor/${doc.id}`} style={{ display: "block", textDecoration: "none" }}>
      <div className="glass-panel" style={{ 
        padding: "24px", 
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        height: "100%"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-glass), 0 0 20px var(--accent-glow)";
        e.currentTarget.style.borderColor = "var(--border-focus)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-glass)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)" }}>{doc.title}</h3>
          {!isShared && (
            <button 
              onClick={(e) => handleDelete(doc.id, e)}
              className="btn-danger"
              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
            >
              Delete
            </button>
          )}
        </div>
        
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "auto" }}>
          {isShared && doc.owner ? (
            <div>Shared by {doc.owner.name || doc.owner.email}</div>
          ) : (
            <div>Last updated {new Date(doc.updatedAt).toLocaleDateString()}</div>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: "none" }} 
            accept=".txt,.md,.docx" 
            onChange={handleFileUpload}
          />
          <button 
            className="btn-secondary" 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading || isCreating}
            style={{ padding: "8px 16px", borderRadius: "999px" }}
          >
            {isUploading ? "Uploading..." : "↑ Upload"}
          </button>
          <button 
            className="btn-primary" 
            onClick={handleCreate} 
            disabled={isCreating || isUploading}
            style={{ padding: "8px 16px", borderRadius: "999px", backgroundColor: "#111", color: "white" }}
          >
            {isCreating ? "Creating..." : "+ New Document"}
          </button>
        </div>
      </div>
      
      <section>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "16px", color: "var(--text-secondary)" }}>My Documents</h2>
        {myDocs.length === 0 ? (
          <div className="glass-panel" style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
            You haven't created any documents yet.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {myDocs.map((doc) => <DocCard key={doc.id} doc={doc} />)}
          </div>
        )}
      </section>

      {sharedDocs.length > 0 && (
        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "16px", color: "var(--text-secondary)" }}>Shared with Me</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {sharedDocs.map((doc) => <DocCard key={doc.id} doc={doc} isShared />)}
          </div>
        </section>
      )}
    </div>
  );
}
