# Handling with DB with DBeaver and pgAdmin 4

Check all tables:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
```

## Querying All Posts

To select all posts from your Post table:

```sql
-- Basic query to get all posts
SELECT * FROM public."Post";
```

## Recommended Improved Queries:

With specific columns (better performance):

```sql
SELECT id, title, content, "createdAt", "updatedAt", "authorId"
FROM public."Post";
```

With ordering (newest first):

```sql
SELECT * FROM public."Post"
ORDER BY "createdAt" DESC;
```

With pagination (for large datasets):

```sql
SELECT * FROM public."Post"
ORDER BY "createdAt" DESC
LIMIT 50 OFFSET 0;  -- First 50 posts
```

With author information (if you need user details):

```sql
SELECT p.*, u.name as author_name, u.email
FROM public."Post" p
JOIN public."User" u ON p."authorId" = u.id;
```

## Important Notes:

- Notice the double quotes around "Post", "createdAt", etc. - this is necessary because PostgreSQL preserves case sensitivity with quotes
- The User table appears to contain your authors based on the table list
- The "authorId" column in Post likely references id in User

---
