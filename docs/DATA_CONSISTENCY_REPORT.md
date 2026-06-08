# Data Consistency Report

**Generated:** 2026-06-04  
**Source:** `data/*.json` vs `prisma/schema.prisma` vs `prisma/seed.js`

## Seed data sources

| File | Target model | Import function |
|------|--------------|-----------------|
| `data/registrations.json` | User | `importUsers` |
| `data/site-content.json` | SiteContent | `importSiteContent` |
| `data/blog-posts.json` | BlogPost | `importBlogPosts` |
| `data/admin-messages.json` | ContactMessage | `importContactMessages` |
| `data/admin-notifications.json` | Notification | `importNotifications` |
| `data/admin-evaluations.json` | Assessment | `importAssessments` |
| `data/founder-submissions.json` | FounderSubmission | `importFounderSubmissions` |
| `data/chat-rooms.json` | ChatRoom | `importChat` |
| `data/chat-messages.json` | ChatMessage | `importChat` |

## Blog content

- Seed maps `title`, `excerpt`, `content`, `slug`, `tags`, `status`, `coverImage`.
- Default status `draft` when missing — verify published posts set `status: 'published'` in JSON for public API.

## Notifications

- `resolveNotificationUserId` drops `userId` when not in `users` table (stores notification without user link).
- Types preserved: `system`, etc.
- Read flag: `isRead` / `read` both accepted.

## Assessments

- Full field parity between JSON snake_case and Prisma camelCase in seed.
- Public API returns same records — **security concern** (see audit C2).

## Chat relations

- Guest users from chat/notifications seeded via `seedGuestUsers`.
- `adminId` on rooms nulled when admin not in DB (`resolveAdminId`).
- Messages reference `roomId` — rooms must be imported first (order correct in `main()`).

## Founder submissions

- Separate from `Assessment` model — duplicate shape by design (onboarding vs admin evaluations).

## Consistency checks to run manually

```bash
npx prisma db seed
npm run db:validate-seed
# In psql: SELECT COUNT(*) FROM blog_posts;
# SELECT COUNT(*) FROM notifications WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users);
```

## Findings

| Check | Status |
|-------|--------|
| Seed order (users before chat/notifications) | OK |
| Blog field mapping | OK |
| Notification orphan userIds | Mitigated (null userId) |
| Chat room admin FK | Soft (nullable, no DB FK) |
| Assessment vs founder duplication | By design |

## Data health: **PASS with warnings** (orphan FK policy, public evaluation leak)
