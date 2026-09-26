ALTER TABLE `contributions` ADD `contact_email` text;--> statement-breakpoint
ALTER TABLE `contributions` ADD `email_verified` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `contributions` ADD `marketing_consent` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `contributions` ADD `marketing_consent_at` integer;--> statement-breakpoint
ALTER TABLE `contributions` ADD `contact_notice_version` text;--> statement-breakpoint
CREATE INDEX `contributions_created` ON `contributions` (`created_at`);--> statement-breakpoint
CREATE INDEX `contributions_email_rate` ON `contributions` (`contact_email`,`created_at`);--> statement-breakpoint
CREATE INDEX `contributions_duplicates` ON `contributions` (`work_id`,`created_at`);