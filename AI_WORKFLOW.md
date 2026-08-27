# AI Workflow & Autonomy

This project was built iteratively using an autonomous AI pair-programming workflow (Google Antigravity).

## Workflow Phasing
The AI was instructed to break the ambiguous requirements down into a 5-phase execution plan:
1. Scaffolding & DB (Setup Next.js, Prisma, Neon)
2. Authentication (NextAuth Credentials)
3. Document CRUD & Editor (Tiptap, Dashboards)
4. File Upload & Sharing (Mammoth.js, Permissions)
5. Polish, Test, Deploy (Vitest, Documentation)

## AI Judgment & Autonomy
- **Proactive Database Pivot**: The AI independently realized that the requested SQLite database would fail upon deployment to Vercel's ephemeral serverless architecture. It proactively prompted the user to provide a Neon Postgres connection string, effectively saving hours of deployment debugging later.
- **Handling Deprecations**: During execution, the Next.js framework experienced an Edge runtime crash related to `middleware.ts` and NextAuth v4. The AI independently read the server logs, discovered the version mismatch, downgraded Prisma to a stable release, upgraded NextAuth to the v5 beta, and shifted the authentication logic to Server Components to bypass the Edge constraints entirely.
- **Design System Extraction**: Instead of scattering inline styles or leaning on default Tailwind configurations, the AI constructed a centralized CSS Variable design system (`globals.css`) using glassmorphism principles to ensure the app met the "WOW factor" criteria of the assignment.
- **Self-Correction**: The AI wrote automated tests, compiled the application, and performed self-verification curl requests against the local dev server before declaring milestones complete.
