"use client";

import { useState } from "react";
import { shareDocument, removeShare } from "@/app/actions/share";

type ShareModalProps = {
  documentId: string;
  shares: { user: { id: string; name: string | null; email: string }; permission: string }[];
  onClose: () => void;
};

export default function ShareModal({ documentId, shares, onClose }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"VIEW" | "EDIT">("VIEW");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await shareDocument(documentId, email, permission);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to share document");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeShare(documentId, userId);
    } catch (err: any) {
      alert("Failed to remove share: " + err.message);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      backdropFilter: "blur(4px)"
    }} onClick={onClose}>
      
      <div 
        className="glass-panel animate-in" 
        style={{ width: "100%", maxWidth: "480px", padding: "32px" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Share Document</h2>
          <button onClick={onClose} style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>&times;</button>
        </div>

        <form onSubmit={handleShare} style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="User email (e.g. bob@ajaia.test)"
            className="input-field"
            style={{ flex: 1 }}
            required
          />
          <select 
            value={permission} 
            onChange={e => setPermission(e.target.value as "VIEW" | "EDIT")}
            className="input-field"
            style={{ width: "100px", padding: "12px 8px" }}
          >
            <option value="VIEW">View</option>
            <option value="EDIT">Edit</option>
          </select>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "..." : "Share"}
          </button>
        </form>

        {error && (
          <div style={{ color: "var(--danger)", fontSize: "0.875rem", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div>
          <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "16px" }}>People with access</h3>
          
          {shares.length === 0 ? (
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Not shared with anyone yet.</div>
          ) : (
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {shares.map(share => (
                <li key={share.user.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{share.user.name || "User"}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{share.user.email}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>
                      {share.permission.toLowerCase()}
                    </span>
                    <button 
                      onClick={() => handleRemove(share.user.id)}
                      style={{ color: "var(--danger)", fontSize: "0.75rem" }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
