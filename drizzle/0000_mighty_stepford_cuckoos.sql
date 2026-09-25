CREATE TABLE `contributions` (
	`id` text PRIMARY KEY NOT NULL,
	`work_id` text NOT NULL,
	`kind` text NOT NULL,
	`message` text NOT NULL,
	`observed_on` text,
	`source_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`reporter_hash` text NOT NULL,
	`reviewed_at` integer,
	`review_note` text
);
--> statement-breakpoint
CREATE INDEX `contributions_queue` ON `contributions` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `contributions_rate` ON `contributions` (`reporter_hash`,`created_at`);