# Ajaia Docs
A collaborative document editor built for AI-Native teams.

## Features
- **Document CRUD**: Create, read, update, and delete documents
- **Collaborative Editor**: Tiptap-based rich text editor with auto-save functionality
- **Authentication**: Secure credential-based login using NextAuth v5
- **File Upload**: Upload `.txt`, `.md`, and `.docx` files seamlessly using Mammoth.js
- **Sharing**: Granular permissions (View/Edit) for collaborating with team members
- **Premium Design**: Dark theme glassmorphism UI

## Tech Stack
- **Framework**: Next.js 14 (App Router, Server Actions)
- **Database**: Neon Postgres + Prisma ORM
- **Authentication**: NextAuth.js (Auth.js) v5
- **Editor**: Tiptap
- **Styling**: Vanilla CSS (CSS Variables)

## Local Setup
1. Clone the repository
2. Run `npm install`
3. Setup your `.env.local` based on `.env.example`
4. Run `npm run db:push` to migrate the database
5. Run `npm run db:seed` to seed test users
6. Run `npm run dev` to start the development server

## Testing
Run `npx vitest` to execute the unit tests for Server Actions.
