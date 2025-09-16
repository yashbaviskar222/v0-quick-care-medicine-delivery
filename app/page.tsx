"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Truck, Users, Clock, MapPin, DollarSign, Package } from "lucide-react"
import { MedicineCatalog } from "@/components/customer/medicine-catalog"
import { PrescriptionUpload } from "@/components/customer/prescription-upload"
import { OrderTracking } from "@/components/customer/order-tracking"
import { InventoryManagement } from "@/components/store-manager/inventory-management"
import { OrderProcessing } from "@/components/store-manager/order-processing"
import { AvailableOrders } from "@/components/delivery/available-orders"
import { CurrentDeliveries } from "@/components/delivery/current-deliveries"
import { EarningsHistory } from "@/components/delivery/earnings-history"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"customer" | "store_manager" | "delivery_boy" | null>(null)

  const handleLogin = (role: "customer" | "store_manager" | "delivery_boy") => {
    setIsLoggedIn(true)
    setUserRole(role)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
  }

  if (isLoggedIn && userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">QuickCare</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="capitalize">
                  {userRole.replace("_", " ")}
                </Badge>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {userRole === "customer" && <CustomerDashboard />}
          {userRole === "store_manager" && <StoreManagerDashboard />}
          {userRole === "delivery_boy" && <DeliveryBoyDashboard />}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">QuickCare</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-200">
                24/7 Available
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Your Health, Delivered Fast</h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty max-w-2xl mx-auto">
            Get your medicines delivered to your doorstep in 30 minutes. Licensed pharmacies, verified medicines,
            trusted delivery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Licensed & Verified</h3>
              <p className="text-gray-600 text-center">All medicines from certified pharmacies</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <Clock className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">30-Min Delivery</h3>
              <p className="text-gray-600 text-center">Fast delivery to your location</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <MapPin className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 text-center">Track your order every step</p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Access QuickCare</CardTitle>
              <CardDescription>Choose your role to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="customer">Customer</TabsTrigger>
                  <TabsTrigger value="store">Store</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery</TabsTrigger>
                </TabsList>

                <TabsContent value="customer" className="space-y-4">
                  <LoginForm
                    role="customer"
                    title="Customer Login"
                    description="Order medicines and track deliveries"
                    onLogin={() => handleLogin("customer")}
                  />
                </TabsContent>

                <TabsContent value="store" className="space-y-4">
                  <LoginForm
                    role="store_manager"
                    title="Store Manager Login"
                    description="Manage inventory and process orders"
                    onLogin={() => handleLogin("store_manager")}
                  />
                </TabsContent>

                <TabsContent value="delivery" className="space-y-4">
                  <LoginForm
                    role="delivery_boy"
                    title="Delivery Partner Login"
                    description="Accept and deliver orders"
                    onLogin={() => handleLogin("delivery_boy")}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LoginForm({
  role,
  title,
  description,
  onLogin,
}: {
  role: string
  title: string
  description: string
  onLogin: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${role}-email`}>Email</Label>
        <Input
          id={`${role}-email`}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${role}-password`}>Password</Label>
        <Input
          id={`${role}-password`}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>

      <div className="text-center">
        <Button variant="link" className="text-sm">
          Don't have an account? Sign up
        </Button>
      </div>
    </form>
  )
}

