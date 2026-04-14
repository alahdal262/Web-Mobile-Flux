import { pgTable, text, uuid, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ------------------------------------------------------------------
// Users
// ------------------------------------------------------------------
export const usersTable = pgTable("users", {
  id:           uuid("id").primaryKey().defaultRandom(),
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName:     text("full_name"),
  createdAt:    timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User      = typeof usersTable.$inferSelect;

// ------------------------------------------------------------------
// Apps
// ------------------------------------------------------------------
export const appsTable = pgTable("apps", {
  id:           uuid("id").primaryKey().defaultRandom(),
  userId:       uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }),
  appName:      text("app_name").notNull(),
  websiteUrl:   text("website_url"),
  templateId:   text("template_id"),
  primaryColor: text("primary_color"),
  featureState: jsonb("feature_state"),
  published:    boolean("published").default(false),
  createdAt:    timestamp("created_at").defaultNow(),
  updatedAt:    timestamp("updated_at").defaultNow(),
});

export const insertAppSchema = createInsertSchema(appsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertApp = z.infer<typeof insertAppSchema>;
export type App       = typeof appsTable.$inferSelect;
