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

const upload = multer({ dest: 'uploads/' });

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cors());

  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

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
      res.status(400).json({ message: 'Invalid request data' });
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

      const workshopData = insertWorkshopSchema.parse(req.body);

      // Generate meet link if online and automated
      let meetLink = null;
      if (workshopData.mode === 'online' && workshopData.registrationMode === 'automated') {
        meetLink = generateMeetLink();
      }

      const workshop = await storage.createWorkshop({
        ...workshopData,
        enterpriseId: enterprise.id,
        meetLink,
        status: 'pending'
      });

      res.status(201).json(workshop);
    } catch (error) {
      res.status(400).json({ message: 'Invalid request data' });
    }
  });

  // Registration routes
  app.post('/api/registrations', authenticateToken, requireRole(['user']), async (req: AuthRequest, res) => {
    try {
      const registrationData = insertRegistrationSchema.parse(req.body);

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
      let status = 'pending';
      if (workshop.registrationMode === 'automated') {
        status = 'confirmed';
        // Update registered seats count
        await storage.updateWorkshop(workshop.id, {
          registeredSeats: workshop.registeredSeats + 1
        });
      }

      const registration = await storage.createRegistration({
        ...registrationData,
        userId: req.user!.id,
        status
      });

      res.status(201).json(registration);
    } catch (error) {
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
      res.json(users.map(user => ({ ...user, password: undefined })));
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/admin/enterprises', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
    try {
      const enterprises = await storage.getAllEnterprises();
      res.json(enterprises);
    } catch (error) {
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
      if (status === 'approved' || status === 'confirmed') {
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