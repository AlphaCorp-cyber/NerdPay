import { 
  users, paymentMethods, merchants, transactions, webhooks, apiKeys,
  type User, type InsertUser, type PaymentMethod, type InsertPaymentMethod,
  type Merchant, type InsertMerchant, type Transaction, type InsertTransaction,
  type Webhook, type InsertWebhook, type ApiKey, type InsertApiKey
} from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Payment Methods
  getPaymentMethods(): Promise<PaymentMethod[]>;
  getPaymentMethod(id: number): Promise<PaymentMethod | undefined>;
  createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: number, updates: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined>;
  deletePaymentMethod(id: number): Promise<boolean>;

  // Merchants
  getMerchants(): Promise<Merchant[]>;
  getMerchant(id: number): Promise<Merchant | undefined>;
  getMerchantByPublicKey(publicKey: string): Promise<Merchant | undefined>;
  createMerchant(merchant: InsertMerchant): Promise<Merchant>;
  updateMerchant(id: number, updates: Partial<InsertMerchant>): Promise<Merchant | undefined>;
  deleteMerchant(id: number): Promise<boolean>;

  // Transactions
  getTransactions(limit?: number, offset?: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionByTransactionId(transactionId: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, updates: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  getMerchantTransactions(merchantId: number, limit?: number, offset?: number): Promise<Transaction[]>;

  // Webhooks
  getWebhooks(merchantId?: number): Promise<Webhook[]>;
  getWebhook(id: number): Promise<Webhook | undefined>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  updateWebhook(id: number, updates: Partial<InsertWebhook>): Promise<Webhook | undefined>;
  deleteWebhook(id: number): Promise<boolean>;

  // API Keys
  getApiKeys(merchantId: number): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  deleteApiKey(id: number): Promise<boolean>;

  // Analytics
  getDashboardStats(): Promise<{
    totalTransactions: number;
    totalVolume: string;
    successRate: string;
    activeMerchants: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private paymentMethods: Map<number, PaymentMethod> = new Map();
  private merchants: Map<number, Merchant> = new Map();
  private transactions: Map<number, Transaction> = new Map();
  private webhooks: Map<number, Webhook> = new Map();
  private apiKeys: Map<number, ApiKey> = new Map();
  private currentId: number = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default admin user
    const adminUser: User = {
      id: this.currentId++,
      username: "admin",
      password: "admin123",
      email: "admin@zimpay.co.zw",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create default payment methods
    const defaultPaymentMethods: PaymentMethod[] = [
      {
        id: this.currentId++,
        name: "EcoCash",
        type: "mobile_money",
        description: "Mobile money payments",
        icon: "mobile-alt",
        isActive: true,
        config: { provider: "econet" },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "Visa/MasterCard",
        type: "card",
        description: "Card payments",
        icon: "credit-card",
        isActive: true,
        config: { acceptedCards: ["visa", "mastercard"] },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "OneWallet",
        type: "digital_wallet",
        description: "Digital wallet",
        icon: "wallet",
        isActive: false,
        config: { provider: "onewallet" },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "Telecash",
        type: "mobile_money",
        description: "Mobile money",
        icon: "mobile-alt",
        isActive: false,
        config: { provider: "telecel" },
        createdAt: new Date(),
      },
    ];

    defaultPaymentMethods.forEach(pm => this.paymentMethods.set(pm.id, pm));

    // Create sample merchants
    const sampleMerchants: Merchant[] = [
      {
        id: this.currentId++,
        name: "John Doe",
        email: "john@example.com",
        phone: "0771234567",
        businessName: "Tech Solutions Ltd",
        businessType: "Technology",
        publicKey: `pk_test_${nanoid(24)}`,
        secretKey: `sk_test_${nanoid(32)}`,
        webhookUrl: "https://example.com/webhook",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "Jane Smith",
        email: "jane@retail.com",
        phone: "0772345678",
        businessName: "Retail Plus",
        businessType: "Retail",
        publicKey: `pk_test_${nanoid(24)}`,
        secretKey: `sk_test_${nanoid(32)}`,
        webhookUrl: "https://retail.com/webhook",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    sampleMerchants.forEach(merchant => this.merchants.set(merchant.id, merchant));

    // Create sample transactions
    const sampleTransactions: Transaction[] = [
      {
        id: this.currentId++,
        transactionId: "TXN001234",
        merchantId: 1,
        paymentMethodId: 1,
        amount: "125.50",
        currency: "USD",
        status: "success",
        customerEmail: "customer@example.com",
        customerPhone: "0771234567",
        description: "Product purchase",
        metadata: { productId: "prod_123" },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: this.currentId++,
        transactionId: "TXN001235",
        merchantId: 1,
        paymentMethodId: 2,
        amount: "89.99",
        currency: "USD",
        status: "pending",
        customerEmail: "customer2@example.com",
        customerPhone: "0772345678",
        description: "Service payment",
        metadata: { serviceId: "serv_456" },
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        id: this.currentId++,
        transactionId: "TXN001236",
        merchantId: 2,
        paymentMethodId: 3,
        amount: "45.00",
        currency: "USD",
        status: "failed",
        customerEmail: "customer3@example.com",
        customerPhone: "0773456789",
        description: "Subscription payment",
        metadata: { subscriptionId: "sub_789" },
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: this.currentId++,
        transactionId: "TXN001237",
        merchantId: 2,
        paymentMethodId: 2,
        amount: "199.99",
        currency: "USD",
        status: "success",
        customerEmail: "customer4@example.com",
        customerPhone: "0774567890",
        description: "Product bundle",
        metadata: { bundleId: "bundle_101" },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ];

    sampleTransactions.forEach(txn => this.transactions.set(txn.id, txn));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values());
  }

  async getPaymentMethod(id: number): Promise<PaymentMethod | undefined> {
    return this.paymentMethods.get(id);
  }

  async createPaymentMethod(insertPaymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const paymentMethod: PaymentMethod = {
      ...insertPaymentMethod,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.paymentMethods.set(paymentMethod.id, paymentMethod);
    return paymentMethod;
  }

  async updatePaymentMethod(id: number, updates: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined> {
    const paymentMethod = this.paymentMethods.get(id);
    if (!paymentMethod) return undefined;

    const updated: PaymentMethod = { ...paymentMethod, ...updates };
    this.paymentMethods.set(id, updated);
    return updated;
  }

  async deletePaymentMethod(id: number): Promise<boolean> {
    return this.paymentMethods.delete(id);
  }

  // Merchants
  async getMerchants(): Promise<Merchant[]> {
    return Array.from(this.merchants.values());
  }

  async getMerchant(id: number): Promise<Merchant | undefined> {
    return this.merchants.get(id);
  }

  async getMerchantByPublicKey(publicKey: string): Promise<Merchant | undefined> {
    return Array.from(this.merchants.values()).find(merchant => merchant.publicKey === publicKey);
  }

  async createMerchant(insertMerchant: InsertMerchant): Promise<Merchant> {
    const merchant: Merchant = {
      ...insertMerchant,
      id: this.currentId++,
      publicKey: `pk_test_${nanoid(24)}`,
      secretKey: `sk_test_${nanoid(32)}`,
      createdAt: new Date(),
    };
    this.merchants.set(merchant.id, merchant);
    return merchant;
  }

  async updateMerchant(id: number, updates: Partial<InsertMerchant>): Promise<Merchant | undefined> {
    const merchant = this.merchants.get(id);
    if (!merchant) return undefined;

    const updated: Merchant = { ...merchant, ...updates };
    this.merchants.set(id, updated);
    return updated;
  }

  async deleteMerchant(id: number): Promise<boolean> {
    return this.merchants.delete(id);
  }

  // Transactions
  async getTransactions(limit: number = 50, offset: number = 0): Promise<Transaction[]> {
    const allTransactions = Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    return allTransactions.slice(offset, offset + limit);
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionByTransactionId(transactionId: string): Promise<Transaction | undefined> {
    return Array.from(this.transactions.values()).find(txn => txn.transactionId === transactionId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      ...insertTransaction,
      id: this.currentId++,
      transactionId: insertTransaction.transactionId || `TXN${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updated: Transaction = { ...transaction, ...updates, updatedAt: new Date() };
    this.transactions.set(id, updated);
    return updated;
  }

  async getMerchantTransactions(merchantId: number, limit: number = 50, offset: number = 0): Promise<Transaction[]> {
    const merchantTransactions = Array.from(this.transactions.values())
      .filter(txn => txn.merchantId === merchantId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    return merchantTransactions.slice(offset, offset + limit);
  }

  // Webhooks
  async getWebhooks(merchantId?: number): Promise<Webhook[]> {
    const allWebhooks = Array.from(this.webhooks.values());
    return merchantId ? allWebhooks.filter(wh => wh.merchantId === merchantId) : allWebhooks;
  }

  async getWebhook(id: number): Promise<Webhook | undefined> {
    return this.webhooks.get(id);
  }

  async createWebhook(insertWebhook: InsertWebhook): Promise<Webhook> {
    const webhook: Webhook = {
      ...insertWebhook,
      id: this.currentId++,
      secret: `wh_${nanoid(32)}`,
      createdAt: new Date(),
    };
    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  async updateWebhook(id: number, updates: Partial<InsertWebhook>): Promise<Webhook | undefined> {
    const webhook = this.webhooks.get(id);
    if (!webhook) return undefined;

    const updated: Webhook = { ...webhook, ...updates };
    this.webhooks.set(id, updated);
    return updated;
  }

  async deleteWebhook(id: number): Promise<boolean> {
    return this.webhooks.delete(id);
  }

  // API Keys
  async getApiKeys(merchantId: number): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(key => key.merchantId === merchantId);
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const apiKey: ApiKey = {
      ...insertApiKey,
      id: this.currentId++,
      createdAt: new Date(),
    };
    this.apiKeys.set(apiKey.id, apiKey);
    return apiKey;
  }

  async deleteApiKey(id: number): Promise<boolean> {
    return this.apiKeys.delete(id);
  }

  // Analytics
  async getDashboardStats(): Promise<{
    totalTransactions: number;
    totalVolume: string;
    successRate: string;
    activeMerchants: number;
  }> {
    const allTransactions = Array.from(this.transactions.values());
    const totalTransactions = allTransactions.length;
    const totalVolume = allTransactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
    const successfulTransactions = allTransactions.filter(txn => txn.status === "success").length;
    const successRate = totalTransactions > 0 ? ((successfulTransactions / totalTransactions) * 100).toFixed(1) : "0";
    const activeMerchants = Array.from(this.merchants.values()).filter(merchant => merchant.isActive).length;

    return {
      totalTransactions,
      totalVolume: totalVolume.toFixed(2),
      successRate: `${successRate}%`,
      activeMerchants,
    };
  }
}

export const storage = new MemStorage();
