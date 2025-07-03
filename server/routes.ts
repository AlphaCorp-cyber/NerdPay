import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPaymentMethodSchema, insertMerchantSchema, insertTransactionSchema, insertWebhookSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Payment Methods
  app.get("/api/payment-methods", async (req, res) => {
    try {
      const paymentMethods = await storage.getPaymentMethods();
      res.json(paymentMethods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment methods" });
    }
  });

  app.post("/api/payment-methods", async (req, res) => {
    try {
      const result = insertPaymentMethodSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid payment method data", details: result.error.issues });
      }
      
      const paymentMethod = await storage.createPaymentMethod(result.data);
      res.status(201).json(paymentMethod);
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment method" });
    }
  });

  app.put("/api/payment-methods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertPaymentMethodSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid payment method data", details: result.error.issues });
      }
      
      const paymentMethod = await storage.updatePaymentMethod(id, result.data);
      if (!paymentMethod) {
        return res.status(404).json({ error: "Payment method not found" });
      }
      
      res.json(paymentMethod);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment method" });
    }
  });

  app.delete("/api/payment-methods/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePaymentMethod(id);
      if (!deleted) {
        return res.status(404).json({ error: "Payment method not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payment method" });
    }
  });

  // Merchants
  app.get("/api/merchants", async (req, res) => {
    try {
      const merchants = await storage.getMerchants();
      res.json(merchants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch merchants" });
    }
  });

  app.post("/api/merchants", async (req, res) => {
    try {
      const result = insertMerchantSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid merchant data", details: result.error.issues });
      }
      
      const merchant = await storage.createMerchant(result.data);
      res.status(201).json(merchant);
    } catch (error) {
      res.status(500).json({ error: "Failed to create merchant" });
    }
  });

  app.put("/api/merchants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertMerchantSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid merchant data", details: result.error.issues });
      }
      
      const merchant = await storage.updateMerchant(id, result.data);
      if (!merchant) {
        return res.status(404).json({ error: "Merchant not found" });
      }
      
      res.json(merchant);
    } catch (error) {
      res.status(500).json({ error: "Failed to update merchant" });
    }
  });

  app.delete("/api/merchants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMerchant(id);
      if (!deleted) {
        return res.status(404).json({ error: "Merchant not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete merchant" });
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const transactions = await storage.getTransactions(limit, offset);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransaction(id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  // Payment Processing API
  app.post("/api/process-payment", async (req, res) => {
    try {
      const schema = z.object({
        merchantId: z.number(),
        paymentMethodId: z.number(),
        amount: z.string(),
        currency: z.string().default("USD"),
        customerEmail: z.string().email().optional(),
        customerPhone: z.string().optional(),
        description: z.string().optional(),
        metadata: z.record(z.any()).optional(),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid payment data", details: result.error.issues });
      }

      const { merchantId, paymentMethodId, ...transactionData } = result.data;

      // Verify merchant exists
      const merchant = await storage.getMerchant(merchantId);
      if (!merchant || !merchant.isActive) {
        return res.status(404).json({ error: "Merchant not found or inactive" });
      }

      // Verify payment method exists
      const paymentMethod = await storage.getPaymentMethod(paymentMethodId);
      if (!paymentMethod || !paymentMethod.isActive) {
        return res.status(404).json({ error: "Payment method not found or inactive" });
      }

      // Create transaction
      const transaction = await storage.createTransaction({
        merchantId,
        paymentMethodId,
        transactionId: `TXN${Date.now()}${nanoid(6)}`,
        status: "pending",
        ...transactionData,
      });

      // Simulate payment processing
      setTimeout(async () => {
        // Randomly determine success/failure for demo
        const isSuccess = Math.random() > 0.1; // 90% success rate
        const status = isSuccess ? "success" : "failed";
        
        await storage.updateTransaction(transaction.id, { status });
        
        // TODO: Send webhook notification here
        console.log(`Payment ${transaction.transactionId} ${status}`);
      }, 2000);

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to process payment" });
    }
  });

  // Webhooks
  app.get("/api/webhooks", async (req, res) => {
    try {
      const merchantId = req.query.merchantId ? parseInt(req.query.merchantId as string) : undefined;
      const webhooks = await storage.getWebhooks(merchantId);
      res.json(webhooks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch webhooks" });
    }
  });

  app.post("/api/webhooks", async (req, res) => {
    try {
      const result = insertWebhookSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid webhook data", details: result.error.issues });
      }
      
      const webhook = await storage.createWebhook(result.data);
      res.status(201).json(webhook);
    } catch (error) {
      res.status(500).json({ error: "Failed to create webhook" });
    }
  });

  app.put("/api/webhooks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertWebhookSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid webhook data", details: result.error.issues });
      }
      
      const webhook = await storage.updateWebhook(id, result.data);
      if (!webhook) {
        return res.status(404).json({ error: "Webhook not found" });
      }
      
      res.json(webhook);
    } catch (error) {
      res.status(500).json({ error: "Failed to update webhook" });
    }
  });

  app.delete("/api/webhooks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteWebhook(id);
      if (!deleted) {
        return res.status(404).json({ error: "Webhook not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete webhook" });
    }
  });

  // Test webhook endpoint
  app.post("/api/test-webhook", async (req, res) => {
    try {
      const webhookId = parseInt(req.body.webhookId);
      const webhook = await storage.getWebhook(webhookId);
      
      if (!webhook) {
        return res.status(404).json({ error: "Webhook not found" });
      }

      // Simulate webhook test
      console.log(`Testing webhook: ${webhook.url}`);
      
      res.json({ message: "Webhook test initiated", status: "success" });
    } catch (error) {
      res.status(500).json({ error: "Failed to test webhook" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
