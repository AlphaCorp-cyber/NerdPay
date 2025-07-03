import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Book, Key, Webhook, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApiDocs() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Code copied to clipboard" });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">API Documentation</h2>
        <p className="text-gray-600">Integration guide and API reference for developers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Public Key</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("pk_test_abcd1234567890efgh")}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-50 rounded-md p-3">
                <code className="text-sm font-mono text-gray-800">pk_test_abcd1234567890efgh</code>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Secret Key</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard("sk_test_1234567890abcdefgh")}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-50 rounded-md p-3">
                <code className="text-sm font-mono text-gray-800">sk_test_1234567890abcdefgh</code>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Never expose your secret key in client-side code.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Webhook className="w-5 h-5 mr-2" />
              Webhook Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Payment Success</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="bg-gray-50 rounded-md p-3">
                <code className="text-sm font-mono text-gray-800">
                  https://api.example.com/webhooks/payment
                </code>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Payment Failed</span>
                <Badge className="bg-red-100 text-red-800">Active</Badge>
              </div>
              <div className="bg-gray-50 rounded-md p-3">
                <code className="text-sm font-mono text-gray-800">
                  https://api.example.com/webhooks/payment-failed
                </code>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Webhook className="w-4 h-4 mr-2" />
              Test Webhook
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Guide */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">1. Initialize Payment</h4>
              <div className="bg-gray-900 rounded-md p-4 relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`const payment = new ZimPay({
  publicKey: 'pk_test_abcd1234567890efgh',
  amount: 100,
  currency: 'USD',
  method: 'ecocash'
});

payment.process();`)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>{`// Initialize payment
const payment = new ZimPay({
  publicKey: 'pk_test_abcd1234567890efgh',
  amount: 100,
  currency: 'USD',
  method: 'ecocash'
});

payment.process();`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Process Payment via API</h4>
              <div className="bg-gray-900 rounded-md p-4 relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`curl -X POST https://api.zimpay.co.zw/api/process-payment \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_1234567890abcdefgh" \\
  -d '{
    "merchantId": 1,
    "paymentMethodId": 1,
    "amount": "100.00",
    "currency": "USD",
    "customerEmail": "customer@example.com",
    "description": "Product purchase"
  }'`)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>{`curl -X POST https://api.zimpay.co.zw/api/process-payment \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_1234567890abcdefgh" \\
  -d '{
    "merchantId": 1,
    "paymentMethodId": 1,
    "amount": "100.00",
    "currency": "USD",
    "customerEmail": "customer@example.com",
    "description": "Product purchase"
  }'`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Handle Webhook Response</h4>
              <div className="bg-gray-900 rounded-md p-4 relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`app.post('/webhook', (req, res) => {
  const signature = req.headers['x-zimpay-signature'];
  const payload = JSON.stringify(req.body);
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
    
  if (signature === expectedSignature) {
    // Process webhook event
    const { event, data } = req.body;
    
    if (event === 'payment.success') {
      // Handle successful payment
      console.log('Payment successful:', data.transactionId);
    }
  }
  
  res.status(200).send('OK');
});`)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>{`app.post('/webhook', (req, res) => {
  const signature = req.headers['x-zimpay-signature'];
  const payload = JSON.stringify(req.body);
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
    
  if (signature === expectedSignature) {
    // Process webhook event
    const { event, data } = req.body;
    
    if (event === 'payment.success') {
      // Handle successful payment
      console.log('Payment successful:', data.transactionId);
    }
  }
  
  res.status(200).send('OK');
});`}</code>
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Credentials */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">EcoCash Test</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Test Number:</span>
                  <span className="font-mono text-gray-800">0771234567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Test PIN:</span>
                  <span className="font-mono text-gray-800">1234</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Card Test</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Number:</span>
                  <span className="font-mono text-gray-800">4111111111111111</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CVV:</span>
                  <span className="font-mono text-gray-800">123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry:</span>
                  <span className="font-mono text-gray-800">12/25</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
