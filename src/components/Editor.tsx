"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useEffect, useState, useCallback, useRef } from 'react';
import { updateDocumentContent } from '@/app/actions/document';
import Link from 'next/link';
import ShareModal from './ShareModal';

export default function Editor({ 
  initialContent, 
  documentId, 
  title,
  readOnly = false,
  isOwner = false,
  shares = [],
}: { 
  initialContent: string; 
  documentId: string;
  title: string;
  readOnly?: boolean;
  isOwner?: boolean;
  shares?: any[];
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Debounce save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveContent = useCallback(async (content: string) => {
    if (readOnly) return;
    setIsSaving(true);
    try {
      await updateDocumentContent(documentId, content);
      setLastSaved(new Date());
    } catch (e) {
      console.error("Failed to save:", e);
    } finally {
      setIsSaving(false);
    }
  }, [documentId, readOnly]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: initialContent ? (initialContent.startsWith('{') || initialContent.startsWith('[') ? JSON.parse(initialContent) : initialContent) : '',
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (readOnly) return;
      const json = editor.getJSON();
      
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(() => {
        saveContent(JSON.stringify(json));
      }, 1000); // 1s debounce
    },
  });

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Unified Floating Editor Navbar */}
      <div style={{ padding: "24px", display: "flex", justifyContent: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <header style={{ 
          padding: "8px 12px", 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          backgroundColor: "#1f1f1f",
          borderRadius: "32px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.15), 0 5px 15px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "1000px"
        }}>
          {/* Left section: Back & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{ 
              color: '#fff', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none'
            }}>
              ← Dashboard
            </Link>
            <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
            <h1 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </h1>
            {readOnly && (
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '999px', color: '#ccc' }}>
                Read Only
              </span>
            )}
          </div>

          {/* Middle section: Toolbar */}
          {!readOnly && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '4px',
              borderRadius: '999px',
            }}>
              {[
                { label: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
                { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
                { label: 'U', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
                { label: '|', divider: true },
                { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
                { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
                { label: '|', divider: true },
                { label: '•', action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
              ].map((btn, i) => btn.divider ? (
                <div key={i} style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 4px' }}></div>
              ) : (
                <button
                  key={i}
                  onClick={btn.action}
                  style={{
                    background: btn.active ? 'rgba(255,255,255,0.2)' : 'transparent',
                    border: 'none',
                    color: '#fff',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: btn.active ? 700 : 500,
                  }}
                  onMouseEnter={(e) => { if (!btn.active) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                  onMouseLeave={(e) => { if (!btn.active) e.currentTarget.style.background = 'transparent' }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
          
          {/* Right section: Status & Share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.875rem', color: '#ccc' }}>
            {isSaving ? (
              <span style={{ color: '#ff9900' }}>Saving...</span>
            ) : lastSaved ? (
              <span>Saved</span>
            ) : (
              <span>Saved</span>
            )}

            {isOwner && (
              <button 
                style={{ 
                  padding: '8px 20px', 
                  fontSize: '0.875rem', 
                  backgroundColor: '#fff', 
                  color: '#111', 
                  border: 'none', 
                  borderRadius: '999px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => setShowShareModal(true)}
              >
                Share
              </button>
            )}
          </div>
        </header>
      </div>

      {/* Editor Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', display: 'flex', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '816px', // Standard 8.5 inch width approx
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(60,64,67,0.15), 0 1px 2px rgba(60,64,67,0.30)',
          padding: '48px 32px', // Responsive margins
          minHeight: '1056px', // 11 inches height
        }}>
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      </main>

      {showShareModal && (
        <ShareModal 
          documentId={documentId} 
          shares={shares} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
}
