import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create 3 test users with bcrypt-hashed passwords
  const password = await hash("password123", 12);

  const alice = await prisma.user.upsert({
    where: { email: "alice@ajaia.test" },
    update: {},
    create: {
      name: "Alice Johnson",
      email: "alice@ajaia.test",
      password,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@ajaia.test" },
    update: {},
    create: {
      name: "Bob Smith",
      email: "bob@ajaia.test",
      password,
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: "charlie@ajaia.test" },
    update: {},
    create: {
      name: "Charlie Davis",
      email: "charlie@ajaia.test",
      password,
    },
  });

  // Create sample documents for Alice
  const welcomeDoc = await prisma.document.upsert({
    where: { id: "seed-doc-welcome" },
    update: {},
    create: {
      id: "seed-doc-welcome",
      title: "Welcome to Ajaia Docs",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Welcome to Ajaia Docs" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "This is a collaborative document editor built for the Ajaia LLC assignment. You can create, edit, and share documents with your team.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Features" }],
          },
          {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Rich Text Editing",
                      },
                      {
                        type: "text",
                        text: " — Bold, italic, underline, headings, and lists",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "File Upload",
                      },
                      {
                        type: "text",
                        text: " — Import .txt, .md, and .docx files",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Sharing",
                      },
                      {
                        type: "text",
                        text: " — Share documents with other users by email",
                      },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        marks: [{ type: "bold" }],
                        text: "Auto-Save",
                      },
                      {
                        type: "text",
                        text: " — Changes are saved automatically as you type",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                marks: [{ type: "italic" }],
                text: "Try editing this document or creating a new one from the dashboard!",
              },
            ],
          },
        ],
      },
      ownerId: alice.id,
    },
  });

  const projectDoc = await prisma.document.upsert({
    where: { id: "seed-doc-project" },
    update: {},
    create: {
      id: "seed-doc-project",
      title: "Project Planning Notes",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Q3 Project Planning" }],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Key milestones and deliverables for the upcoming quarter.",
              },
            ],
          },
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "Timeline" }],
          },
          {
            type: "orderedList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "Week 1-2: Research and design" },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "Week 3-4: Core implementation" },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "Week 5-6: Testing and polish" },
                    ],
                  },
                ],
              },
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      { type: "text", text: "Week 7-8: Launch and iterate" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      ownerId: alice.id,
    },
  });

  // Share the project doc with Bob
  await prisma.share.upsert({
    where: {
      documentId_userId: {
        documentId: projectDoc.id,
        userId: bob.id,
      },
    },
    update: {},
    create: {
      documentId: projectDoc.id,
      userId: bob.id,
    },
  });

  console.log("✅ Seeded users:");
  console.log(`   Alice Johnson  — alice@ajaia.test   (password123)`);
  console.log(`   Bob Smith      — bob@ajaia.test     (password123)`);
  console.log(`   Charlie Davis  — charlie@ajaia.test  (password123)`);
  console.log("");
  console.log("✅ Seeded documents:");
  console.log(`   "${welcomeDoc.title}" (owned by Alice)`);
  console.log(`   "${projectDoc.title}" (owned by Alice, shared with Bob)`);
  console.log("");
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
