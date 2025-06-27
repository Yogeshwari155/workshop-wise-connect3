import { db } from "./db";
import { users, enterprises, workshops, registrations, userProfiles } from "@shared/schema";
import type { User, Enterprise, Workshop, Registration, UserProfile, InsertUser, InsertEnterprise, InsertWorkshop, InsertRegistration, InsertUserProfile } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

interface IStorage {
  // User methods
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;

  // Enterprise methods
  getEnterpriseById(id: number): Promise<Enterprise | undefined>;
  getEnterpriseByUserId(userId: number): Promise<Enterprise | undefined>;
  createEnterprise(enterprise: InsertEnterprise): Promise<Enterprise>;
  updateEnterprise(id: number, updates: Partial<InsertEnterprise>): Promise<Enterprise | undefined>;
  getAllEnterprises(): Promise<Enterprise[]>;
  deleteEnterprise(id: number): Promise<boolean>;

  // Workshop methods
  getWorkshopById(id: number): Promise<Workshop | undefined>;
  getApprovedWorkshops(): Promise<Workshop[]>;
  getAllWorkshops(): Promise<Workshop[]>;
  getWorkshopsByEnterpriseId(enterpriseId: number): Promise<Workshop[]>;
  createWorkshop(workshop: InsertWorkshop): Promise<Workshop>;
  updateWorkshop(id: number, updates: Partial<InsertWorkshop>): Promise<Workshop | undefined>;
  deleteWorkshop(id: number): Promise<boolean>;

  // Registration methods
  getRegistrationById(id: number): Promise<Registration | undefined>;
  getRegistrationsByUserId(userId: number): Promise<Registration[]>;
  getRegistrationsByWorkshopId(workshopId: number): Promise<Registration[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  updateRegistration(id: number, updates: Partial<InsertRegistration>): Promise<Registration | undefined>;
  deleteRegistration(id: number): Promise<boolean>;
  getUserRegistrationForWorkshop(userId: number, workshopId: number): Promise<Registration | undefined>;
  
  // Profile methods
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  updateUserProfile(userId: number, data: Partial<InsertUserProfile>): Promise<UserProfile>;
}

export class PostgresStorage implements IStorage {
  // User methods
  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  // Enterprise methods
  async getEnterpriseById(id: number): Promise<Enterprise | undefined> {
    const result = await db.select().from(enterprises).where(eq(enterprises.id, id)).limit(1);
    return result[0];
  }

  async getEnterpriseByUserId(userId: number): Promise<Enterprise | undefined> {
    const result = await db.select().from(enterprises).where(eq(enterprises.userId, userId)).limit(1);
    return result[0];
  }

  async createEnterprise(enterprise: InsertEnterprise): Promise<Enterprise> {
    const result = await db.insert(enterprises).values(enterprise).returning();
    return result[0];
  }

  async updateEnterprise(id: number, updates: Partial<InsertEnterprise>): Promise<Enterprise | undefined> {
    const result = await db.update(enterprises).set({ ...updates, updatedAt: new Date() }).where(eq(enterprises.id, id)).returning();
    return result[0];
  }

  async getAllEnterprises(): Promise<Enterprise[]> {
    return await db.select().from(enterprises).orderBy(desc(enterprises.createdAt));
  }

  async deleteEnterprise(id: number): Promise<boolean> {
    const result = await db.delete(enterprises).where(eq(enterprises.id, id));
    return result.length > 0;
  }

  // Workshop methods
  async getWorkshopById(id: number): Promise<Workshop | undefined> {
    const result = await db.select().from(workshops).where(eq(workshops.id, id)).limit(1);
    return result[0];
  }

  async getApprovedWorkshops(): Promise<Workshop[]> {
    return await db.select().from(workshops).where(eq(workshops.status, 'approved')).orderBy(desc(workshops.createdAt));
  }

  async getAllWorkshops(): Promise<Workshop[]> {
    return await db.select().from(workshops).orderBy(desc(workshops.createdAt));
  }

  async getWorkshopsByEnterpriseId(enterpriseId: number): Promise<Workshop[]> {
    return await db.select().from(workshops).where(eq(workshops.enterpriseId, enterpriseId)).orderBy(desc(workshops.createdAt));
  }

  async createWorkshop(workshop: InsertWorkshop): Promise<Workshop> {
    const result = await db.insert(workshops).values(workshop).returning();
    return result[0];
  }

  async updateWorkshop(id: number, updates: Partial<InsertWorkshop>): Promise<Workshop | undefined> {
    const result = await db.update(workshops).set({ ...updates, updatedAt: new Date() }).where(eq(workshops.id, id)).returning();
    return result[0];
  }

  async deleteWorkshop(id: number): Promise<boolean> {
    const result = await db.delete(workshops).where(eq(workshops.id, id)).returning();
    return result.length > 0;
  }

  // Registration methods
  async getRegistrationById(id: number): Promise<Registration | undefined> {
    const result = await db.select().from(registrations).where(eq(registrations.id, id)).limit(1);
    return result[0];
  }

  async getRegistrationsByUserId(userId: number): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.userId, userId)).orderBy(desc(registrations.createdAt));
  }

  async getRegistrationsByWorkshopId(workshopId: number): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.workshopId, workshopId)).orderBy(desc(registrations.createdAt));
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const result = await db.insert(registrations).values(registration).returning();
    return result[0];
  }

  async updateRegistration(id: number, updates: Partial<InsertRegistration>): Promise<Registration | undefined> {
    const result = await db.update(registrations).set({ ...updates, updatedAt: new Date() }).where(eq(registrations.id, id)).returning();
    return result[0];
  }

  async deleteRegistration(id: number): Promise<boolean> {
    const result = await db.delete(registrations).where(eq(registrations.id, id)).returning();
    return result.length > 0;
  }

  async getUserRegistrationForWorkshop(userId: number, workshopId: number): Promise<Registration | undefined> {
    const result = await db.select().from(registrations)
      .where(and(eq(registrations.userId, userId), eq(registrations.workshopId, workshopId)))
      .limit(1);
    return result[0];
  }

    async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const result = await db.select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);
    return result[0];
  }

  async updateUserProfile(userId: number, data: Partial<InsertUserProfile>): Promise<UserProfile> {
    // Try to update existing profile
    const updated = await db.update(userProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();

    if (updated.length > 0) {
      return updated[0];
    }

    // If no profile exists, create one
    const created = await db.insert(userProfiles)
      .values({ ...data, userId })
      .returning();
    return created[0];
  }
}

export const storage = new PostgresStorage();