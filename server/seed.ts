import { db } from "./db";
import { users, enterprises, workshops, registrations } from "@shared/schema";
import { hashPassword } from "./utils/auth";

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Create admin user
    const adminExists = await db.select().from(users).where({ email: 'admin@workshopwise.com' }).limit(1);

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

    // Create sample enterprise user
    const enterpriseExists = await db.select().from(users).where({ email: 'tech@company.com' }).limit(1);

    if (enterpriseExists.length === 0) {
      const hashedPassword = await hashPassword('password123');
      const enterpriseUser = await db.insert(users).values({
        name: 'Tech Company',
        email: 'tech@company.com',
        password: hashedPassword,
        role: 'enterprise'
      }).returning();

      const enterprise = await db.insert(enterprises).values({
        userId: enterpriseUser[0].id,
        companyName: 'Tech Solutions Inc',
        domain: 'Technology',
        location: 'San Francisco, CA',
        website: 'https://techsolutions.com',
        status: 'approved'
      }).returning();

      // Create sample workshops
      await db.insert(workshops).values([
        {
          enterpriseId: enterprise[0].id,
          title: 'Advanced React Development',
          description: 'Learn advanced React patterns and best practices',
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
          description: 'Complete full stack development course covering frontend and backend',
          date: new Date('2025-02-20'),
          time: '9:00 AM',
          duration: '8 hours',
          mode: 'hybrid',
          location: 'Tech Hub, Downtown',
          price: 2500,
          isFree: false,
          seats: 25,
          registeredSeats: 0,
          registrationMode: 'manual',
          tags: ['Full Stack', 'JavaScript', 'Node.js', 'React'],
          status: 'approved'
        }
      ]);

      console.log("✅ Sample enterprise and workshops created");
    }

    // Create sample regular user
    const userExists = await db.select().from(users).where({ email: 'user@example.com' }).limit(1);

    if (userExists.length === 0) {
      const hashedPassword = await hashPassword('user123');
      await db.insert(users).values({
        name: 'John Doe',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user'
      });
      console.log("✅ Sample user created");
    }

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}