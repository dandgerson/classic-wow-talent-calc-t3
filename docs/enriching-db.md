# Enriching Your PostgreSQL Database with T3 Stack & Prisma

To enhance your existing PostgreSQL database for use with a T3 Stack application (Next.js + TypeScript + tRPC) using Prisma ORM, follow this comprehensive guide:

## 1. Set Up Prisma in Your T3 App

First, ensure you have Prisma installed in your T3 application:

```bash
npm install -D prisma
npx prisma init
```

## 2. Configure Prisma Connection

Update your `prisma/schema.prisma` file with your PostgreSQL connection:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Your `.env` file should include:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

## 3. Model Your Existing Schema in Prisma

Based on your tables (`Post`, `User`, `Account`, `Session`, `VerificationToken`), here's a Prisma schema:

```prisma
model User {
  id            String         @id @default(uuid())
  name          String?
  email         String?       @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  createdAt     DateTime      @default(now()) @map("createdAt")
  updatedAt     DateTime      @updatedAt @map("updatedAt")
}

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now()) @map("createdAt")
  updatedAt DateTime @updatedAt @map("updatedAt")

  @@map("Post")
}
```

## 4. Push Changes to Database

To sync your Prisma schema with your PostgreSQL database:

```bash
npx prisma db push
```

## 5. Generate Prisma Client

```bash
npx prisma generate
```

## 6. Enrich Your Database

### Add New Tables/Columns

Add to your `schema.prisma`:

```prisma
model Category {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}
```

### Add Relationships

Update your `Post` model:

```prisma
model Post {
  // ... existing fields
  categories Category[]
  comments   Comment[]
}
```

## 7. Create Prisma Migration

```bash
npx prisma migrate dev --name "add_categories_and_comments"
```

## 8. Integrate with T3 Stack

### Set Up tRPC Routers

Create a new router for posts in `src/server/api/routers/post.ts`:

```typescript
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: { author: true, categories: true },
      orderBy: { createdAt: "desc" },
    });
  }),
  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.session.user.id,
        },
      });
    }),
});
```

### Add to Main Router

In `src/server/api/root.ts`:

```typescript
import { postRouter } from "./routers/post";
export const appRouter = router({
  post: postRouter,
  // ... other routers
});
```

## 9. Advanced Features

### Add Soft Delete

```prisma
model Post {
  // ... existing fields
  deletedAt DateTime?
}
```

### Add Full-Text Search

```prisma
model Post {
  // ... existing fields
  @@fulltext([title, content])
}
```

## 10. Deploy Changes

For production:

```bash
npx prisma migrate deploy
```

## Best Practices

1. **Always use migrations** for production schema changes
2. **Keep your schema version-controlled** with your application code
3. **Use Prisma Studio** for data inspection:
   ```bash
   npx prisma studio
   ```
4. **Consider Row-Level Security** for multi-tenant applications

Would you like me to elaborate on any specific aspect of this integration?
