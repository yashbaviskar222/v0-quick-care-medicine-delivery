"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, Phone, DollarSign, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface DeliveryOrder {
  id: string
  customer_id: string
  total_amount: number
  delivery_address: string
  delivery_phone: string
  notes?: string
  created_at: string
  status: string
  order_items: Array<{
    id: string
    quantity: number
    price: number
    medicines: {
      name: string
      requires_prescription: boolean
    }
  }>
  profiles: {
    full_name: string
    phone: string
  }
}

export function AvailableOrders({ onBack }: { onBack?: () => void }) {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAvailableOrders()
  }, [])

  const loadAvailableOrders = async () => {
    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("Please log in to view available orders")
      }

      // Check if user is a delivery partner
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single()

      if (profileError || profile?.user_type !== "delivery_partner") {
        throw new Error("Access denied. Delivery partner privileges required.")
      }

      // Fetch available orders (confirmed but not assigned to any delivery partner)
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            medicines (
              name,
              requires_prescription
            )
          ),
          profiles!customer_id (
            full_name,
            phone
          )
        `)
        .eq("status", "confirmed")
        .is("delivery_partner_id", null)
        .order("created_at", { ascending: true })

      if (error) throw error

      setOrders(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load available orders")
    } finally {
      setLoading(false)
    }
  }

  const acceptOrder = async (orderId: string) => {
    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("Please log in to accept orders")
      }

      // Update order with delivery partner and change status
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          delivery_partner_id: user.id,
          status: "preparing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (updateError) throw updateError

      // Create delivery record
      const { error: deliveryError } = await supabase.from("deliveries").insert({
        order_id: orderId,
        delivery_partner_id: user.id,
        status: "assigned",
        earnings: 25, // Base delivery fee - could be calculated based on distance
      })

      if (deliveryError) throw deliveryError

      // Remove from available orders
      setOrders((prev) => prev.filter((order) => order.id !== orderId))
    } catch (err) {
      console.error("Failed to accept order:", err)
    }
  }

  const getPriorityColor = (hasUrgentMeds: boolean) => {
    return hasUrgentMeds ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
  }

  const getPriorityIcon = (hasUrgentMeds: boolean) => {
    return hasUrgentMeds ? "🚨" : "📦"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <div className="text-center py-12">
          <p className="text-gray-500">Loading available orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <div className="text-center py-12">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={loadAvailableOrders} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Orders</h2>
            <p className="text-gray-600">Accept orders for delivery</p>
          </div>
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
          {orders.map((order) => {
            const hasUrgentMeds = order.order_items.some((item) => item.medicines.requires_prescription)
            const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0)

            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPriorityIcon(hasUrgentMeds)}</span>
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-gray-600">{order.profiles.full_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(hasUrgentMeds)}>
                        {hasUrgentMeds ? "Prescription" : "Standard"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                          <p className="text-sm text-gray-600">{order.delivery_address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">₹25 delivery fee</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{order.delivery_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{totalItems} items</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">Items ({order.order_items.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {order.order_items.map((item) => (
                        <Badge key={item.id} variant="outline" className="text-xs">
                          {item.medicines.name} x{item.quantity}
                          {item.medicines.requires_prescription && <span className="text-red-600 ml-1">*</span>}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Special Instructions</p>
                      <p className="text-sm text-yellow-700">{order.notes}</p>
                    </div>
                  )}

                  {hasUrgentMeds && (
                    <div className="mb-4">
                      <Badge variant="destructive" className="text-xs">
                        Prescription Required - Verify before delivery
                      </Badge>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Order Value: ₹{order.total_amount} • Ordered {new Date(order.created_at).toLocaleTimeString()}
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
                            <DialogTitle>Order Details - #{order.id.slice(0, 8)}</DialogTitle>
                            <DialogDescription>Complete order information</DialogDescription>
                          </DialogHeader>
                          <OrderDetailsView order={order} onAccept={() => acceptOrder(order.id)} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        onClick={() => acceptOrder(order.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept Order
                      </Button>
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

function OrderDetailsView({ order, onAccept }: { order: DeliveryOrder; onAccept: () => void }) {
  const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Customer Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Name:</strong> {order.profiles.full_name}
            </p>
            <p>
              <strong>Phone:</strong> {order.delivery_phone}
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Delivery Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Items:</strong> {totalItems}
            </p>
            <p>
              <strong>Delivery Fee:</strong> ₹25
            </p>
            <p>
              <strong>Order Value:</strong> ₹{order.total_amount}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Delivery Address</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-1" />
            <div>
              <p className="text-gray-600">{order.delivery_address}</p>
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
                <th className="text-left p-3 text-sm font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3 text-sm">
                    {item.medicines.name}
                    {item.medicines.requires_prescription && <span className="text-red-600 ml-1">*</span>}
                  </td>
                  <td className="p-3 text-sm">{item.quantity}</td>
                  <td className="p-3 text-sm">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {order.notes && (
        <div>
          <h4 className="font-medium mb-2">Special Instructions</h4>
          <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{order.notes}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <p className="text-sm text-gray-600">Order Value: ₹{order.total_amount}</p>
          <p className="text-sm text-gray-600">Your Earning: ₹25</p>
        </div>
        <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
          Accept This Order
        </Button>
      </div>
    </div>
  )
}
