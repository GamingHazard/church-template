# FaithLife Church Website

## Overview

FaithLife Church Website is a full-stack church management system built with React, Express, and PostgreSQL. It provides comprehensive functionality for managing church events, sermons, donations, newsletters, and administrative tasks. The application features a modern, responsive design using shadcn/ui components and Tailwind CSS, with a complete admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **Forms**: React Hook Form with Zod for validation and type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware with proper status codes
- **Logging**: Custom request logging for API endpoints with performance metrics

### Data Storage Solutions
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database queries and migrations
- **Schema Management**: Shared TypeScript schema definitions between client and server
- **Validation**: Zod schemas for runtime type validation and API request/response validation
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store
- **Role-based Access**: User roles (admin/user) for different permission levels
- **Admin Protection**: Admin-only routes for content management and dashboard access

### External Dependencies
- **Database Hosting**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **Payment Processing**: Flutterwave integration for donation processing
- **Email Services**: Newsletter subscription management with email validation
- **Media Storage**: External image hosting for events, sermons, and gallery images
- **Video Hosting**: YouTube integration for sermon video streaming
- **UI Components**: Extensive use of Radix UI primitives for accessible components
- **Development Tools**: Replit-specific plugins for development environment integration

### Key Features
- **Event Management**: Create, edit, and manage church events with reminders
- **Sermon Archive**: Video/audio sermon library with search functionality
- **Donation System**: Secure online donations with multiple purpose categories
- **Newsletter**: Email subscription management for church communications
- **Gallery**: Image gallery for church activities and events
- **Pastor Profiles**: Staff directory with biographical information
- **Admin Dashboard**: Comprehensive admin interface for content management
- **Responsive Design**: Mobile-first design with full responsive support