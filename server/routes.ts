import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import multer from "multer";
import { storage } from "./storage";
import { authenticateToken, requireRole, type AuthRequest } from "./middleware/auth";
import { hashPassword, comparePassword, generateToken, generateMeetLink } from "./utils/auth";
import {
  loginSchema,
  registerUserSchema,
  registerEnterpriseSchema,
  insertWorkshopSchema,
  insertRegistrationSchema
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { users, workshops, registrations as registrationsTable } from "@shared/schema";

const upload = multer({ dest: 'uploads/' });

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cors());

  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      console.log('Login request:', req.body);

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user.id, user.email, user.role);

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Register endpoint for users
  app.post('/api/auth/register/user', async (req, res) => {
    try {
      console.log('Registration request body:', req.body);

      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(password);

      const user = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        role: 'user'
      });

      const token = generateToken(user.id, user.email, user.role);

      console.log('User created successfully:', user.email);
      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      res.status(400).json({ message: 'Registration failed. Please try again.' });
    }
  });

  // Register endpoint for enterprises
  app.post('/api/auth/register/enterprise', async (req, res) => {
    try {
      console.log('Enterprise registration request:', req.body);

      const { companyName, contactPerson, email, password, confirmPassword, domain, location, website } = req.body;

      if (!companyName || !contactPerson || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All required fields must be provided' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        console.log('Enterprise user already exists:', email);
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(password);

      const user = await storage.createUser({
        name: contactPerson,
        email,
        password: hashedPassword,
        role: 'enterprise'
      });

      const enterprise = await storage.createEnterprise({
        userId: user.id,
        companyName,
        domain: domain || '',
        location: location || '',
        website: website || '',
        status: 'pending'
      });

      const token = generateToken(user.id, user.email, user.role);

      console.log('Enterprise user created successfully:', user.email);
      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        enterprise
      });
    } catch (error) {
      console.error('Enterprise registration error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      res.status(400).json({ message: 'Registration failed. Please try again.' });
    }
  });

  // Workshop routes
  app.get('/api/workshops', async (req, res) => {
    try {
      const workshops = await storage.getApprovedWorkshops();
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/workshops/:id', async (req, res) => {
    try {
      const workshop = await storage.getWorkshopById(parseInt(req.params.id));
      if (!workshop) {
        return res.status(404).json({ message: 'Workshop not found' });
      }
      res.json(workshop);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/workshops', authenticateToken, requireRole(['enterprise']), async (req: AuthRequest, res) => {
    try {
      const enterprise = await storage.getEnterpriseByUserId(req.user!.id);
      if (!enterprise) {
        return res.status(400).json({ message: 'Enterprise profile not found' });
      }

      if (enterprise.status !== 'approved') {
        return res.status(400).json({ message: 'Enterprise not approved yet' });
      }

      console.log('Received workshop data:', JSON.stringify(req.body, null, 2));

      // Convert date string to Date object if needed
      const requestData = {
        ...req.body,
        date: typeof req.body.date === 'string' ? new Date(req.body.date) : req.body.date
      };

      const workshopData = insertWorkshopSchema.parse(requestData);

      // Generate meet link if online and automated
      let meetLink = null;
      if (workshopData.mode === 'online' && workshopData.registrationMode === 'automated') {
        meetLink = generateMeetLink();
      }

      const workshopToCreate = {
        ...workshopData,
        enterpriseId: enterprise.id,
        meetLink: meetLink || null,
        status: 'pending' as const
      };

      const workshop = await storage.createWorkshop(workshopToCreate);

      res.status(201).json(workshop);
    } catch (error) {
      console.error('Workshop creation error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      res.status(400).json({ message: 'Invalid request data', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Registration routes
  app.post('/api/registrations', authenticateToken, requireRole(['user']), async (req: AuthRequest, res) => {
    try {
      console.log('Registration request body:', req.body);
      console.log('Authenticated user:', req.user);

      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const registrationData = insertRegistrationSchema.parse({
        ...req.body,
        userId: req.user.id
      });

      // Check if workshop exists
      const workshop = await storage.getWorkshopById(registrationData.workshopId);
      if (!workshop) {
        return res.status(404).json({ message: 'Workshop not found' });
      }

      if (workshop.status !== 'approved') {
        return res.status(400).json({ message: 'Workshop not approved yet' });
      }

      // Check if user already registered
      const existingRegistration = await storage.getUserRegistrationForWorkshop(
        req.user!.id,
        registrationData.workshopId
      );

      if (existingRegistration) {
        return res.status(400).json({ message: 'Already registered for this workshop' });
      }

      // Check available seats
      if (workshop.registeredSeats >= workshop.seats) {
        return res.status(400).json({ message: 'No seats available' });
      }

      // Determine registration status
      let status: 'pending' | 'confirmed' | 'approved' | 'rejected' = 'pending';
      let shouldUpdateSeats = false;

      if (workshop.registrationMode === 'automated') {
        if (workshop.isFree) {
          status = 'confirmed';
          shouldUpdateSeats = true;
        } else {
          // For paid workshops, check if payment screenshot is provided
          if (registrationData.paymentScreenshot) {
            status = 'confirmed';
            shouldUpdateSeats = true;
          } else {
            return res.status(400).json({ message: 'Payment screenshot required for paid workshops' });
          }
        }
      }

      if (shouldUpdateSeats) {
        await storage.updateWorkshop(workshop.id, {
          registeredSeats: workshop.registeredSeats + 1
        });
      }

      const registration = await storage.createRegistration({
        workshopId: registrationData.workshopId,
        reason: registrationData.reason || '',
        paymentScreenshot: registrationData.paymentScreenshot || null,
        userId: req.user.id,
        status: status as "pending" | "approved" | "rejected" | "confirmed"
      });

      res.status(201).json({
        registration,
        message: status === 'confirmed' ? 'Successfully registered!' : 'Registration pending approval'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.get('/api/registrations/my', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const registrations = await storage.getRegistrationsByUserId(req.user!.id);

      // Get workshop details for each registration
      const registrationsWithWorkshops = await Promise.all(
        registrations.map(async (registration) => {
          const workshop = await storage.getWorkshopById(registration.workshopId);
          return { ...registration, workshop };
        })
      );

      res.json(registrationsWithWorkshops);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Enterprise routes
  app.get('/api/enterprise/workshops', authenticateToken, requireRole(['enterprise']), async (req: AuthRequest, res) => {
    try {
      const enterprise = await storage.getEnterpriseByUserId(req.user!.id);
      if (!enterprise) {
        return res.status(400).json({ message: 'Enterprise profile not found' });
      }

      const workshops = await storage.getWorkshopsByEnterpriseId(enterprise.id);
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/enterprise/workshops', authenticateToken, requireRole(['enterprise']), async (req: AuthRequest, res) => {
    try {
      const enterprise = await storage.getEnterpriseByUserId(req.user!.id);
      if (!enterprise) {
        return res.status(400).json({ message: 'Enterprise profile not found' });
      }

      if (enterprise.status !== 'approved') {
        return res.status(400).json({ message: 'Enterprise not approved yet' });
      }

      console.log('Received workshop data:', JSON.stringify(req.body, null, 2));

      // Convert date string to Date object if needed
      const requestData = {
        ...req.body,
        date: typeof req.body.date === 'string' ? new Date(req.body.date) : req.body.date
      };

      const workshopData = insertWorkshopSchema.parse(requestData);

      // Generate meet link if online and automated
      let meetLink = null;
      if (workshopData.mode === 'online' && workshopData.registrationMode === 'automated') {
        meetLink = generateMeetLink();
      }

      // Generate default image based on domain if not provided
      let defaultImage: string | null = null;
      if (!workshopData.image) {
        const domainImages: Record<string, string> = {
          'Technology': '/api/placeholder/400x300?text=Tech+Workshop&bg=4f46e5&color=white',
          'Business': '/api/placeholder/400x300?text=Business+Workshop&bg=059669&color=white',
          'Design': '/api/placeholder/400x300?text=Design+Workshop&bg=dc2626&color=white',
          'Marketing': '/api/placeholder/400x300?text=Marketing+Workshop&bg=7c3aed&color=white',
          'Finance': '/api/placeholder/400x300?text=Finance+Workshop&bg=0891b2&color=white',
          'Health': '/api/placeholder/400x300?text=Health+Workshop&bg=16a34a&color=white',
          'Education': '/api/placeholder/400x300?text=Education+Workshop&bg=ea580c&color=white',
          'Other': '/api/placeholder/400x300?text=Workshop&bg=6b7280&color=white'
        };
        defaultImage = domainImages[enterprise.domain || 'Other'] || domainImages['Other'];
      }

      const workshopToCreate = {
        ...workshopData,
        enterpriseId: enterprise.id,
        meetLink: meetLink || null,
        image: workshopData.image || defaultImage,
        status: 'pending' as const
      };

      const workshop = await storage.createWorkshop(workshopToCreate);

      res.status(201).json(workshop);
    } catch (error) {
      console.error('Workshop creation error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      res.status(400).json({ message: 'Invalid request data', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put('/api/workshops/:id', authenticateToken, requireRole(['enterprise']), async (req: AuthRequest, res) => {
    try {
      const enterprise = await storage.getEnterpriseByUserId(req.user!.id);
      if (!enterprise) {
        return res.status(400).json({ message: 'Enterprise profile not found' });
      }

      const workshop = await storage.getWorkshopById(parseInt(req.params.id));
      if (!workshop || workshop.enterpriseId !== enterprise.id) {
        return res.status(403).json({ message: 'Workshop not found or access denied' });
      }

      const workshopData = insertWorkshopSchema.parse(req.body);
      const updatedWorkshop = await storage.updateWorkshop(parseInt(req.params.id), workshopData);

      res.json(updatedWorkshop);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  app.delete('/api/workshops/:id', authenticateToken, requireRole(['enterprise']), async (req: AuthRequest, res) => {
    try {
      const enterprise = await storage.getEnterpriseByUserId(req.user!.id);
      if (!enterprise) {
        return res.status(400).json({ message: 'Enterprise profile not found' });
      }

      const workshop = await storage.getWorkshopById(parseInt(req.params.id));
      if (!workshop || workshop.enterpriseId !== enterprise.id) {
        return res.status(403).json({ message: 'Workshop not found or access denied' });
      }

      const deleted = await storage.deleteWorkshop(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: 'Workshop not found' });
      }

      res.json({ message: 'Workshop deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/enterprise/registrations/:workshopId', authenticateToken, requireRole(['enterprise']), async (req: AuthRequest, res) => {
    try {
      const enterprise = await storage.getEnterpriseByUserId(req.user!.id);
      if (!enterprise) {
        return res.status(400).json({ message: 'Enterprise profile not found' });
      }

      const workshop = await storage.getWorkshopById(parseInt(req.params.workshopId));
      if (!workshop || workshop.enterpriseId !== enterprise.id) {
        return res.status(403).json({ message: 'Workshop not found or access denied' });
      }

      const registrations = await storage.getRegistrationsByWorkshopId(workshop.id);

      // Get user details for each registration
      const registrationsWithUsers = await Promise.all(
        registrations.map(async (registration) => {
          const user = await storage.getUserById(registration.userId);
          return { ...registration, user };
        })
      );

      res.json(registrationsWithUsers);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Get user registrations for activity tracking
      const usersWithActivity = await Promise.all(
        users.map(async (user) => {
          const registrations = await storage.getRegistrationsByUserId(user.id);
          const registrationsWithWorkshops = await Promise.all(
            registrations.map(async (reg) => {
              const workshop = await storage.getWorkshopById(reg.workshopId);
              return { ...reg, workshop };
            })
          );
          return {
            ...user,
            password: undefined,
            registrations: registrationsWithWorkshops
          };
        })
      );
      
      res.json(usersWithActivity);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/admin/users/:id', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user exists
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't allow deleting admin users
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin users' });
      }
      
      // Delete user registrations first
      const registrations = await storage.getRegistrationsByUserId(userId);
      for (const registration of registrations) {
        await storage.deleteRegistration(registration.id);
      }
      
      // If user is enterprise, delete enterprise record
      if (user.role === 'enterprise') {
        const enterprise = await storage.getEnterpriseByUserId(userId);
        if (enterprise) {
          // Delete enterprise workshops first
          const workshops = await storage.getWorkshopsByEnterpriseId(enterprise.id);
          for (const workshop of workshops) {
            await storage.deleteWorkshop(workshop.id);
          }
          await storage.deleteEnterprise(enterprise.id);
        }
      }
      
      // Delete user
      const deleted = await storage.deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('User deletion error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/admin/enterprises', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const enterprises = await storage.getAllEnterprises();
      
      // Get enterprise details with user info and workshop count
      const enterprisesWithDetails = await Promise.all(
        enterprises.map(async (enterprise) => {
          const user = await storage.getUserById(enterprise.userId);
          const workshops = await storage.getWorkshopsByEnterpriseId(enterprise.id);
          return {
            ...enterprise,
            user: user ? { ...user, password: undefined } : null,
            workshopCount: workshops.length
          };
        })
      );
      
      res.json(enterprisesWithDetails);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/admin/enterprises/:id', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const enterpriseId = parseInt(req.params.id);
      
      // Check if enterprise exists
      const enterprise = await storage.getEnterpriseById(enterpriseId);
      if (!enterprise) {
        return res.status(404).json({ message: 'Enterprise not found' });
      }
      
      // Delete enterprise workshops first
      const workshops = await storage.getWorkshopsByEnterpriseId(enterpriseId);
      for (const workshop of workshops) {
        // Delete workshop registrations first
        const registrations = await storage.getRegistrationsByWorkshopId(workshop.id);
        for (const registration of registrations) {
          await storage.deleteRegistration(registration.id);
        }
        await storage.deleteWorkshop(workshop.id);
      }
      
      // Delete enterprise
      const deleted = await storage.deleteEnterprise(enterpriseId);
      if (!deleted) {
        return res.status(404).json({ message: 'Enterprise not found' });
      }
      
      // Delete associated user account
      await storage.deleteUser(enterprise.userId);
      
      res.json({ message: 'Enterprise deleted successfully' });
    } catch (error) {
      console.error('Enterprise deletion error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/admin/workshops', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const workshops = await storage.getAllWorkshops();
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/admin/workshops/:id/status', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const workshop = await storage.updateWorkshop(parseInt(req.params.id), { status });
      if (!workshop) {
        return res.status(404).json({ message: 'Workshop not found' });
      }

      res.json(workshop);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/admin/enterprises/:id/status', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const enterprise = await storage.updateEnterprise(parseInt(req.params.id), { status });
      if (!enterprise) {
        return res.status(404).json({ message: 'Enterprise not found' });
      }

      res.json(enterprise);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/admin/registrations', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const allRegistrations = await db.select({
        id: registrationsTable.id,
        userId: registrationsTable.userId,
        workshopId: registrationsTable.workshopId,
        reason: registrationsTable.reason,
        experience: registrationsTable.experience,
        expectations: registrationsTable.expectations,
        status: registrationsTable.status,
        paymentScreenshot: registrationsTable.paymentScreenshot,
        createdAt: registrationsTable.createdAt,
        userName: users.name,
        userEmail: users.email,
        workshopTitle: workshops.title,
        workshopPrice: workshops.price,
        workshopIsFree: workshops.isFree
      })
      .from(registrationsTable)
      .leftJoin(users, eq(registrationsTable.userId, users.id))
      .leftJoin(workshops, eq(registrationsTable.workshopId, workshops.id))
      .orderBy(desc(registrationsTable.createdAt));

      res.json(allRegistrations);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/admin/registrations/:id/status', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      if (!['pending', 'approved', 'rejected', 'confirmed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const registration = await storage.getRegistrationById(parseInt(req.params.id));
      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      // If approving, check workshop capacity
      if ((status === 'approved' || status === 'confirmed') && registration.status === 'pending') {
        const workshop = await storage.getWorkshopById(registration.workshopId);
        if (workshop && workshop.registeredSeats >= workshop.seats) {
          return res.status(400).json({ message: 'Workshop is full' });
        }

        // Update workshop registered seats
        if (workshop) {
          await storage.updateWorkshop(workshop.id, {
            registeredSeats: workshop.registeredSeats + 1
          });
        }
      }

      const updatedRegistration = await storage.updateRegistration(parseInt(req.params.id), { status });
      res.json(updatedRegistration);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Profile routes
  app.get('/api/profile', authenticateToken, async (req: AuthRequest, res) => {
    try {
      let profile = await storage.getUserProfile(req.user!.id);

      // If no profile exists, create a default one
      if (!profile) {
        profile = await storage.updateUserProfile(req.user!.id, {
          name: req.user!.name,
          phone: '',
          location: '',
          bio: '',
          company: '',
          skills: '',
          experience: ''
        });
      }

      res.json(profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/profile', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { name, phone, location, bio, company, skills, experience } = req.body;

      const profileData = {
        userId: req.user!.id,
        name: name || req.user!.name,
        phone: phone || '',
        location: location || '',
        bio: bio || '',
        company: company || '',
        skills: skills || '',
        experience: experience || ''
      };

      const profile = await storage.updateUserProfile(req.user!.id, profileData);

      // Also update user name if changed
      if (name && name !== req.user!.name) {
        await storage.updateUser(req.user!.id, { name });
      }

      res.json(profile);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(400).json({ message: 'Failed to update profile' });
    }
  });

  // Placeholder image service
  app.get('/api/placeholder/:dimensions', (req, res) => {
    const { dimensions } = req.params;
    const { text = 'Placeholder', bg = '6b7280', color = 'white' } = req.query;
    
    const [width, height] = dimensions.split('x').map(d => parseInt(d) || 400);
    
    // Create a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${bg}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 8}" 
              fill="${color}" text-anchor="middle" dominant-baseline="central">${text}</text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  // File upload for payment screenshots
  app.post('/api/upload/payment', authenticateToken, upload.single('screenshot'), (req: AuthRequest, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({ 
      filename: req.file.filename,
      originalName: req.file.originalname
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}