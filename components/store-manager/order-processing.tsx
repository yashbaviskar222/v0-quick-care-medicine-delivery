"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Package, CheckCircle, Eye, Printer, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface OrderItem {
  medicineId: string
  medicineName: string
  quantity: number
  price: number
  prescriptionRequired: boolean
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "dispatched" | "delivered" | "cancelled"
  orderDate: string
  prescriptionUploaded: boolean
  prescriptionVerified: boolean
  paymentStatus: "pending" | "paid" | "failed"
  deliveryType: "standard" | "express" | "emergency"
  notes?: string
}

const sampleOrders: Order[] = [
  {
    id: "ORD001",
    customerName: "John Doe",
    customerPhone: "+91 9876543210",
    customerAddress: "123 Main St, Sector 15, Gurgaon, Haryana 122001",
    items: [
      {
        medicineId: "1",
        medicineName: "Paracetamol 500mg",
        quantity: 2,
        price: 25,
        prescriptionRequired: false,
      },
      {
        medicineId: "2",
        medicineName: "Amoxicillin 250mg",
        quantity: 1,
        price: 85,
        prescriptionRequired: true,
      },
    ],
    totalAmount: 135,
    status: "pending",
    orderDate: "2024-01-15T10:30:00Z",
    prescriptionUploaded: true,
    prescriptionVerified: false,
    paymentStatus: "paid",
    deliveryType: "standard",
    notes: "Please call before delivery",
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    customerPhone: "+91 9876543211",
    customerAddress: "456 Park Ave, Sector 22, Gurgaon, Haryana 122002",
    items: [
      {
        medicineId: "3",
        medicineName: "Cetirizine 10mg",
        quantity: 1,
        price: 45,
        prescriptionRequired: false,
      },
    ],
    totalAmount: 45,
    status: "confirmed",
    orderDate: "2024-01-15T11:15:00Z",
    prescriptionUploaded: false,
    prescriptionVerified: false,
    paymentStatus: "paid",
    deliveryType: "express",
  },
  {
    id: "ORD003",
    customerName: "Mike Johnson",
    customerPhone: "+91 9876543212",
    customerAddress: "789 Oak St, Sector 18, Gurgaon, Haryana 122003",
    items: [
      {
        medicineId: "5",
        medicineName: "Vitamin D3 60K IU",
        quantity: 1,
        price: 180,
        prescriptionRequired: false,
      },
    ],
    totalAmount: 180,
    status: "ready",
    orderDate: "2024-01-15T09:45:00Z",
    prescriptionUploaded: false,
    prescriptionVerified: false,
    paymentStatus: "paid",
    deliveryType: "standard",
  },
]

export function OrderProcessing({ onBack }: { onBack?: () => void }) {
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = selectedStatus === "all" ? orders : orders.filter((order) => order.status === selectedStatus)

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const verifyPrescription = (orderId: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, prescriptionVerified: true } : order)))
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-purple-100 text-purple-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "dispatched":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeliveryTypeColor = (type: Order["deliveryType"]) => {
    switch (type) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "express":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getOrderStats = () => {
    return {
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      total: orders.length,
    }
  }

  const stats = getOrderStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Processing</h2>
          <p className="text-gray-600">Manage and process customer orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Preparing</p>
                <p className="text-2xl font-bold text-purple-600">{stats.preparing}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Badge className={getDeliveryTypeColor(order.deliveryType)}>
                      {order.deliveryType.charAt(0).toUpperCase() + order.deliveryType.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-600">
                    {order.customerName} • {order.customerPhone}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">₹{order.totalAmount}</p>
                  <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
                    {order.paymentStatus}
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
                          {item.medicineName} x{item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Delivery Address</h4>
                  <p className="text-sm text-gray-600">{order.customerAddress}</p>
                  {order.notes && <p className="text-sm text-blue-600 mt-1">Note: {order.notes}</p>}
                </div>
              </div>

              {/* Prescription Status */}
              {order.items.some((item) => item.prescriptionRequired) && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Prescription Required</p>
                      <p className="text-xs text-yellow-600">
                        {order.prescriptionUploaded
                          ? order.prescriptionVerified
                            ? "Prescription verified ✓"
                            : "Prescription uploaded - needs verification"
                          : "Waiting for prescription upload"}
                      </p>
                    </div>
                    {order.prescriptionUploaded && !order.prescriptionVerified && (
                      <Button size="sm" onClick={() => verifyPrescription(order.id)}>
                        Verify Prescription
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Order Details - #{order.id}</DialogTitle>
                    </DialogHeader>
                    <OrderDetailsView order={order} />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Button>

                {order.status === "pending" && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, "confirmed")}>
                    Confirm Order
                  </Button>
                )}

                {order.status === "confirmed" && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, "preparing")}>
                    Start Preparing
                  </Button>
                )}

                {order.status === "preparing" && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, "ready")}>
                    Mark Ready
                  </Button>
                )}

                {order.status === "ready" && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, "dispatched")}>
                    Dispatch
                  </Button>
                )}

                {(order.status === "pending" || order.status === "confirmed") && (
                  <Button variant="destructive" size="sm" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found for the selected status</p>
        </div>
      )}
    </div>
  )
}

function OrderDetailsView({ order }: { order: Order }) {
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
              <strong>Address:</strong> {order.customerAddress}
            </p>
          </div>
        </div>
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
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentStatus}
            </p>
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
                <th className="text-left p-3 text-sm font-medium">Qty</th>
                <th className="text-left p-3 text-sm font-medium">Price</th>
                <th className="text-left p-3 text-sm font-medium">Total</th>
                <th className="text-left p-3 text-sm font-medium">Rx</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3 text-sm">{item.medicineName}</td>
                  <td className="p-3 text-sm">{item.quantity}</td>
                  <td className="p-3 text-sm">₹{item.price}</td>
                  <td className="p-3 text-sm">₹{item.price * item.quantity}</td>
                  <td className="p-3 text-sm">
                    {item.prescriptionRequired ? (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Not Required
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="p-3 text-sm font-medium text-right">
                  Total:
                </td>
                <td className="p-3 text-sm font-bold">₹{order.totalAmount}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {order.notes && (
        <div>
          <h4 className="font-medium mb-2">Notes</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
