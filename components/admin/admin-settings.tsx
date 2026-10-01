"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Key } from "lucide-react"

export function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: "mySafety24x7",
    supportEmail: "support@mysafety24x7.com",
    supportPhone: "+91-XXXXXXXXXX",
    businessAddress: "Sector 12, Delhi, India",
    timezone: "IST",
    paymentPublicKey: "pk_live_••••••••••••••••••",
    paymentSecretKey: "sk_live_••••••••••••••••••",
    paymentGateway: "Stripe",
  })

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure system settings, security, and regional preferences.</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="payment">Payment Gateway</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Name</label>
                <Input
                  value={settings.platformName}
                  onChange={(e) => handleInputChange("platformName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Support Email</label>
                <Input
                  value={settings.supportEmail}
                  onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Support Phone</label>
                <Input
                  value={settings.supportPhone}
                  onChange={(e) => handleInputChange("supportPhone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Business Address</label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  rows={3}
                  defaultValue="Sector 12, Delhi, India"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={settings.timezone}
                  onChange={(e) => handleInputChange("timezone", e.target.value)}
                >
                  <option value="IST">IST (Indian Standard Time)</option>
                  <option value="GST">GST (Gulf Standard Time)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage authentication, permissions, and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Require 2FA for admin login</p>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">QR Code Generation Authentication</h3>
                    <p className="text-sm text-muted-foreground mt-1">Require verification for QR generation</p>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">Session Timeout</h3>
                    <p className="text-sm text-muted-foreground mt-1">Auto-logout inactive sessions</p>
                  </div>
                  <select className="px-3 py-1 border border-border rounded text-sm bg-background">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">Activity Logging</h3>
                    <p className="text-sm text-muted-foreground mt-1">Log all admin activities</p>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </label>
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Localization Settings</CardTitle>
              <CardDescription>Configure languages and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Supported Languages</label>
                <div className="space-y-2">
                  {["English", "Hindi", "Tamil", "Telugu", "Kannada", "Bengali", "Marathi", "Odia", "Arabic"].map(
                    (lang) => (
                      <label key={lang} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          defaultChecked={lang === "English" || lang === "Hindi"}
                        />
                        <span className="text-sm">{lang}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Supported Regions</label>
                <div className="space-y-2">
                  {["India", "UAE", "Saudi Arabia", "Qatar", "Kuwait"].map((region) => (
                    <label key={region} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        defaultChecked={region === "India" || region === "UAE"}
                      />
                      <span className="text-sm">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                Save Language Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Configuration Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Configure third-party API integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Video Call API</h3>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <Input placeholder="API Key" type="password" defaultValue="••••••••••••" />
                  <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                    Test Connection
                  </Button>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Geolocation API</h3>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <Input placeholder="API Key" type="password" defaultValue="••••••••••••" />
                  <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                    Test Connection
                  </Button>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Payment Gateway</h3>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <Input placeholder="API Key" />
                  <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                    Configure
                  </Button>
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                Save API Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Gateway Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Payment Gateway</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={settings.paymentGateway}
                  onChange={(e) => handleInputChange("paymentGateway", e.target.value)}
                >
                  <option value="Stripe">Stripe</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="PayU">PayU</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Public Key</label>
                <Input
                  type="password"
                  value={settings.paymentPublicKey}
                  onChange={(e) => handleInputChange("paymentPublicKey", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Secret Key</label>
                <Input
                  type="password"
                  value={settings.paymentSecretKey}
                  onChange={(e) => handleInputChange("paymentSecretKey", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-100/20 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-green-700">Payment gateway is properly configured</span>
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="w-4 h-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
