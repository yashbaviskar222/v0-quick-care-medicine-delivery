"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ShoppingCart, Plus, Minus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BackButton } from "@/components/ui/back-button"
import { createClient } from "@/lib/supabase/client"

interface Medicine {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  category: string
  requires_prescription: boolean
  image_url: string
}

interface CartItem extends Medicine {
  quantity: number
}

interface MedicineCatalogProps {
  onBack?: () => void
}

export function MedicineCatalog({ onBack }: MedicineCatalogProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .gt("stock_quantity", 0) // Only show medicines in stock
        .order("name")

      if (error) throw error

      setMedicines(data || [])
      setFilteredMedicines(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load medicines")
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", ...Array.from(new Set(medicines.map((m) => m.category).filter(Boolean)))]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterMedicines(term, selectedCategory)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    filterMedicines(searchTerm, category)
  }

  const filterMedicines = (search: string, category: string) => {
    let filtered = medicines

    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.description?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (category !== "all") {
      filtered = filtered.filter((m) => m.category === category)
    }

    setFilteredMedicines(filtered)
  }

  const addToCart = (medicine: Medicine) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === medicine.id)
      if (existing) {
        return prev.map((item) => (item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...medicine, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, change: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const newQuantity = item.quantity + change
              return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
            }
            return item
          })
          .filter(Boolean) as CartItem[],
    )
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {onBack && <BackButton onClick={onBack} label="Back to Dashboard" />}
        <div className="text-center py-12">
          <p className="text-gray-500">Loading medicines...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        {onBack && <BackButton onClick={onBack} label="Back to Dashboard" />}
        <div className="text-center py-12">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={loadMedicines} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (showCart) {
    return <CartView cart={cart} updateQuantity={updateQuantity} onBack={() => setShowCart(false)} />
  }

  return (
    <div className="space-y-6">
      {onBack && <BackButton onClick={onBack} label="Back to Dashboard" />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medicine Catalog</h2>
          <p className="text-gray-600">Browse and order medicines online</p>
        </div>
        <Button onClick={() => setShowCart(true)} className="relative">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart ({getTotalItems()})
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
            onAddToCart={() => addToCart(medicine)}
            inCart={cart.some((item) => item.id === medicine.id)}
          />
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No medicines found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

function MedicineCard({
  medicine,
  onAddToCart,
  inCart,
}: {
  medicine: Medicine
  onAddToCart: () => void
  inCart: boolean
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">{medicine.name}</CardTitle>
            <CardDescription className="text-sm">{medicine.description}</CardDescription>
          </div>
          <img
            src={medicine.image_url || "/placeholder.svg?height=64&width=64"}
            alt={medicine.name}
            className="w-16 h-16 object-cover rounded-md ml-3"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={medicine.requires_prescription ? "destructive" : "secondary"}>
            {medicine.requires_prescription ? "Prescription" : "OTC"}
          </Badge>
          {medicine.category && <Badge variant="outline">{medicine.category}</Badge>}
          {medicine.stock_quantity <= 5 && <Badge variant="destructive">Low Stock ({medicine.stock_quantity})</Badge>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div className="text-sm text-gray-600">
            <p>Stock: {medicine.stock_quantity} available</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
            </div>

            <Button
              onClick={onAddToCart}
              disabled={medicine.stock_quantity === 0}
              variant={inCart ? "secondary" : "default"}
              size="sm"
            >
              {inCart ? "Added" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CartView({
  cart,
  updateQuantity,
  onBack,
}: {
  cart: CartItem[]
  updateQuantity: (id: string, change: number) => void
  onBack: () => void
}) {
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Catalog
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
      </div>

      {cart.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url || "/placeholder.svg?height=64&width=64"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                    <p className="text-sm text-gray-500">₹{item.price} each</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total: ₹{getTotalPrice()}</span>
                <Button size="lg">Proceed to Checkout</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
