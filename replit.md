# WorkshopWise - Workshop Management Platform

## Overview

WorkshopWise is a comprehensive full-stack workshop management platform that connects learners with industry experts through transformative educational experiences. The application enables users to discover, register for, and manage workshops while providing enterprise partners with tools to create and manage their educational offerings.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API for authentication, TanStack Query for server state
- **Routing**: React Router DOM for client-side navigation
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: TSX for hot reloading during development
- **Build**: ESBuild for production bundling
- **API**: RESTful API design with Express middleware

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **Migrations**: Drizzle Kit for schema management
- **Schema**: Shared schema definitions between client and server

## Key Components

### Authentication System
- Role-based authentication (user, enterprise, admin)
- Context-based state management
- Mock authentication for development
- Support for user and enterprise registration flows

### Workshop Management
- Workshop discovery and browsing with filtering
- Detailed workshop views with instructor information
- Registration system with automated and manual approval modes
- Payment integration support (screenshot upload for manual verification)
- Enterprise dashboard for workshop creation and management

### User Experience
- Responsive design optimized for mobile and desktop
- Toast notifications for user feedback
- Modal-based interactions for registration flows
- Profile management capabilities
- Dashboard views tailored to user roles

### Data Storage Strategy
- In-memory storage implementation for development
- Interface-based storage abstraction for easy database integration
- Type-safe data models using Drizzle schema definitions

## Data Flow

1. **User Registration/Login**: Authentication context manages user state across the application
2. **Workshop Discovery**: Users browse workshops with client-side filtering and search
3. **Registration Process**: Modal-based registration with role-based approval workflows
4. **Enterprise Management**: Dedicated dashboard for workshop creation and participant management
5. **Admin Oversight**: Comprehensive admin dashboard for platform management

## External Dependencies

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography

### Development Tools
- Replit-specific plugins for development environment integration
- Vite plugins for enhanced development experience
- ESLint and TypeScript for code quality

### Database and ORM
- Drizzle ORM for database operations
- Neon Database serverless PostgreSQL
- Connect-pg-simple for session management

### Utility Libraries
- Date-fns for date manipulation
- Class-variance-authority for component variants
- CLSX for conditional CSS classes

## Deployment Strategy

### Development Environment
- Replit-hosted development with hot reloading
- PostgreSQL module integration
- Port 5000 for local development server

### Production Build
- Vite build for optimized client bundle
- ESBuild for server-side bundling
- Static asset serving from Express

### Environment Configuration
- Environment-based configuration for database connections
- Separate development and production build processes
- Autoscale deployment target for production

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```