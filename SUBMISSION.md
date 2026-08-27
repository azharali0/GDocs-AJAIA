# Ajaia Candidate Assignment Submission
**Candidate**: Azhar Ali (azharde78@gmail.com)

## Overview
This repository contains the completed "Ajaia Docs" take-home assignment, built within the 4-6 hour timebox constraint. It implements the core requirements of a collaborative document editor with sharing permissions and file upload capabilities.

## What is Complete
- ✅ **Authentication**: Secure credential-based login using NextAuth v5.
- ✅ **Document CRUD**: Full ability to create, read, update, and delete rich-text documents.
- ✅ **Editor**: Custom Tiptap integration with a rich-text toolbar and silent auto-saving functionality (debounced).
- ✅ **Sharing Permissions**: Modal-based sharing system enabling users to invite others to "View" or "Edit" their documents.
- ✅ **File Uploads**: Native support for converting `.docx`, `.txt`, and `.md` files into Tiptap documents using Mammoth.js.
- ✅ **Design**: Premium glassmorphism dark theme using vanilla CSS variables.
- ✅ **Testing**: Vitest unit testing for core API Server Actions.
- ✅ **Deployment-Ready**: Scaffolded securely for Vercel with a Neon Postgres database backing it.

## Known Limitations (Timebox Tradeoffs)
1. **Real-time collaboration (Yjs)**: Building true real-time WebRTC/WebSocket cursor sharing requires external infrastructure (like Hocuspocus or Supabase Realtime). Given the time limit, I prioritized a highly reliable single-player auto-save system that guarantees data integrity over a buggy real-time implementation.
2. **Password Resets / Magic Links**: Excluded in favor of standard seeded credentials to prioritize core editor features.
3. **Advanced Tiptap Extensions**: Image uploads and slash-commands (like Notion) were scoped out to ensure the core sharing and parsing logic was bulletproof.

## How to Test
A Neon Postgres database is already configured in the provided `.env.local` file (if submitted via zip). 
1. Run `npm run dev`.
2. Login with `alice@ajaia.test` (password: `password123`).
3. Explore the dashboard, create a document, type, and watch the top right corner for the "Saved" indicator.
4. Open an incognito window, login with `bob@ajaia.test`, and share the document from Alice to Bob.

Thank you for your consideration!
