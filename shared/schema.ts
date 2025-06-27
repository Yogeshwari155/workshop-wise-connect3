import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "user", "enterprise"] }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const enterprises = pgTable("enterprises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: text("company_name").notNull(),
  domain: text("domain"),
  location: text("location"),
  website: text("website"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workshops = pgTable("workshops", {
  id: serial("id").primaryKey(),
  enterpriseId: integer("enterprise_id").references(() => enterprises.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructor: text("instructor").notNull(),
  agenda: text("agenda").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  duration: text("duration").notNull(),
  mode: text("mode", { enum: ["online", "offline", "hybrid"] }).notNull(),
  location: text("location"),
  price: integer("price").notNull().default(0),
  isFree: boolean("is_free").notNull().default(true),
  seats: integer("seats").notNull(),
  registeredSeats: integer("registered_seats").notNull().default(0),
  registrationMode: text("registration_mode", { enum: ["automated", "manual"] }).notNull().default("automated"),
  tags: text("tags").array(),
  image: text("image"),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  meetLink: text("meet_link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workshopId: integer("workshop_id").notNull().references(() => workshops.id, { onDelete: "cascade" }),
  reason: text("reason"),
  experience: text("experience"),
  expectations: text("expectations"),
  status: text("status", { enum: ["pending", "approved", "rejected", "confirmed"] }).default("pending").notNull(),
  paymentScreenshot: text("payment_screenshot"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone").default(""),
  location: text("location").default(""),
  bio: text("bio").default(""),
  company: text("company").default(""),
  skills: text("skills").default(""),
  experience: text("experience").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({ userId: true, id: true, createdAt: true, updatedAt: true }).extend({
  userId: z.number().optional()
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnterpriseSchema = createInsertSchema(enterprises).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkshopSchema = createInsertSchema(workshops).omit({
  id: true,
  enterpriseId: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerUserSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const registerEnterpriseSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  companyName: z.string().min(1),
  domain: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Enterprise = typeof enterprises.$inferSelect;
export type InsertEnterprise = typeof enterprises.$inferInsert;
export type Workshop = typeof workshops.$inferSelect;
export type InsertWorkshop = typeof workshops.$inferInsert;
export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;