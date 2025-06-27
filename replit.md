# WorkshopWise - Workshop Booking Platform

## Overview
WorkshopWise is a comprehensive workshop booking platform that connects professionals with industry-led workshops. The platform supports three user roles: Admin, Enterprise, and User, with full CRUD operations and authentication.

## User Preferences
- Primary colors: #8B5CF6 (primary-500) and #7C3AED (accent-500)
- Backend: Node.js + Express.js with PostgreSQL database
- Frontend: React with TypeScript and Tailwind CSS
- Authentication: JWT-based with bcrypt password hashing

## Project Architecture

### Backend Structure
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with role-based access control
- **API Routes**: RESTful endpoints for all CRUD operations
- **Middleware**: Auth middleware for protected routes
- **File Upload**: Multer for payment screenshot uploads

### Database Schema
- Users table (admin, user, enterprise roles)
- Enterprises table (company information)
- Workshops table (workshop details and status)
- Registrations table (user workshop registrations)

### Key Features Implemented
- User registration and login for all roles
- Workshop CRUD operations for enterprises
- Workshop browsing and registration for users
- Admin panel for managing users, enterprises, workshops
- Automated vs manual registration modes
- Google Meet link generation for online workshops
- Payment screenshot upload functionality

### Frontend Structure
- React Router for navigation
- Context API for authentication state
- Custom hooks for API calls with React Query
- Responsive UI with Tailwind CSS
- Component-based architecture

## Recent Changes
- ✅ Set up PostgreSQL database with complete schema
- ✅ Implemented JWT authentication system with role-based access control
- ✅ Created comprehensive API endpoints for all user roles
- ✅ Added database seeding with sample data
- ✅ Connected frontend with backend API (real-time data, no mock data)
- ✅ Updated color scheme to match user requirements (#8B5CF6)
- ✅ Fixed enterprise registration flow and validation
- ✅ Enhanced admin dashboard with workshop approval/rejection functionality
- ✅ Added real-time UI updates for workshop status changes
- ✅ Implemented protected routes with role-based navigation
- ✅ Fixed workshop filtering to show only approved workshops to users
- ✅ Enhanced UI with modern design components (Hero, Features, Testimonials sections)
- ✅ Created ModernWorkshopCard component with advanced filtering and sorting
- ✅ Added grid/list view toggle and comprehensive workshop search functionality
- ✅ Fixed enterprise dashboard 404 error by adding /enterprise route
- ✅ Added real-time refresh functionality to enterprise and admin dashboards
- ✅ Fixed date picker in workshop creation form
- ✅ Fixed admin dashboard authentication token issues
- ✅ Created sample workshops for Cool enterprise
- ✅ Added manual refresh buttons to both dashboards
- ✅ Fixed DATABASE_URL environment variable issue and database connection
- ✅ Added missing POST endpoint for enterprise workshop creation
- ✅ Fixed JSON parsing errors in workshop creation with proper error handling
- ✅ Implemented default cover images based on enterprise domain/industry
- ✅ Added placeholder image service for dynamic workshop cover generation
- ✅ Enhanced admin dashboard with registration management for manual approvals
- ✅ Fixed authentication middleware to include user name in token verification
- ✅ Added comprehensive registration approval/rejection system for admins

## Default Test Accounts
- Admin: admin@workshopwise.com / admin123
- Enterprise 1: contact@techcorp.com / enterprise123
- Enterprise 2: hello@growthacademy.com / growth123
- User 1: priya@example.com / user123
- User 2: rajesh@example.com / user123

## Tech Stack
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Frontend**: React, TypeScript, Tailwind CSS
- **Authentication**: JWT, bcryptjs
- **State Management**: React Query, Context API
- **File Upload**: Multer
- **Deployment**: Replit environment