function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "catalog" | "prescription" | "orders">("overview")

  if (activeTab === "catalog") {
    return <MedicineCatalog />
  }

  if (activeTab === "prescription") {
    return <PrescriptionUpload />
  }

  if (activeTab === "orders") {
    return <OrderTracking />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Customer Dashboard</h2>
        <Button>
          <Heart className="h-4 w-4 mr-2" />
          Emergency Order
        </Button>
      </div>

      <div className="flex gap-2 border-b">
        <Button variant={activeTab === "overview" ? "default" : "ghost"} onClick={() => setActiveTab("overview")}>
          Overview
        </Button>
        <Button variant={activeTab === "catalog" ? "default" : "ghost"} onClick={() => setActiveTab("catalog")}>
          Browse Medicines
        </Button>
        <Button
          variant={activeTab === "prescription" ? "default" : "ghost"}
          onClick={() => setActiveTab("prescription")}
        >
          Upload Prescription
        </Button>
        <Button variant={activeTab === "orders" ? "default" : "ghost"} onClick={() => setActiveTab("orders")}>
          My Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setActiveTab("catalog")}>
              Browse Medicines
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => setActiveTab("prescription")}
            >
              Upload Prescription
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => setActiveTab("orders")}
            >
              Track Order
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order #ORD001</span>
                <Badge className="bg-orange-100 text-orange-800 text-xs">In Transit</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order #ORD002</span>
                <Badge className="bg-green-100 text-green-800 text-xs">Delivered</Badge>
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto mt-2" onClick={() => setActiveTab("orders")}>
              View all orders →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">Complete your health profile for better recommendations</p>
            <Button variant="outline" size="sm">
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Medicine Storage</h4>
              <p className="text-sm text-blue-800">Store medicines in a cool, dry place away from direct sunlight.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Prescription Safety</h4>
              <p className="text-sm text-green-800">Always complete the full course of antibiotics as prescribed.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StoreManagerDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "orders" | "analytics">("overview")

  if (activeTab === "inventory") {
    return <InventoryManagement />
  }

  if (activeTab === "orders") {
    return <OrderProcessing />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Store Manager Dashboard</h2>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      <div className="flex gap-2 border-b">
        <Button variant={activeTab === "overview" ? "default" : "ghost"} onClick={() => setActiveTab("overview")}>
          Overview
        </Button>
        <Button variant={activeTab === "inventory" ? "default" : "ghost"} onClick={() => setActiveTab("inventory")}>
          Inventory
        </Button>
        <Button variant={activeTab === "orders" ? "default" : "ghost"} onClick={() => setActiveTab("orders")}>
          Orders
        </Button>
        <Button variant={activeTab === "analytics" ? "default" : "ghost"} onClick={() => setActiveTab("analytics")}>
          Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setActiveTab("inventory")}>
              Manage Inventory
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => setActiveTab("orders")}
            >
              Process Orders
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => setActiveTab("analytics")}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending:</span>
                <span className="font-semibold text-yellow-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing:</span>
                <span className="font-semibold text-blue-600">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ready:</span>
                <span className="font-semibold text-green-600">1</span>
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto mt-3" onClick={() => setActiveTab("orders")}>
              View all orders →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Low Stock:</span>
                <span className="font-semibold text-yellow-600">5 items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Out of Stock:</span>
                <span className="font-semibold text-red-600">2 items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expiring Soon:</span>
                <span className="font-semibold text-orange-600">3 items</span>
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto mt-3" onClick={() => setActiveTab("inventory")}>
              Manage inventory →
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Sales Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">₹12,450</p>
              <p className="text-sm text-blue-800">Total Sales</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">28</p>
              <p className="text-sm text-green-800">Orders Completed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">156</p>
              <p className="text-sm text-purple-800">Items Sold</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">₹445</p>
              <p className="text-sm text-orange-800">Avg Order Value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DeliveryBoyDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "available" | "current" | "earnings">("overview")
  const [isOnline, setIsOnline] = useState(false)

  if (activeTab === "available") {
    return <AvailableOrders />
  }

  if (activeTab === "current") {
    return <CurrentDeliveries />
  }

  if (activeTab === "earnings") {
    return <EarningsHistory />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Delivery Partner Dashboard</h2>
        <Button
          onClick={() => setIsOnline(!isOnline)}
          className={isOnline ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
        >
          <Truck className="h-4 w-4 mr-2" />
          {isOnline ? "Go Offline" : "Go Online"}
        </Button>
      </div>

      <Card className={`border-l-4 ${isOnline ? "border-l-green-500 bg-green-50" : "border-l-gray-500 bg-gray-50"}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}></div>
              <div>
                <p className="font-medium">{isOnline ? "You're Online" : "You're Offline"}</p>
                <p className="text-sm text-gray-600">
                  {isOnline ? "Ready to receive delivery orders" : "Go online to start receiving orders"}
                </p>
              </div>
            </div>
            {isOnline && <Badge className="bg-green-100 text-green-800">Available for deliveries</Badge>}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 border-b">
        <Button variant={activeTab === "overview" ? "default" : "ghost"} onClick={() => setActiveTab("overview")}>
          Overview
        </Button>
        <Button variant={activeTab === "available" ? "default" : "ghost"} onClick={() => setActiveTab("available")}>
          Available Orders
        </Button>
        <Button variant={activeTab === "current" ? "default" : "ghost"} onClick={() => setActiveTab("current")}>
          Current Deliveries
        </Button>
        <Button variant={activeTab === "earnings" ? "default" : "ghost"} onClick={() => setActiveTab("earnings")}>
          Earnings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setActiveTab("available")} disabled={!isOnline}>
              View Available Orders
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => setActiveTab("current")}
            >
              Current Deliveries
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => setActiveTab("earnings")}
            >
              View Earnings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Deliveries:</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Earnings:</span>
                <span className="font-semibold text-green-600">₹150</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-semibold">12.5 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-semibold">4.8 ⭐</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion Rate</span>
                  <span>98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "98%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>On-time Delivery</span>
                  <span>95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>This Week's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">28</p>
              <p className="text-sm text-blue-800">Total Deliveries</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">₹840</p>
              <p className="text-sm text-green-800">Total Earnings</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">85.2 km</p>
              <p className="text-sm text-purple-800">Distance Covered</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">18h 30m</p>
              <p className="text-sm text-orange-800">Active Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
