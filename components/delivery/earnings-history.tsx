"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Package, TrendingUp, Download, ArrowLeft } from "lucide-react"

interface EarningRecord {
  id: string
  orderId: string
  customerName: string
  deliveryDate: string
  deliveryFee: number
  distance: number
  duration: number
  rating?: number
  bonus?: number
  tip?: number
}

const earningsData: EarningRecord[] = [
  {
    id: "E001",
    orderId: "DEL001",
    customerName: "John Doe",
    deliveryDate: "2024-01-15T10:30:00Z",
    deliveryFee: 25,
    distance: 2.5,
    duration: 18,
    rating: 5,
    tip: 10,
  },
  {
    id: "E002",
    orderId: "DEL002",
    customerName: "Jane Smith",
    deliveryDate: "2024-01-15T11:15:00Z",
    deliveryFee: 35,
    distance: 1.8,
    duration: 15,
    rating: 4,
  },
  {
    id: "E003",
    orderId: "DEL003",
    customerName: "Mike Johnson",
    deliveryDate: "2024-01-14T09:45:00Z",
    deliveryFee: 30,
    distance: 3.2,
    duration: 22,
    rating: 5,
    bonus: 15,
  },
  {
    id: "E004",
    orderId: "DEL004",
    customerName: "Sarah Wilson",
    deliveryDate: "2024-01-14T14:20:00Z",
    deliveryFee: 40,
    distance: 4.1,
    duration: 28,
    rating: 4,
    tip: 5,
  },
  {
    id: "E005",
    orderId: "DEL005",
    customerName: "David Brown",
    deliveryDate: "2024-01-13T16:30:00Z",
    deliveryFee: 20,
    distance: 1.2,
    duration: 12,
    rating: 5,
  },
]

export function EarningsHistory({ onBack }: { onBack?: () => void }) {
  const [earnings] = useState<EarningRecord[]>(earningsData)
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  const filterEarningsByPeriod = (period: string) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    return earnings.filter((earning) => {
      const earningDate = new Date(earning.deliveryDate)
      switch (period) {
        case "today":
          return earningDate >= today
        case "yesterday":
          return earningDate >= yesterday && earningDate < today
        case "week":
          return earningDate >= weekAgo
        case "month":
          return earningDate >= monthAgo
        default:
          return true
      }
    })
  }

  const filteredEarnings = filterEarningsByPeriod(selectedPeriod)

  const calculateStats = (earnings: EarningRecord[]) => {
    const totalEarnings = earnings.reduce((sum, e) => sum + e.deliveryFee + (e.tip || 0) + (e.bonus || 0), 0)
    const totalDeliveries = earnings.length
    const totalDistance = earnings.reduce((sum, e) => sum + e.distance, 0)
    const totalDuration = earnings.reduce((sum, e) => sum + e.duration, 0)
    const avgRating = earnings.reduce((sum, e) => sum + (e.rating || 0), 0) / earnings.length || 0

    return {
      totalEarnings,
      totalDeliveries,
      totalDistance,
      totalDuration,
      avgRating,
      avgEarningPerDelivery: totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0,
    }
  }

  const stats = calculateStats(filteredEarnings)

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
            <h2 className="text-2xl font-bold text-gray-900">Earnings History</h2>
            <p className="text-gray-600">Track your delivery earnings and performance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.totalEarnings}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Deliveries</p>
                <p className="text-2xl font-bold">{stats.totalDeliveries}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg per Delivery</p>
                <p className="text-2xl font-bold">₹{Math.round(stats.avgEarningPerDelivery)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)} ⭐</p>
              </div>
              <div className="text-2xl">⭐</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Distance:</span>
                <span className="font-medium">{stats.totalDistance.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Time:</span>
                <span className="font-medium">
                  {Math.round(stats.totalDuration / 60)}h {stats.totalDuration % 60}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tips Earned:</span>
                <span className="font-medium text-green-600">
                  ₹{filteredEarnings.reduce((sum, e) => sum + (e.tip || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonuses:</span>
                <span className="font-medium text-blue-600">
                  ₹{filteredEarnings.reduce((sum, e) => sum + (e.bonus || 0), 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Earnings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Delivery Fees:</span>
                <span className="font-medium">₹{filteredEarnings.reduce((sum, e) => sum + e.deliveryFee, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Tips:</span>
                <span className="font-medium text-green-600">
                  ₹{filteredEarnings.reduce((sum, e) => sum + (e.tip || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Performance Bonuses:</span>
                <span className="font-medium text-blue-600">
                  ₹{filteredEarnings.reduce((sum, e) => sum + (e.bonus || 0), 0)}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Earnings:</span>
                  <span className="text-green-600">₹{stats.totalEarnings}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
          <CardDescription>
            {selectedPeriod === "today"
              ? "Today's"
              : selectedPeriod === "yesterday"
                ? "Yesterday's"
                : selectedPeriod === "week"
                  ? "This week's"
                  : selectedPeriod === "month"
                    ? "This month's"
                    : "All"}{" "}
            deliveries
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEarnings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No deliveries found for the selected period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Order</th>
                    <th className="text-left p-4 font-medium text-gray-900">Customer</th>
                    <th className="text-left p-4 font-medium text-gray-900">Date & Time</th>
                    <th className="text-left p-4 font-medium text-gray-900">Distance</th>
                    <th className="text-left p-4 font-medium text-gray-900">Duration</th>
                    <th className="text-left p-4 font-medium text-gray-900">Base Fee</th>
                    <th className="text-left p-4 font-medium text-gray-900">Extras</th>
                    <th className="text-left p-4 font-medium text-gray-900">Total</th>
                    <th className="text-left p-4 font-medium text-gray-900">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEarnings.map((earning) => (
                    <tr key={earning.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-medium">#{earning.orderId}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-900">{earning.customerName}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm">{new Date(earning.deliveryDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{new Date(earning.deliveryDate).toLocaleTimeString()}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{earning.distance} km</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{earning.duration} min</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">₹{earning.deliveryFee}</span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {earning.tip && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Tip: ₹{earning.tip}
                            </Badge>
                          )}
                          {earning.bonus && (
                            <Badge variant="outline" className="text-xs text-blue-600">
                              Bonus: ₹{earning.bonus}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-green-600">
                          ₹{earning.deliveryFee + (earning.tip || 0) + (earning.bonus || 0)}
                        </span>
                      </td>
                      <td className="p-4">
                        {earning.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{earning.rating}</span>
                            <span className="text-yellow-400">⭐</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
