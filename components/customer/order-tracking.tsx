"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Clock, Package, Phone, Truck, CheckCircle, Star, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CustomerOrder {
  id: string
  orderDate: string
  status: "placed" | "confirmed" | "preparing" | "ready" | "picked_up" | "in_transit" | "delivered" | "cancelled"
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  deliveryAddress: string
  deliveryFee: number
  paymentMethod: "cod" | "online"
  paymentStatus: "pending" | "paid" | "failed"
  estimatedDelivery: string
  actualDelivery?: string
  deliveryPartner?: {
    name: string
    phone: string
    rating: number
  }
  trackingUpdates: Array<{
    status: string
    timestamp: string
    message: string
  }>
  prescriptionRequired: boolean
  prescriptionVerified: boolean
  canCancel: boolean
  canReorder: boolean
}

const customerOrders: CustomerOrder[] = [
  {
    id: "ORD001",
    orderDate: "2024-01-15T10:30:00Z",
    status: "in_transit",
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 25 },
      { name: "Amoxicillin 250mg", quantity: 1, price: 85 },
    ],
    totalAmount: 135,
    deliveryAddress: "123 Main St, Sector 15, Gurgaon, Haryana 122001",
    deliveryFee: 25,
    paymentMethod: "online",
    paymentStatus: "paid",
    estimatedDelivery: "2024-01-15T11:30:00Z",
    deliveryPartner: {
      name: "Raj Kumar",
      phone: "+91 9876543210",
      rating: 4.8,
    },
    trackingUpdates: [
      { status: "placed", timestamp: "2024-01-15T10:30:00Z", message: "Order placed successfully" },
      { status: "confirmed", timestamp: "2024-01-15T10:35:00Z", message: "Order confirmed by pharmacy" },
      { status: "preparing", timestamp: "2024-01-15T10:45:00Z", message: "Pharmacy is preparing your order" },
      { status: "ready", timestamp: "2024-01-15T11:00:00Z", message: "Order ready for pickup" },
      { status: "picked_up", timestamp: "2024-01-15T11:10:00Z", message: "Order picked up by delivery partner" },
      { status: "in_transit", timestamp: "2024-01-15T11:15:00Z", message: "Out for delivery" },
    ],
    prescriptionRequired: true,
    prescriptionVerified: true,
    canCancel: false,
    canReorder: true,
  },
  {
    id: "ORD002",
    orderDate: "2024-01-14T14:20:00Z",
    status: "delivered",
    items: [{ name: "Cetirizine 10mg", quantity: 1, price: 45 }],
    totalAmount: 45,
    deliveryAddress: "123 Main St, Sector 15, Gurgaon, Haryana 122001",
    deliveryFee: 20,
    paymentMethod: "cod",
    paymentStatus: "paid",
    estimatedDelivery: "2024-01-14T15:20:00Z",
    actualDelivery: "2024-01-14T15:15:00Z",
    deliveryPartner: {
      name: "Amit Singh",
      phone: "+91 9876543211",
      rating: 4.9,
    },
    trackingUpdates: [
      { status: "placed", timestamp: "2024-01-14T14:20:00Z", message: "Order placed successfully" },
      { status: "confirmed", timestamp: "2024-01-14T14:22:00Z", message: "Order confirmed by pharmacy" },
      { status: "preparing", timestamp: "2024-01-14T14:30:00Z", message: "Pharmacy is preparing your order" },
      { status: "ready", timestamp: "2024-01-14T14:45:00Z", message: "Order ready for pickup" },
      { status: "picked_up", timestamp: "2024-01-14T14:50:00Z", message: "Order picked up by delivery partner" },
      { status: "in_transit", timestamp: "2024-01-14T14:55:00Z", message: "Out for delivery" },
      { status: "delivered", timestamp: "2024-01-14T15:15:00Z", message: "Order delivered successfully" },
    ],
    prescriptionRequired: false,
    prescriptionVerified: false,
    canCancel: false,
    canReorder: true,
  },
  {
    id: "ORD003",
    orderDate: "2024-01-13T09:15:00Z",
    status: "preparing",
    items: [{ name: "Vitamin D3 60K IU", quantity: 1, price: 180 }],
    totalAmount: 180,
    deliveryAddress: "123 Main St, Sector 15, Gurgaon, Haryana 122001",
    deliveryFee: 30,
    paymentMethod: "online",
    paymentStatus: "paid",
    estimatedDelivery: "2024-01-13T10:30:00Z",
    trackingUpdates: [
      { status: "placed", timestamp: "2024-01-13T09:15:00Z", message: "Order placed successfully" },
      { status: "confirmed", timestamp: "2024-01-13T09:18:00Z", message: "Order confirmed by pharmacy" },
      { status: "preparing", timestamp: "2024-01-13T09:25:00Z", message: "Pharmacy is preparing your order" },
    ],
    prescriptionRequired: false,
    prescriptionVerified: false,
    canCancel: true,
    canReorder: true,
  },
]

