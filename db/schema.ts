import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  userId: text("user_id").primaryKey(), displayName: text("display_name").notNull(),
  goal: text("goal").notNull().default("Maintain weight"), diet: text("diet").notNull().default("Vegetarian"),
  cuisine: text("cuisine").notNull().default("Indian"), calorieTarget: integer("calorie_target").notNull().default(2000),
  proteinTarget: integer("protein_target").notNull().default(105), carbsTarget: integer("carbs_target").notNull().default(250),
  fatTarget: integer("fat_target").notNull().default(65), waterTarget: integer("water_target").notNull().default(8),
  onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).notNull().default(false), updatedAt: text("updated_at").notNull(),
});
export const diaryEntries = sqliteTable("diary_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }), userId: text("user_id").notNull(), entryDate: text("entry_date").notNull(),
  meal: text("meal").notNull(), name: text("name").notNull(), calories: real("calories").notNull(),
  protein: real("protein").notNull(), carbs: real("carbs").notNull(), fat: real("fat").notNull(), createdAt: text("created_at").notNull(),
});
export const hydrationLogs = sqliteTable("hydration_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }), userId: text("user_id").notNull(), entryDate: text("entry_date").notNull(),
  glasses: integer("glasses").notNull().default(0), updatedAt: text("updated_at").notNull(),
});
