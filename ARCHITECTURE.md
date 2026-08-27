# Architecture & Tradeoffs

## Architecture Overview
Ajaia Docs is a monolithic Next.js application leveraging the App Router. The architecture is designed to be fully serverless-compatible, scaling on Vercel while persisting data on Neon Postgres.

### Data Layer
- **Neon Postgres**: Chosen for its robust connection pooling (perfect for serverless Vercel environments) and branching capabilities.
- **Prisma ORM**: Provides strict type safety from the database to the frontend.

### Authentication
- **NextAuth.js v5 (Auth.js)**: Implemented using the Credentials provider. It utilizes a stateless JWT strategy, which minimizes database roundtrips for session checks.
- **Security**: Passwords are cryptographically hashed using `bcryptjs`. We avoided Edge-Middleware for Prisma due to runtime incompatibilities, opting instead for robust `layout.tsx` Server Component checks.

### Editor & Collaboration
- **Tiptap**: A headless wrapper around ProseMirror. Tiptap provides complete control over the editor UI while ensuring the content schema is strictly managed.
- **Auto-Save**: The editor debounces keystrokes (1s) and uses Server Actions to silently persist data in the background without refreshing the client state.
- **File Parsing**: We use `mammoth.js` natively on the server to consume standard `.docx` files into HTML, which Tiptap natively hydrates into its document schema.

## Tradeoffs Made
1. **Polling vs WebSockets**: Due to the Vercel serverless environment constraint and the 4-6 hour timebox, real-time cursor sync via WebSockets (e.g., Yjs or Hocuspocus) was omitted. Instead, we optimized for a solid "single-player" auto-save experience with granular sharing permissions.
2. **Vanilla CSS vs Tailwind**: To guarantee a highly customized, non-templated premium design (glassmorphism), we opted for scoped Vanilla CSS with CSS variables over utility classes.
3. **Database Selection**: Vercel's ephemeral filesystem made SQLite impossible for production. Neon Postgres was the optimal serverless choice.
