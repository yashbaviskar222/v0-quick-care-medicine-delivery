"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Package, Phone, Navigation, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DeliveryOrder {
  id: string
  customerName: string
  customerPhone: string
  pickupAddress: string
  deliveryAddress: string
  distance: number
  estimatedTime: number
  deliveryFee: number
  orderValue: number
  items: Array<{
    name: string
    quantity: number
  }>
  priority: "standard" | "express" | "emergency"
  prescriptionRequired: boolean
  paymentMethod: "cod" | "online"
  specialInstructions?: string
  orderTime: string
}

const availableOrders: DeliveryOrder[] = [
  {
    id: "DEL001",
    customerName: "John Doe",
    customerPhone: "+91 9876543210",
    pickupAddress: "QuickCare Pharmacy, Sector 15, Gurgaon",
    deliveryAddress: "123 Main St, Sector 15, Gurgaon, Haryana 122001",
    distance: 2.5,
    estimatedTime: 15,
    deliveryFee: 25,
    orderValue: 135,
    items: [
      { name: "Paracetamol 500mg", quantity: 2 },
      { name: "Amoxicillin 250mg", quantity: 1 },
    ],
    priority: "standard",
    prescriptionRequired: true,
    paymentMethod: "online",
    specialInstructions: "Please call before delivery",
    orderTime: "2024-01-15T10:30:00Z",
  },
  {
    id: "DEL002",
    customerName: "Jane Smith",
    customerPhone: "+91 9876543211",
    pickupAddress: "QuickCare Pharmacy, Sector 22, Gurgaon",
    deliveryAddress: "456 Park Ave, Sector 22, Gurgaon, Haryana 122002",
    distance: 1.8,
    estimatedTime: 12,
    deliveryFee: 35,
    orderValue: 45,
    items: [{ name: "Cetirizine 10mg", quantity: 1 }],
    priority: "express",
    prescriptionRequired: false,
    paymentMethod: "cod",
    orderTime: "2024-01-15T11:15:00Z",
  },
  {
    id: "DEL003",
    customerName: "Emergency Patient",
    customerPhone: "+91 9876543212",
    pickupAddress: "QuickCare Pharmacy, Sector 18, Gurgaon",
    deliveryAddress: "789 Oak St, Sector 18, Gurgaon, Haryana 122003",
    distance: 3.2,
    estimatedTime: 20,
    deliveryFee: 50,
    orderValue: 280,
    items: [
      { name: "Insulin Injection", quantity: 2 },
      { name: "Blood Glucose Strips", quantity: 1 },
    ],
    priority: "emergency",
    prescriptionRequired: true,
    paymentMethod: "online",
    specialInstructions: "URGENT: Diabetic patient needs insulin immediately",
    orderTime: "2024-01-15T12:00:00Z",
  },
]

export function AvailableOrders() {
  const [orders, setOrders] = useState<DeliveryOrder[]>(availableOrders)
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null)

  const acceptOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
    // In real app, this would update the order status and assign to delivery boy
    console.log("Accepted order:", orderId)
  }

  const getPriorityColor = (priority: DeliveryOrder["priority"]) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "express":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getPriorityIcon = (priority: DeliveryOrder["priority"]) => {
    switch (priority) {
      case "emergency":
        return "🚨"
      case "express":
        return "⚡"
      default:
        return "📦"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Orders</h2>
          <p className="text-gray-600">Accept orders for delivery</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          {orders.length} orders available
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No orders available right now</p>
            <p className="text-sm text-gray-400">Check back in a few minutes</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getPriorityIcon(order.priority)}</span>
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                      <p className="text-gray-600">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </Badge>
                    <Badge variant={order.paymentMethod === "cod" ? "destructive" : "default"}>
                      {order.paymentMethod.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pickup</p>
                        <p className="text-sm text-gray-600">{order.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Delivery</p>
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{order.distance} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">~{order.estimatedTime} mins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">₹{order.deliveryFee} delivery fee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{order.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">Items ({order.items.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item.name} x{item.quantity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {order.specialInstructions && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Special Instructions</p>
                    <p className="text-sm text-yellow-700">{order.specialInstructions}</p>
                  </div>
                )}

                {order.prescriptionRequired && (
                  <div className="mb-4">
                    <Badge variant="destructive" className="text-xs">
                      Prescription Required - Verify before delivery
                    </Badge>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Order Value: ₹{order.orderValue} • Ordered {new Date(order.orderTime).toLocaleTimeString()}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - #{order.id}</DialogTitle>
                          <DialogDescription>Complete order information</DialogDescription>
                        </DialogHeader>
                        <OrderDetailsView order={order} />
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" onClick={() => acceptOrder(order.id)} className="bg-green-600 hover:bg-green-700">
                      Accept Order
                    </Button>
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

function OrderDetailsView({ order }: { order: DeliveryOrder }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Customer Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Name:</strong> {order.customerName}
            </p>
            <p>
              <strong>Phone:</strong> {order.customerPhone}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Delivery Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Distance:</strong> {order.distance} km
            </p>
            <p>
              <strong>Est. Time:</strong> {order.estimatedTime} minutes
            </p>
            <p>
              <strong>Delivery Fee:</strong> ₹{order.deliveryFee}
            </p>
            <p>
              <strong>Priority:</strong> {order.priority}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Addresses</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-blue-600 mt-1" />
            <div>
              <p className="font-medium">Pickup:</p>
              <p className="text-gray-600">{order.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-1" />
            <div>
              <p className="font-medium">Delivery:</p>
              <p className="text-gray-600">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Order Items</h4>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Medicine</th>
                <th className="text-left p-3 text-sm font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 text-sm">{item.name}</td>
                  <td className="p-3 text-sm">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {order.specialInstructions && (
        <div>
          <h4 className="font-medium mb-2">Special Instructions</h4>
          <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{order.specialInstructions}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <p className="text-sm text-gray-600">Order Value: ₹{order.orderValue}</p>
          <p className="text-sm text-gray-600">Your Earning: ₹{order.deliveryFee}</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">Accept This Order</Button>
      </div>
    </div>
  )
}
