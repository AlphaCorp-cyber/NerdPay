# BankPay Gateway - Banking Payment Processing System

## Overview

BankPay Gateway is a comprehensive banking-grade payment processing system built for financial institutions. The application provides an admin dashboard for managing payment methods, merchants, transactions, compliance, and settlement operations. It features sandbox and live environment modes, advanced compliance monitoring, KYC management, and comprehensive audit trails. Built with React frontend, Node.js/Express backend, and PostgreSQL with Drizzle ORM.

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
- **Transactions**: Transaction listing, filtering, and monitoring
- **Merchants**: Comprehensive merchant onboarding and KYC management
- **Payment Methods**: CRUD operations for payment options
- **Compliance**: KYC management, document review, audit logs, and risk assessment
- **Settlement**: Financial settlement reports, processing, and banking integration
- **Webhooks**: Webhook endpoint configuration and testing
- **API Documentation**: Developer integration guide with sandbox/live examples
- **Settings**: System configuration with environment-specific settings

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

## Banking Features

### Environment Management
- **Sandbox Mode**: Safe testing environment with test data and credentials
- **Live Mode**: Production environment with real transaction processing
- **Environment Toggle**: Easy switching between sandbox and live modes in the admin interface

### Compliance & KYC
- **KYC Management**: Complete Know Your Customer verification workflow
- **Document Review**: Upload and review business registration, tax certificates, and identification documents
- **Risk Assessment**: Automated risk scoring and manual risk level assignment
- **Audit Logs**: Comprehensive logging of all admin actions for compliance tracking
- **Regulatory Reporting**: Built-in reports for financial regulatory compliance

### Settlement & Banking Integration
- **Automated Settlement**: Daily/weekly settlement report generation
- **Bank Integration**: Direct settlement to merchant bank accounts
- **Fee Management**: Configurable transaction fees and revenue tracking
- **Settlement Reports**: Detailed financial reports with transaction breakdowns
- **Reconciliation**: Bank reconciliation tools and dispute management

### Enhanced Security
- **API Key Management**: Environment-specific API keys with permission controls
- **IP Whitelisting**: Restrict API access to authorized IP addresses
- **Transaction Limits**: Daily and monthly transaction limits per merchant
- **Fraud Detection**: Risk scoring and fraud flag detection

## Changelog

```
Changelog:
- July 03, 2025. Transformed into banking-grade payment gateway
  - Added sandbox/live environment separation
  - Implemented comprehensive KYC and compliance management
  - Added settlement reporting and bank integration features
  - Enhanced security with risk assessment and audit logging
  - Updated UI for banking-specific workflows
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```