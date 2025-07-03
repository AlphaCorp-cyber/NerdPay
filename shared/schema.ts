import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("admin"), // admin, operator, developer
  department: text("department"), // IT, Operations, Risk, Compliance
  permissions: text("permissions").array().default([]), // array of permission strings
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  config: json("config"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  businessName: text("business_name").notNull(),
  businessType: text("business_type"),
  businessRegistrationNumber: text("business_registration_number"),
  taxNumber: text("tax_number"),
  bankAccount: text("bank_account"),
  publicKey: text("public_key").notNull().unique(),
  secretKey: text("secret_key").notNull().unique(),
  sandboxPublicKey: text("sandbox_public_key").notNull().unique(),
  sandboxSecretKey: text("sandbox_secret_key").notNull().unique(),
  webhookUrl: text("webhook_url"),
  sandboxWebhookUrl: text("sandbox_webhook_url"),
  environment: text("environment").notNull().default("sandbox"), // sandbox, live
  kycStatus: text("kyc_status").notNull().default("pending"), // pending, verified, rejected
  riskLevel: text("risk_level").notNull().default("medium"), // low, medium, high
  monthlyTransactionLimit: decimal("monthly_transaction_limit", { precision: 15, scale: 2 }).default("100000.00"),
  dailyTransactionLimit: decimal("daily_transaction_limit", { precision: 15, scale: 2 }).default("10000.00"),
  isActive: boolean("is_active").notNull().default(true),
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  merchantId: integer("merchant_id").references(() => merchants.id),
  paymentMethodId: integer("payment_method_id").references(() => paymentMethods.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"), // pending, processing, success, failed, cancelled, refunded
  paymentGateway: text("payment_gateway"), // ecocash, visa, mastercard, etc
  gatewayTransactionId: text("gateway_transaction_id"),
  gatewayResponse: json("gateway_response"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  customerName: text("customer_name"),
  billingAddress: json("billing_address"),
  description: text("description"),
  merchantReference: text("merchant_reference"),
  environment: text("environment").notNull().default("sandbox"), // sandbox, live
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }),
  fraudFlags: text("fraud_flags").array().default([]),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0.00"),
  settlementDate: timestamp("settlement_date"),
  refundedAmount: decimal("refunded_amount", { precision: 10, scale: 2 }).default("0.00"),
  metadata: json("metadata"),
  processedBy: integer("processed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").references(() => merchants.id),
  url: text("url").notNull(),
  events: text("events").array().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  secret: text("secret").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").references(() => merchants.id),
  keyType: text("key_type").notNull(), // public, secret
  keyValue: text("key_value").notNull().unique(),
  environment: text("environment").notNull().default("sandbox"), // sandbox, live
  permissions: text("permissions").array().default([]), // payments, refunds, webhooks, etc
  ipWhitelist: text("ip_whitelist").array().default([]),
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Add audit logs table for banking compliance
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(), // login, create_merchant, approve_transaction, etc
  resource: text("resource").notNull(), // merchant, transaction, user, etc
  resourceId: text("resource_id"),
  details: json("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  environment: text("environment").notNull().default("sandbox"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Add compliance documents table
export const complianceDocuments = pgTable("compliance_documents", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").references(() => merchants.id),
  documentType: text("document_type").notNull(), // kyc, business_license, tax_certificate, etc
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  expiryDate: timestamp("expiry_date"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Add settlement reports table
export const settlementReports = pgTable("settlement_reports", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").references(() => merchants.id),
  reportDate: timestamp("report_date").notNull(),
  totalTransactions: integer("total_transactions").notNull().default(0),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull().default("0.00"),
  totalFees: decimal("total_fees", { precision: 15, scale: 2 }).notNull().default("0.00"),
  netAmount: decimal("net_amount", { precision: 15, scale: 2 }).notNull().default("0.00"),
  status: text("status").notNull().default("pending"), // pending, processed, failed
  bankReference: text("bank_reference"),
  processedAt: timestamp("processed_at"),
  environment: text("environment").notNull().default("sandbox"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastLogin: true });
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({ id: true, createdAt: true });
export const insertMerchantSchema = createInsertSchema(merchants).omit({ 
  id: true, 
  createdAt: true, 
  publicKey: true, 
  secretKey: true, 
  sandboxPublicKey: true, 
  sandboxSecretKey: true,
  approvedAt: true 
});
export const insertTransactionSchema = createInsertSchema(transactions).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  processedBy: true 
});
export const insertWebhookSchema = createInsertSchema(webhooks).omit({ id: true, createdAt: true });
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ 
  id: true, 
  createdAt: true, 
  lastUsed: true, 
  createdBy: true 
});
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const insertComplianceDocumentSchema = createInsertSchema(complianceDocuments).omit({ 
  id: true, 
  uploadedAt: true, 
  reviewedAt: true 
});
export const insertSettlementReportSchema = createInsertSchema(settlementReports).omit({ 
  id: true, 
  createdAt: true, 
  processedAt: true 
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = z.infer<typeof insertMerchantSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type ComplianceDocument = typeof complianceDocuments.$inferSelect;
export type InsertComplianceDocument = z.infer<typeof insertComplianceDocumentSchema>;
export type SettlementReport = typeof settlementReports.$inferSelect;
export type InsertSettlementReport = z.infer<typeof insertSettlementReportSchema>;
