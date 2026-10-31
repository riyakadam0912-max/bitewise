CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`goal` text DEFAULT 'Maintain weight' NOT NULL,
	`diet` text DEFAULT 'Vegetarian' NOT NULL,
	`cuisine` text DEFAULT 'Indian' NOT NULL,
	`calorie_target` integer DEFAULT 2000 NOT NULL,
	`protein_target` integer DEFAULT 105 NOT NULL,
	`carbs_target` integer DEFAULT 250 NOT NULL,
	`fat_target` integer DEFAULT 65 NOT NULL,
	`water_target` integer DEFAULT 8 NOT NULL,
	`onboarding_complete` integer DEFAULT false NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `diary_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`entry_date` text NOT NULL,
	`meal` text NOT NULL,
	`name` text NOT NULL,
	`calories` real NOT NULL,
	`protein` real NOT NULL,
	`carbs` real NOT NULL,
	`fat` real NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `diary_user_date_idx` ON `diary_entries` (`user_id`,`entry_date`);
--> statement-breakpoint
CREATE TABLE `hydration_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`entry_date` text NOT NULL,
	`glasses` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hydration_user_date_idx` ON `hydration_logs` (`user_id`,`entry_date`);
