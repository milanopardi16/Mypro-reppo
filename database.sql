-- Database Migration: Prisma (PostgreSQL) to MySQL
-- Generated for cPanel Shared Hosting

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for users
-- ----------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `auth_email` varchar(191) DEFAULT NULL,
  `full_name` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `company_name` varchar(191) DEFAULT NULL,
  `position` varchar(191) DEFAULT NULL,
  `industry` varchar(191) DEFAULT NULL,
  `website` varchar(191) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `password_hash` varchar(191) DEFAULT NULL,
  `role_id` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_auth_email_key` (`auth_email`),
  KEY `users_email_idx` (`email`),
  CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL DEFAULT 'Admin',
  `role_id` varchar(191) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_key` (`email`),
  CONSTRAINT `admins_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for refresh_tokens
-- ----------------------------
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `admin_id` varchar(191) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `revoked_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `refresh_tokens_token_key` (`token`),
  KEY `refresh_tokens_admin_id_idx` (`admin_id`),
  CONSTRAINT `refresh_tokens_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL DEFAULT '',
  `type` varchar(191) NOT NULL DEFAULT 'system',
  `user_id` varchar(191) DEFAULT NULL,
  `actor_ref` varchar(191) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `notifications_is_read_created_at_idx` (`is_read`,`created_at`),
  KEY `notifications_user_id_idx` (`user_id`),
  CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for blog_posts
-- ----------------------------
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` varchar(191) NOT NULL,
  `slug` varchar(191) DEFAULT NULL,
  `title` varchar(191) NOT NULL,
  `excerpt` text NOT NULL DEFAULT '',
  `content` longtext NOT NULL DEFAULT '',
  `cover_image` varchar(191) DEFAULT NULL,
  `tags` text DEFAULT NULL, -- MySQL doesn't have String[], using text for JSON or comma-separated
  `category` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'draft',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for assessments
-- ----------------------------
CREATE TABLE IF NOT EXISTS `assessments` (
  `id` varchar(191) NOT NULL,
  `profile_type` varchar(191) DEFAULT NULL,
  `full_name` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `linkedin` varchar(191) DEFAULT NULL,
  `company_name` varchar(191) DEFAULT NULL,
  `sector` varchar(191) DEFAULT NULL,
  `stage` varchar(191) DEFAULT NULL,
  `capital_required` varchar(191) DEFAULT NULL,
  `one_liner` text DEFAULT NULL,
  `org_name` varchar(191) DEFAULT NULL,
  `ticket_size` varchar(191) DEFAULT NULL,
  `stage_pref` varchar(191) DEFAULT NULL,
  `geo_pref` varchar(191) DEFAULT NULL,
  `confidence` varchar(191) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `confirm_accuracy` tinyint(1) NOT NULL DEFAULT '0',
  `deck_file` varchar(191) DEFAULT NULL,
  `reviewed` tinyint(1) NOT NULL DEFAULT '0',
  `notes` text NOT NULL DEFAULT '',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assessments_reviewed_created_at_idx` (`reviewed`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for contact_messages
-- ----------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` varchar(191) NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `subject` varchar(191) DEFAULT NULL,
  `message` text NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `contact_messages_read_created_at_idx` (`read`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for chat_rooms
-- ----------------------------
CREATE TABLE IF NOT EXISTS `chat_rooms` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) DEFAULT NULL,
  `admin_id` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `chat_rooms_status_created_at_idx` (`status`,`created_at`),
  KEY `chat_rooms_user_id_idx` (`user_id`),
  KEY `chat_rooms_admin_id_idx` (`admin_id`),
  CONSTRAINT `chat_rooms_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chat_rooms_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for chat_messages
-- ----------------------------
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` varchar(191) NOT NULL,
  `room_id` varchar(191) NOT NULL,
  `sender_id` varchar(191) NOT NULL,
  `sender_type` varchar(191) NOT NULL,
  `message` text NOT NULL DEFAULT '',
  `attachment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachment`)),
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `chat_messages_room_id_created_at_idx` (`room_id`,`created_at`),
  CONSTRAINT `chat_messages_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for founder_submissions
-- ----------------------------
CREATE TABLE IF NOT EXISTS `founder_submissions` (
  `id` varchar(191) NOT NULL,
  `profile_type` varchar(191) DEFAULT NULL,
  `full_name` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `linkedin` varchar(191) DEFAULT NULL,
  `company_name` varchar(191) DEFAULT NULL,
  `sector` varchar(191) DEFAULT NULL,
  `stage` varchar(191) DEFAULT NULL,
  `capital_required` varchar(191) DEFAULT NULL,
  `one_liner` text DEFAULT NULL,
  `org_name` varchar(191) DEFAULT NULL,
  `ticket_size` varchar(191) DEFAULT NULL,
  `stage_pref` varchar(191) DEFAULT NULL,
  `geo_pref` varchar(191) DEFAULT NULL,
  `confidence` varchar(191) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `confirm_accuracy` tinyint(1) NOT NULL DEFAULT '0',
  `deck_file` varchar(191) DEFAULT NULL,
  `reviewed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for site_content
-- ----------------------------
CREATE TABLE IF NOT EXISTS `site_content` (
  `id` varchar(191) NOT NULL DEFAULT 'main',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`content`)),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for push_tokens
-- ----------------------------
CREATE TABLE IF NOT EXISTS `push_tokens` (
  `id` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `platform` varchar(191) DEFAULT NULL,
  `user_id` varchar(191) DEFAULT NULL,
  `admin_id` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `push_tokens_token_key` (`token`),
  KEY `push_tokens_user_id_idx` (`user_id`),
  KEY `push_tokens_admin_id_idx` (`admin_id`),
  CONSTRAINT `push_tokens_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `push_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for audit_logs
-- ----------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` varchar(191) NOT NULL,
  `admin_id` varchar(191) DEFAULT NULL,
  `action` varchar(191) NOT NULL,
  `resource` varchar(191) NOT NULL,
  `resource_id` varchar(191) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `ip_address` varchar(191) DEFAULT NULL,
  `user_agent` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `audit_logs_admin_id_created_at_idx` (`admin_id`,`created_at`),
  KEY `audit_logs_resource_created_at_idx` (`resource`,`created_at`),
  CONSTRAINT `audit_logs_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
