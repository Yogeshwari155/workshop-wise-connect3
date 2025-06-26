import { storage } from "./storage";
import { hashPassword } from "./utils/auth";

export async function seedDatabase() {
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail("admin@workshopwise.com");
    if (existingAdmin) {
      console.log("Admin user already exists, skipping seed");
      return;
    }

    // Create default admin user
    const hashedPassword = await hashPassword("admin123");
    const admin = await storage.createUser({
      name: "WorkshopWise Admin",
      email: "admin@workshopwise.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin user created:", admin.email);

    // Create sample enterprise users
    const enterprise1Password = await hashPassword("enterprise123");
    const enterprise1User = await storage.createUser({
      name: "TechCorp Solutions",
      email: "contact@techcorp.com",
      password: enterprise1Password,
      role: "enterprise"
    });

    const enterprise1 = await storage.createEnterprise({
      userId: enterprise1User.id,
      companyName: "TechCorp Solutions",
      domain: "Technology",
      location: "Bangalore, India",
      website: "https://techcorp.com",
      status: "approved"
    });

    console.log("✅ Enterprise 1 created:", enterprise1.companyName);

    const enterprise2Password = await hashPassword("growth123");
    const enterprise2User = await storage.createUser({
      name: "Growth Academy",
      email: "hello@growthacademy.com",
      password: enterprise2Password,
      role: "enterprise"
    });

    const enterprise2 = await storage.createEnterprise({
      userId: enterprise2User.id,
      companyName: "Growth Academy",
      domain: "Marketing",
      location: "Mumbai, India",
      website: "https://growthacademy.com",
      status: "approved"
    });

    console.log("✅ Enterprise 2 created:", enterprise2.companyName);

    // Create sample workshops
    const workshop1 = await storage.createWorkshop({
      enterpriseId: enterprise1.id,
      title: "Advanced React Development",
      description: "Join us for an intensive 3-day workshop on Advanced React Development. This hands-on session will cover modern React patterns, performance optimization, and best practices used in production applications.\n\nWhat you'll learn:\n• Advanced React Hooks and Custom Hooks\n• State Management with Context API and Redux Toolkit\n• Performance Optimization Techniques\n• Testing React Applications\n• Deployment Strategies\n\nPrerequisites:\n• Basic knowledge of React and JavaScript\n• Familiarity with ES6+ features\n• Understanding of HTML/CSS",
      date: new Date("2025-01-15T10:00:00Z"),
      time: "10:00 AM - 6:00 PM",
      duration: "3 days",
      mode: "online",
      price: 2500,
      isFree: false,
      seats: 25,
      registrationMode: "automated",
      tags: ["React", "JavaScript", "Frontend"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
      status: "approved",
      meetLink: "https://meet.google.com/abc-defg-hij"
    });

    const workshop2 = await storage.createWorkshop({
      enterpriseId: enterprise2.id,
      title: "Digital Marketing Masterclass",
      description: "Master the art of digital marketing in this comprehensive 2-day workshop. Learn strategies that top companies use to grow their online presence and drive results.\n\nTopics Covered:\n• Social Media Marketing\n• SEO and Content Strategy\n• Google Ads and PPC\n• Email Marketing\n• Analytics and ROI Measurement\n\nPerfect for:\n• Marketing professionals\n• Business owners\n• Freelancers\n• Students",
      date: new Date("2025-01-20T14:00:00Z"),
      time: "2:00 PM - 6:00 PM",
      duration: "2 days",
      mode: "hybrid",
      location: "Mumbai",
      price: 0,
      isFree: true,
      seats: 50,
      registrationMode: "manual",
      tags: ["Marketing", "Strategy", "Business"],
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
      status: "approved"
    });

    const workshop3 = await storage.createWorkshop({
      enterpriseId: enterprise1.id,
      title: "Data Science with Python",
      description: "Comprehensive 5-day bootcamp covering data science fundamentals using Python. From data analysis to machine learning, this workshop will give you practical skills.\n\nCurriculum:\n• Python for Data Analysis\n• Pandas and NumPy\n• Data Visualization\n• Machine Learning Basics\n• Real-world Projects\n\nRequirements:\n• Basic programming knowledge\n• Laptop with Python installed\n• Eagerness to learn",
      date: new Date("2025-01-25T09:00:00Z"),
      time: "9:00 AM - 5:00 PM",
      duration: "5 days",
      mode: "offline",
      location: "Bangalore",
      price: 1800,
      isFree: false,
      seats: 30,
      registrationMode: "automated",
      tags: ["Python", "Data Science", "Analytics"],
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
      status: "approved"
    });

    console.log("✅ Sample workshops created");

    // Create sample regular users
    const user1Password = await hashPassword("user123");
    const user1 = await storage.createUser({
      name: "Priya Sharma",
      email: "priya@example.com",
      password: user1Password,
      role: "user"
    });

    const user2Password = await hashPassword("user123");
    const user2 = await storage.createUser({
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      password: user2Password,
      role: "user"
    });

    console.log("✅ Sample users created");

    // Create sample registrations
    await storage.createRegistration({
      userId: user1.id,
      workshopId: workshop1.id,
      reason: "I want to enhance my React skills for my current project at work",
      experience: "2 years of React development",
      expectations: "Learn advanced patterns and best practices",
      status: "confirmed"
    });

    await storage.createRegistration({
      userId: user2.id,
      workshopId: workshop2.id,
      reason: "Looking to transition into digital marketing and need foundational knowledge",
      experience: "No prior marketing experience",
      expectations: "Understand digital marketing fundamentals",
      status: "pending"
    });

    console.log("✅ Sample registrations created");

    // Create demo users if they don't exist
  const demoUser = await storage.getUserByEmail('test@example.com');
  if (!demoUser) {
    await storage.createUser({
      name: 'Demo User',
      email: 'test@example.com',
      password: await hashPassword('password'),
      role: 'user'
    });
    console.log('Demo user created');
  }

  const demoUser2 = await storage.getUserByEmail('john@example.com');
  if (!demoUser2) {
    await storage.createUser({
      name: 'John Doe',
      email: 'john@example.com',
      password: await hashPassword('password'),
      role: 'user'
    });
    console.log('Demo user 2 created');
  }

  const demoUser3 = await storage.getUserByEmail('jane@example.com');
  if (!demoUser3) {
    await storage.createUser({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await hashPassword('password'),
      role: 'user'
    });
    console.log('Demo user 3 created');
  }

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nDefault credentials:");
    console.log("Admin: admin@workshopwise.com / admin123");
    console.log("Enterprise 1: contact@techcorp.com / enterprise123");
    console.log("Enterprise 2: hello@growthacademy.com / growth123");
    console.log("User 1: priya@example.com / user123");
    console.log("User 2: rajesh@example.com / user123");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}