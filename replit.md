# ZimPay Gateway - Payment Processing System

## Overview

ZimPay Gateway is a comprehensive payment processing system built with modern web technologies. The application provides an admin dashboard for managing payment methods, merchants, transactions, and webhooks. It features a React frontend with TypeScript, a Node.js/Express backend, and uses PostgreSQL with Drizzle ORM for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and building
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware

### Key Components

#### Database Schema
The system uses the following main entities:
- **Users**: Admin users with role-based access
- **Payment Methods**: Configurable payment options (mobile money, cards, digital wallets)
- **Merchants**: Business accounts with API keys and webhook configurations
- **Transactions**: Payment records with status tracking and metadata
- **Webhooks**: Event notification endpoints for merchants
- **API Keys**: Authentication tokens for merchant API access

#### Frontend Pages
- **Dashboard**: Overview with metrics and recent transactions
- **Payment Methods**: CRUD operations for payment options
- **Transactions**: Transaction listing and filtering
- **Merchants**: Merchant account management
- **Webhooks**: Webhook endpoint configuration
- **API Documentation**: Developer integration guide
- **Settings**: System configuration

#### API Endpoints
- `/api/dashboard/stats` - Dashboard metrics
- `/api/payment-methods` - Payment method management
- `/api/merchants` - Merchant account operations
- `/api/transactions` - Transaction data access
- `/api/webhooks` - Webhook configuration
- `/api/api-keys` - API key management

## Data Flow

1. **Admin Dashboard**: Administrators manage payment methods, merchants, and view transaction data
2. **Merchant Integration**: Merchants use API keys to process payments through the gateway
3. **Transaction Processing**: Payments are processed through configured payment methods
4. **Webhook Notifications**: Real-time event notifications sent to merchant endpoints
5. **Analytics**: Transaction data aggregated for dashboard metrics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Unstyled, accessible UI components
- **react-hook-form**: Form handling and validation
- **zod**: Schema validation
- **nanoid**: Unique ID generation
- **date-fns**: Date manipulation utilities

### Development Dependencies
- **vite**: Frontend build tool and dev server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **eslint**: Code linting
- **drizzle-kit**: Database migration tool

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: TSX for TypeScript execution
- **Database**: Neon Database (development instance)
- **Environment**: Replit-optimized with cartographer plugin

### Production Build
- **Frontend**: Vite build to static assets
- **Backend**: ESBuild compilation to single bundle
- **Database**: Neon Database (production instance)
- **Deployment**: Single Node.js process serving API and static files

### Database Management
- **Migrations**: Drizzle Kit for schema changes
- **Connection**: Pooled connections via Neon serverless driver
- **Environment**: DATABASE_URL environment variable required

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```