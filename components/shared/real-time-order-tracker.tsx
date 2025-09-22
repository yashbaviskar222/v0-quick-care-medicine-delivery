"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Package, Truck, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface OrderStatus {
  id: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "picked_up" | "in_transit" | "delivered" | "cancelled"
  total_amount: number
  delivery_address: string
  created_at: string
  updated_at: string
  delivery_partner_id?: string
  deliveries?: {
    status: string
    estimated_delivery_time?: string
    delivery_partner: {
      full_name: string
      phone: string
    }
  }[]
}

interface RealTimeOrderTrackerProps {
  orderId: string
  onStatusChange?: (status: string) => void
}

export function RealTimeOrderTracker({ orderId, onStatusChange }: RealTimeOrderTrackerProps) {
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrder()
    setupRealtimeSubscription()
  }, [orderId])

  const loadOrder = async () => {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          deliveries (
            status,
            estimated_delivery_time,
            delivery_partner:profiles!delivery_partner_id (
              full_name,
              phone
            )
          )
        `)
        .eq("id", orderId)
        .single()

      if (error) throw error

      setOrder(data)
      onStatusChange?.(data.status)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const supabase = createClient()

    // Subscribe to order updates
    const orderSubscription = supabase
      .channel("order-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prev) => (prev ? { ...prev, ...payload.new } : null))
          onStatusChange?.(payload.new.status)
        },
      )
      .subscribe()

    // Subscribe to delivery updates
    const deliverySubscription = supabase
      .channel("delivery-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deliveries",
          filter: `order_id=eq.${orderId}`,
        },
        () => {
          // Reload order data when delivery status changes
          loadOrder()
        },
      )
      .subscribe()

    return () => {
      orderSubscription.unsubscribe()
      deliverySubscription.unsubscribe()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case "preparing":
        return <Package className="h-5 w-5 text-orange-600" />
      case "ready":
        return <Package className="h-5 w-5 text-green-600" />
      case "picked_up":
      case "in_transit":
        return <Truck className="h-5 w-5 text-purple-600" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-orange-100 text-orange-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "picked_up":
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Received"
      case "confirmed":
        return "Order Confirmed"
      case "preparing":
        return "Preparing Order"
      case "ready":
        return "Ready for Pickup"
      case "picked_up":
        return "Picked Up"
      case "in_transit":
        return "On the Way"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const getStatusSteps = () => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: Clock },
      { key: "confirmed", label: "Confirmed", icon: CheckCircle },
      { key: "preparing", label: "Preparing", icon: Package },
      { key: "ready", label: "Ready", icon: Package },
      { key: "picked_up", label: "Picked Up", icon: Truck },
      { key: "delivered", label: "Delivered", icon: CheckCircle },
    ]

    const currentIndex = steps.findIndex((step) => step.key === order?.status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-500">Loading order status...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !order) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">Error: {error || "Order not found"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const steps = getStatusSteps()
  const delivery = order.deliveries?.[0]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Order Status</CardTitle>
          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Timeline */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.key} className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.completed
                      ? "bg-green-100 text-green-600"
                      : step.current
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${step.completed || step.current ? "text-gray-900" : "text-gray-500"}`}>
                    {step.label}
                  </p>
                  {step.current && (
                    <p className="text-sm text-blue-600">Updated {new Date(order.updated_at).toLocaleString()}</p>
                  )}
                </div>
                {step.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
            )
          })}
        </div>

        {/* Delivery Partner Info */}
        {delivery?.delivery_partner && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Delivery Partner
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Name:</strong> {delivery.delivery_partner.full_name}
              </p>
              <p>
                <strong>Phone:</strong> {delivery.delivery_partner.phone}
              </p>
              {delivery.estimated_delivery_time && (
                <p>
                  <strong>Estimated Delivery:</strong> {new Date(delivery.estimated_delivery_time).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Address
          </h4>
          <p className="text-sm text-gray-600">{order.delivery_address}</p>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-sm">
            <span>Order Total:</span>
            <span className="font-medium">₹{order.total_amount}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
            <span>Order ID:</span>
            <span>#{order.id.slice(0, 8)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
