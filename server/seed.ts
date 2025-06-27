import { db } from "./db";
import { users, enterprises, workshops, registrations } from "@shared/schema";
import { hashPassword } from "./utils/auth";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Test database connection first
    await db.select().from(users).limit(1);
    console.log("✅ Database connection successful");

    // Create admin user
    const adminExists = await db.select().from(users).where(eq(users.email, 'admin@workshopwise.com')).limit(1);

    if (adminExists.length === 0) {
      const hashedPassword = await hashPassword('admin123');
      await db.insert(users).values({
        name: 'Admin User',
        email: 'admin@workshopwise.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log("✅ Admin user created");
    }

    // Create first enterprise user
    const enterpriseExists1 = await db.select().from(users).where(eq(users.email, 'contact@techcorp.com')).limit(1);

    if (enterpriseExists1.length === 0) {
      const hashedPassword = await hashPassword('enterprise123');
      const enterpriseUser = await db.insert(users).values({
        name: 'TechCorp Representative',
        email: 'contact@techcorp.com',
        password: hashedPassword,
        role: 'enterprise'
      }).returning();

      const enterprise = await db.insert(enterprises).values({
        userId: enterpriseUser[0].id,
        companyName: 'TechCorp Solutions',
        domain: 'Technology',
        location: 'San Francisco, CA',
        website: 'https://techcorp.com',
        status: 'approved'
      }).returning();

      // Create sample workshops for TechCorp
      await db.insert(workshops).values([
        {
          enterpriseId: enterprise[0].id,
          title: 'Advanced React Development',
          description: 'Learn advanced React patterns and best practices for building scalable applications',
          date: new Date('2025-02-15'),
          time: '10:00 AM',
          duration: '3 hours',
          mode: 'online',
          location: null,
          price: 0,
          isFree: true,
          seats: 30,
          registeredSeats: 0,
          registrationMode: 'automated',
          tags: ['React', 'JavaScript', 'Frontend'],
          status: 'approved',
          meetLink: 'https://meet.google.com/abc-def-ghi'
        },
        {
          enterpriseId: enterprise[0].id,
          title: 'Full Stack Development Bootcamp',
          description: 'Complete full stack development course covering frontend and backend technologies',
          date: new Date('2025-02-20'),
          time: '9:00 AM',
          duration: '8 hours',
          mode: 'hybrid',
          location: 'Tech Hub, Downtown San Francisco',
          price: 2500,
          isFree: false,
          seats: 25,
          registeredSeats: 0,
          registrationMode: 'manual',
          tags: ['Full Stack', 'JavaScript', 'Node.js', 'React'],
          status: 'approved'
        }
      ]);

      console.log("✅ TechCorp enterprise and workshops created");
    }

    // Create second enterprise user
    const enterpriseExists2 = await db.select().from(users).where(eq(users.email, 'hello@growthacademy.com')).limit(1);

    if (enterpriseExists2.length === 0) {
      const hashedPassword = await hashPassword('growth123');
      const enterpriseUser2 = await db.insert(users).values({
        name: 'Growth Academy Team',
        email: 'hello@growthacademy.com',
        password: hashedPassword,
        role: 'enterprise'
      }).returning();

      const enterprise2 = await db.insert(enterprises).values({
        userId: enterpriseUser2[0].id,
        companyName: 'Growth Academy',
        domain: 'Business & Marketing',
        location: 'New York, NY',
        website: 'https://growthacademy.com',
        status: 'approved'
      }).returning();

      // Create sample workshops for Growth Academy
      await db.insert(workshops).values([
        {
          enterpriseId: enterprise2[0].id,
          title: 'Digital Marketing Mastery',
          description: 'Master digital marketing strategies and tools for business growth',
          date: new Date('2025-02-25'),
          time: '2:00 PM',
          duration: '4 hours',
          mode: 'online',
          location: null,
          price: 1500,
          isFree: false,
          seats: 50,
          registeredSeats: 0,
          registrationMode: 'automated',
          tags: ['Marketing', 'Digital', 'Business'],
          status: 'approved',
          meetLink: 'https://meet.google.com/xyz-abc-def'
        },
        {
          enterpriseId: enterprise2[0].id,
          title: 'Leadership & Team Management',
          description: 'Develop essential leadership skills for managing high-performing teams',
          date: new Date('2025-03-01'),
          time: '10:00 AM',
          duration: '6 hours',
          mode: 'offline',
          location: 'Growth Academy Office, Manhattan',
          price: 3000,
          isFree: false,
          seats: 20,
          registeredSeats: 0,
          registrationMode: 'manual',
          tags: ['Leadership', 'Management', 'Soft Skills'],
          status: 'approved'
        }
      ]);

      console.log("✅ Growth Academy enterprise and workshops created");
    }

    // Create sample regular users
    const user1Exists = await db.select().from(users).where(eq(users.email, 'priya@example.com')).limit(1);

    if (user1Exists.length === 0) {
      const hashedPassword = await hashPassword('user123');
      await db.insert(users).values({
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: hashedPassword,
        role: 'user'
      });
      console.log("✅ Sample user Priya created");
    }

    const user2Exists = await db.select().from(users).where(eq(users.email, 'rajesh@example.com')).limit(1);

    if (user2Exists.length === 0) {
      const hashedPassword = await hashPassword('user123');
      await db.insert(users).values({
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: hashedPassword,
        role: 'user'
      });
      console.log("✅ Sample user Rajesh created");
    }

    // Create registrations table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      workshop_id INTEGER REFERENCES workshops(id) NOT NULL,
      reason TEXT,
      experience TEXT,
      expectations TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_screenshot TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Create user profiles table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE,
      phone TEXT,
      location TEXT,
      bio TEXT,
      company TEXT,
      skills TEXT,
      experience TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}