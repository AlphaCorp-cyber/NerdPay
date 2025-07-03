import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Mail, 
  Globe, 
  Database, 
  Save,
  RefreshCw,
  Key,
  CreditCard,
  DollarSign
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "ZimPay Gateway",
    supportEmail: "support@zimpay.co.zw",
    defaultCurrency: "USD",
    timezone: "Africa/Harare",
    maintenanceMode: false,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: false,
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    passwordExpiry: "90",
    apiRateLimit: "1000",
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    defaultPaymentMethod: "ecocash",
    minTransactionAmount: "1.00",
    maxTransactionAmount: "10000.00",
    transactionFee: "2.5",
    autoSettlement: true,
    settlementDelay: "24",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    webhookNotifications: true,
    smsNotifications: false,
    transactionAlerts: true,
    systemAlerts: true,
    failureAlerts: true,
  });

  const handleSave = async (section: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({ title: "Success", description: `${section} settings saved successfully` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (section: string) => {
    if (confirm(`Are you sure you want to reset ${section} settings to default values?`)) {
      toast({ title: "Info", description: `${section} settings reset to defaults` });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure your payment gateway settings</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select value={generalSettings.defaultCurrency} onValueChange={(value) => setGeneralSettings({ ...generalSettings, defaultCurrency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="ZWL">ZWL - Zimbabwe Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Harare">Africa/Harare</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="Africa/Johannesburg">Africa/Johannesburg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                checked={generalSettings.maintenanceMode}
                onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
              />
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => handleReset("General")}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSave("General")} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                <Input
                  id="apiRateLimit"
                  type="number"
                  value={securitySettings.apiRateLimit}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, apiRateLimit: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requireTwoFactor"
                checked={securitySettings.requireTwoFactor}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireTwoFactor: checked })}
              />
              <Label htmlFor="requireTwoFactor">Require Two-Factor Authentication</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => handleReset("Security")}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSave("Security")} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultPaymentMethod">Default Payment Method</Label>
                <Select value={paymentSettings.defaultPaymentMethod} onValueChange={(value) => setPaymentSettings({ ...paymentSettings, defaultPaymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecocash">EcoCash</SelectItem>
                    <SelectItem value="card">Card Payment</SelectItem>
                    <SelectItem value="onewallet">OneWallet</SelectItem>
                    <SelectItem value="telecash">Telecash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionFee">Transaction Fee (%)</Label>
                <Input
                  id="transactionFee"
                  type="number"
                  step="0.1"
                  value={paymentSettings.transactionFee}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, transactionFee: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minTransactionAmount">Minimum Transaction Amount</Label>
                <Input
                  id="minTransactionAmount"
                  type="number"
                  step="0.01"
                  value={paymentSettings.minTransactionAmount}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, minTransactionAmount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTransactionAmount">Maximum Transaction Amount</Label>
                <Input
                  id="maxTransactionAmount"
                  type="number"
                  step="0.01"
                  value={paymentSettings.maxTransactionAmount}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, maxTransactionAmount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settlementDelay">Settlement Delay (hours)</Label>
              <Input
                id="settlementDelay"
                type="number"
                value={paymentSettings.settlementDelay}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, settlementDelay: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoSettlement"
                checked={paymentSettings.autoSettlement}
                onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, autoSettlement: checked })}
              />
              <Label htmlFor="autoSettlement">Auto Settlement</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => handleReset("Payment")}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSave("Payment")} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="webhookNotifications">Webhook Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via webhooks</p>
                </div>
                <Switch
                  id="webhookNotifications"
                  checked={notificationSettings.webhookNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, webhookNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via SMS</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="transactionAlerts">Transaction Alerts</Label>
                  <p className="text-sm text-gray-500">Alerts for transaction events</p>
                </div>
                <Switch
                  id="transactionAlerts"
                  checked={notificationSettings.transactionAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, transactionAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemAlerts">System Alerts</Label>
                  <p className="text-sm text-gray-500">Alerts for system events</p>
                </div>
                <Switch
                  id="systemAlerts"
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, systemAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="failureAlerts">Failure Alerts</Label>
                  <p className="text-sm text-gray-500">Alerts for failed transactions</p>
                </div>
                <Switch
                  id="failureAlerts"
                  checked={notificationSettings.failureAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, failureAlerts: checked })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => handleReset("Notification")}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => handleSave("Notification")} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Version</Label>
                <p className="text-sm text-gray-600">ZimPay Gateway v1.0.0</p>
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <p className="text-sm text-gray-600">Development</p>
              </div>
              <div className="space-y-2">
                <Label>Database</Label>
                <p className="text-sm text-gray-600">In-Memory Storage</p>
              </div>
              <div className="space-y-2">
                <Label>Uptime</Label>
                <p className="text-sm text-gray-600">2 days, 14 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