export function OrderTracking() {
  const [orders] = useState<CustomerOrder[]>(customerOrders)
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: CustomerOrder["status"]) => {
    switch (status) {
      case "placed":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "ready":
        return "bg-purple-100 text-purple-800"
      case "picked_up":
        return "bg-indigo-100 text-indigo-800"
      case "in_transit":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: CustomerOrder["status"]) => {
    switch (status) {
      case "placed":
        return <Package className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "preparing":
        return <Clock className="h-4 w-4" />
      case "ready":
        return <Package className="h-4 w-4" />
      case "picked_up":
        return <Truck className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const cancelOrder = (orderId: string) => {
    // In real app, this would cancel the order
    console.log("Cancelling order:", orderId)
  }

  const reorderItems = (orderId: string) => {
    // In real app, this would add items to cart
    console.log("Reordering items from:", orderId)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
          <p className="text-gray-600">Track your medicine orders</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders or medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Orders</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No orders found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()} at{" "}
                      {new Date(order.orderDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status.replace("_", " ")}</span>
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Delivery Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{order.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          ETA: {new Date(order.estimatedDelivery).toLocaleTimeString()}
                        </span>
                      </div>
                      {order.deliveryPartner && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {order.deliveryPartner.name} ({order.deliveryPartner.rating} ⭐)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {order.prescriptionRequired && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">
                      Prescription Required - {order.prescriptionVerified ? "Verified ✓" : "Pending verification"}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">Total: ₹{order.totalAmount}</p>
                    <p className="text-sm text-gray-500">
                      Payment: {order.paymentMethod.toUpperCase()} • {order.paymentStatus}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Tracking - #{order.id}</DialogTitle>
                          <DialogDescription>Real-time order status updates</DialogDescription>
                        </DialogHeader>
                        <OrderTrackingDetails order={order} />
                      </DialogContent>
                    </Dialog>

                    {order.deliveryPartner && order.status === "in_transit" && (
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Driver
                      </Button>
                    )}

                    {order.canCancel && (
                      <Button variant="destructive" size="sm" onClick={() => cancelOrder(order.id)}>
                        Cancel
                      </Button>
                    )}

                    {order.canReorder && (
                      <Button size="sm" onClick={() => reorderItems(order.id)}>
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function OrderTrackingDetails({ order }: { order: CustomerOrder }) {
  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Order Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {order.status.replace("_", " ").charAt(0).toUpperCase() + order.status.replace("_", " ").slice(1)}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Delivery Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Address:</strong> {order.deliveryAddress}
            </p>
            <p>
              <strong>ETA:</strong> {new Date(order.estimatedDelivery).toLocaleTimeString()}
            </p>
            {order.deliveryPartner && (
              <>
                <p>
                  <strong>Driver:</strong> {order.deliveryPartner.name}
                </p>
                <p>
                  <strong>Phone:</strong> {order.deliveryPartner.phone}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div>
        <h4 className="font-medium mb-4">Order Timeline</h4>
        <div className="space-y-4">
          {order.trackingUpdates.map((update, index) => (
            <div key={index} className="flex items-start gap-4">
              <div
                className={`w-3 h-3 rounded-full mt-2 ${
                  index === order.trackingUpdates.length - 1 ? "bg-blue-600" : "bg-green-600"
                }`}
              ></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium capitalize">{update.status.replace("_", " ")}</p>
                    <p className="text-sm text-gray-600">{update.message}</p>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h4 className="font-medium mb-2">Order Items</h4>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Medicine</th>
                <th className="text-left p-3 text-sm font-medium">Qty</th>
                <th className="text-left p-3 text-sm font-medium">Price</th>
                <th className="text-left p-3 text-sm font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 text-sm">{item.name}</td>
                  <td className="p-3 text-sm">{item.quantity}</td>
                  <td className="p-3 text-sm">₹{item.price}</td>
                  <td className="p-3 text-sm">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="p-3 text-sm font-medium text-right">
                  Delivery Fee:
                </td>
                <td className="p-3 text-sm">₹{order.deliveryFee}</td>
              </tr>
              <tr>
                <td colSpan={3} className="p-3 text-sm font-bold text-right">
                  Total:
                </td>
                <td className="p-3 text-sm font-bold">₹{order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-2">
          {order.deliveryPartner && order.status === "in_transit" && (
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-1" />
              Call Driver
            </Button>
          )}
          {order.status === "delivered" && (
            <Button variant="outline">
              <Star className="h-4 w-4 mr-1" />
              Rate Order
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {order.canCancel && <Button variant="destructive">Cancel Order</Button>}
          {order.canReorder && <Button>Reorder Items</Button>}
        </div>
      </div>
    </div>
  )
}
