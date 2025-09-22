"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Order {
  id: string
  status: string
  total_amount: number
  delivery_address: string
  created_at: string
  updated_at: string
}

export function useRealTimeOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    loadOrders()
    setupRealtimeSubscription()
  }, [userId])

  const loadOrders = async () => {
    if (!userId) return

    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setOrders(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    if (!userId) return

    const supabase = createClient()

    const subscription = supabase
      .channel("user-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `customer_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new as Order, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((order) => (order.id === payload.new.id ? { ...order, ...payload.new } : order)),
            )
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((order) => order.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  return { orders, loading, error, refetch: loadOrders }
}
