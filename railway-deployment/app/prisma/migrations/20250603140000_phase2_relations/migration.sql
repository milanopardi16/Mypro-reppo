-- Phase 2: relations, defaults, auth email

-- User: add auth_email, default cuid id for new rows
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "auth_email" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "users_auth_email_key" ON "users"("auth_email");

-- Notification: actor_ref for legacy external identifiers
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "actor_ref" TEXT;
CREATE INDEX IF NOT EXISTS "notifications_user_id_idx" ON "notifications"("user_id");

-- PushToken: user/admin ownership
ALTER TABLE "push_tokens" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "push_tokens" ADD COLUMN IF NOT EXISTS "admin_id" TEXT;
CREATE INDEX IF NOT EXISTS "push_tokens_user_id_idx" ON "push_tokens"("user_id");
CREATE INDEX IF NOT EXISTS "push_tokens_admin_id_idx" ON "push_tokens"("admin_id");

-- ChatRoom indexes for relations
CREATE INDEX IF NOT EXISTS "chat_rooms_user_id_idx" ON "chat_rooms"("user_id");
CREATE INDEX IF NOT EXISTS "chat_rooms_admin_id_idx" ON "chat_rooms"("admin_id");

-- Foreign keys (idempotent via DO blocks)
DO $$ BEGIN
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_admin_id_fkey"
    FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_admin_id_fkey"
    FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Normalize role names (ADMIN -> Admin, USER -> User) if legacy seed ran
UPDATE "roles" SET "name" = 'Admin', "description" = 'Administrator with full access' WHERE "name" = 'ADMIN';
UPDATE "roles" SET "name" = 'User', "description" = 'Registered site user' WHERE "name" = 'USER';

INSERT INTO "roles" ("id", "name", "description", "created_at")
SELECT 'role_manager_seed', 'Manager', 'Manager with limited admin access', NOW()
WHERE NOT EXISTS (SELECT 1 FROM "roles" WHERE "name" = 'Manager');
