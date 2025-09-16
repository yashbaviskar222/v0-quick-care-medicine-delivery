"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ShoppingCart, Plus, Minus, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Medicine {
  id: string
  name: string
  genericName: string
  manufacturer: string
  price: number
  originalPrice?: number
  category: string
  prescription: boolean
  inStock: boolean
  rating: number
  reviews: number
  description: string
  image: string
}

const sampleMedicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    manufacturer: "Sun Pharma",
    price: 25,
    originalPrice: 30,
    category: "Pain Relief",
    prescription: false,
    inStock: true,
    rating: 4.5,
    reviews: 234,
    description: "Effective pain relief and fever reducer",
    image: "/paracetamol-tablet.jpg",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    genericName: "Amoxicillin",
    manufacturer: "Cipla",
    price: 85,
    category: "Antibiotics",
    prescription: true,
    inStock: true,
    rating: 4.2,
    reviews: 156,
    description: "Antibiotic for bacterial infections",
    image: "/antibiotic-capsule.jpg",
  },
  {
    id: "3",
    name: "Cetirizine 10mg",
    genericName: "Cetirizine HCl",
    manufacturer: "Dr. Reddy's",
    price: 45,
    originalPrice: 55,
    category: "Allergy",
    prescription: false,
    inStock: true,
    rating: 4.3,
    reviews: 189,
    description: "Antihistamine for allergy relief",
    image: "/allergy-medicine-tablet.jpg",
  },
  {
    id: "4",
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    manufacturer: "Lupin",
    price: 120,
    category: "Gastric",
    prescription: true,
    inStock: false,
    rating: 4.4,
    reviews: 98,
    description: "Proton pump inhibitor for acid reflux",
    image: "/gastric-medicine-capsule.jpg",
  },
  {
    id: "5",
    name: "Vitamin D3 60K IU",
    genericName: "Cholecalciferol",
    manufacturer: "Abbott",
    price: 180,
    category: "Vitamins",
    prescription: false,
    inStock: true,
    rating: 4.6,
    reviews: 312,
    description: "Vitamin D supplement for bone health",
    image: "/vitamin-d-capsule.jpg",
  },
  {
    id: "6",
    name: "Metformin 500mg",
    genericName: "Metformin HCl",
    manufacturer: "Glenmark",
    price: 65,
    category: "Diabetes",
    prescription: true,
    inStock: true,
    rating: 4.1,
    reviews: 145,
    description: "Diabetes medication for blood sugar control",
    image: "/diabetes-medicine-tablet.jpg",
  },
]

interface CartItem extends Medicine {
  quantity: number
}

export function MedicineCatalog() {
  const [medicines] = useState<Medicine[]>(sampleMedicines)
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(sampleMedicines)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  const categories = ["all", ...Array.from(new Set(medicines.map((m) => m.category)))]

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
          m.genericName.toLowerCase().includes(search.toLowerCase()) ||
          m.manufacturer.toLowerCase().includes(search.toLowerCase()),
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

  if (showCart) {
    return <CartView cart={cart} updateQuantity={updateQuantity} onBack={() => setShowCart(false)} />
  }

  return (
    <div className="space-y-6">
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
            placeholder="Search medicines, brands, or generic names..."
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
            <CardDescription className="text-sm">{medicine.genericName}</CardDescription>
          </div>
          <img
            src={medicine.image || "/placeholder.svg"}
            alt={medicine.name}
            className="w-16 h-16 object-cover rounded-md ml-3"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={medicine.prescription ? "destructive" : "secondary"}>
            {medicine.prescription ? "Prescription" : "OTC"}
          </Badge>
          <Badge variant="outline">{medicine.category}</Badge>
          {!medicine.inStock && <Badge variant="destructive">Out of Stock</Badge>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-gray-600 mb-3 flex-1">{medicine.description}</p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">{medicine.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({medicine.reviews} reviews)</span>
          </div>

          <div className="text-sm text-gray-600">
            <p>Manufacturer: {medicine.manufacturer}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
              {medicine.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{medicine.originalPrice}</span>
              )}
            </div>

            <Button
              onClick={onAddToCart}
              disabled={!medicine.inStock}
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
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.genericName}</p>
                    <p className="text-sm text-gray-500">{item.manufacturer}</p>
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
