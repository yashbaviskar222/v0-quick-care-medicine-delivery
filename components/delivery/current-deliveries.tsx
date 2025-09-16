"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, Phone, Navigation, Camera } from "lucide-react"

interface ActiveDelivery {
  id: string
  customerName: string
  customerPhone: string
  pickupAddress: string
  deliveryAddress: string
  status: "accepted" | "picked_up" | "in_transit" | "delivered"
  orderValue: number
  deliveryFee: number
  paymentMethod: "cod" | "online"
  items: Array<{
    name: string
    quantity: number
  }>
  acceptedAt: string
  estimatedDelivery: string
  specialInstructions?: string
}

const currentDeliveries: ActiveDelivery[] = [
  {
    id: "DEL001",
    customerName: "John Doe",
    customerPhone: "+91 9876543210",
    pickupAddress: "QuickCare Pharmacy, Sector 15, Gurgaon",
    deliveryAddress: "123 Main St, Sector 15, Gurgaon, Haryana 122001",
    status: "picked_up",
    orderValue: 135,
    deliveryFee: 25,
    paymentMethod: "online",
    items: [
      { name: "Paracetamol 500mg", quantity: 2 },
      { name: "Amoxicillin 250mg", quantity: 1 },
    ],
    acceptedAt: "2024-01-15T10:30:00Z",
    estimatedDelivery: "2024-01-15T11:00:00Z",
    specialInstructions: "Please call before delivery",
  },
  {
    id: "DEL004",
    customerName: "Sarah Wilson",
    customerPhone: "+91 9876543213",
    pickupAddress: "QuickCare Pharmacy, Sector 20, Gurgaon",
    deliveryAddress: "321 Garden St, Sector 20, Gurgaon, Haryana 122004",
    status: "accepted",
    orderValue: 89,
    deliveryFee: 30,
    paymentMethod: "cod",
    items: [
      { name: "Vitamin B12", quantity: 1 },
      { name: "Calcium Tablets", quantity: 1 },
    ],
    acceptedAt: "2024-01-15T11:45:00Z",
    estimatedDelivery: "2024-01-15T12:30:00Z",
  },
]

export function CurrentDeliveries() {
  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>(currentDeliveries)

  const updateDeliveryStatus = (deliveryId: string, newStatus: ActiveDelivery["status"]) => {
    setDeliveries((prev) =>
      prev.map((delivery) => (delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery)),
    )
  }

  const completeDelivery = (deliveryId: string) => {
    setDeliveries((prev) => prev.filter((delivery) => delivery.id !== deliveryId))
    // In real app, this would update the delivery status and record completion
    console.log("Completed delivery:", deliveryId)
  }

  const getStatusColor = (status: ActiveDelivery["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "picked_up":
        return "bg-purple-100 text-purple-800"
      case "in_transit":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNextAction = (status: ActiveDelivery["status"]) => {
    switch (status) {
      case "accepted":
        return { text: "Mark as Picked Up", nextStatus: "picked_up" as const }
      case "picked_up":
        return { text: "Start Delivery", nextStatus: "in_transit" as const }
      case "in_transit":
        return { text: "Mark as Delivered", nextStatus: "delivered" as const }
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Current Deliveries</h2>
          <p className="text-gray-600">Manage your active deliveries</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {deliveries.length} active deliveries
        </Badge>
      </div>

      {deliveries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No active deliveries</p>
            <p className="text-sm text-gray-400">Accept orders to start delivering</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deliveries.map((delivery) => {
            const nextAction = getNextAction(delivery.status)

            return (
              <Card key={delivery.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{delivery.id}</h3>
                      <p className="text-gray-600">{delivery.customerName}</p>
                      <p className="text-sm text-gray-500">
                        Accepted: {new Date(delivery.acceptedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status.replace("_", " ").charAt(0).toUpperCase() +
                          delivery.status.replace("_", " ").slice(1)}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        ETA: {new Date(delivery.estimatedDelivery).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Pickup</p>
                          <p className="text-sm text-gray-600">{delivery.pickupAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Delivery</p>
                          <p className="text-sm text-gray-600">{delivery.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{delivery.customerPhone}</span>
                        <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                          Call
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{delivery.items.length} items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600">Earning: ₹{delivery.deliveryFee}</span>
                        <Badge
                          variant={delivery.paymentMethod === "cod" ? "destructive" : "default"}
                          className="text-xs"
                        >
                          {delivery.paymentMethod.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">Items</p>
                    <div className="flex flex-wrap gap-2">
                      {delivery.items.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item.name} x{item.quantity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {delivery.specialInstructions && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Special Instructions</p>
                      <p className="text-sm text-yellow-700">{delivery.specialInstructions}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Navigation className="h-4 w-4 mr-1" />
                        Navigate
                      </Button>
                      {delivery.status === "in_transit" && (
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-1" />
                          Photo Proof
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {nextAction && (
                        <Button
                          size="sm"
                          onClick={() => {
                            if (nextAction.nextStatus === "delivered") {
                              completeDelivery(delivery.id)
                            } else {
                              updateDeliveryStatus(delivery.id, nextAction.nextStatus)
                            }
                          }}
                        >
                          {nextAction.text}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
