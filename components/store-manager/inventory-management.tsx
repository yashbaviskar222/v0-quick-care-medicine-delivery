"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, AlertTriangle, Package, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface Medicine {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  category: string
  requires_prescription: boolean
  image_url?: string
  store_manager_id?: string
  created_at: string
  updated_at: string
}

export function InventoryManagement({ onBack }: { onBack?: () => void }) {
  const [inventory, setInventory] = useState<Medicine[]>([])
  const [filteredInventory, setFilteredInventory] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("Please log in to manage inventory")
      }

      // Check if user is a store manager
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single()

      if (profileError || profile?.user_type !== "store_manager") {
        throw new Error("Access denied. Store manager privileges required.")
      }

      // Fetch medicines
      const { data, error } = await supabase.from("medicines").select("*").order("name")

      if (error) throw error

      setInventory(data || [])
      setFilteredInventory(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory")
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", ...Array.from(new Set(inventory.map((m) => m.category).filter(Boolean)))]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterInventory(term, selectedCategory, selectedStatus)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    filterInventory(searchTerm, category, selectedStatus)
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    filterInventory(searchTerm, selectedCategory, status)
  }

  const filterInventory = (search: string, category: string, status: string) => {
    let filtered = inventory

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

    if (status !== "all") {
      if (status === "low_stock") {
        filtered = filtered.filter((m) => m.stock_quantity <= 10 && m.stock_quantity > 0)
      } else if (status === "out_of_stock") {
        filtered = filtered.filter((m) => m.stock_quantity === 0)
      }
    }

    setFilteredInventory(filtered)
  }

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.stock_quantity === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (medicine.stock_quantity <= 10) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    return { status: "In Stock", color: "bg-green-100 text-green-800" }
  }

  const deleteMedicine = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("medicines").delete().eq("id", id)

      if (error) throw error

      // Remove from local state
      setInventory((prev) => prev.filter((m) => m.id !== id))
      setFilteredInventory((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      console.error("Failed to delete medicine:", err)
    }
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
          <p className="text-gray-500">Loading inventory...</p>
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
          <Button onClick={loadInventory} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
            <p className="text-gray-600">Manage your medicine inventory and stock levels</p>
          </div>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
              <DialogDescription>Add a new medicine to your inventory</DialogDescription>
            </DialogHeader>
            <AddMedicineForm onClose={() => setShowAddDialog(false)} onSuccess={loadInventory} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inventory.filter((m) => m.stock_quantity <= 10 && m.stock_quantity > 0).length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventory.filter((m) => m.stock_quantity === 0).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{inventory.reduce((total, m) => total + m.stock_quantity * m.price, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
        <Select value={selectedStatus} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Medicine</th>
                  <th className="text-left p-4 font-medium text-gray-900">Category</th>
                  <th className="text-left p-4 font-medium text-gray-900">Stock</th>
                  <th className="text-left p-4 font-medium text-gray-900">Price</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((medicine) => {
                  const stockStatus = getStockStatus(medicine)

                  return (
                    <tr key={medicine.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{medicine.name}</p>
                          <p className="text-sm text-gray-600">{medicine.description}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        {medicine.category && <Badge variant="outline">{medicine.category}</Badge>}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{medicine.stock_quantity}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">₹{medicine.price}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge className={stockStatus.color}>{stockStatus.status}</Badge>
                          {medicine.requires_prescription && (
                            <Badge variant="destructive" className="text-xs">
                              Rx
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setEditingMedicine(medicine)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteMedicine(medicine.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No medicines found matching your criteria</p>
        </div>
      )}

      {/* Edit Dialog */}
      {editingMedicine && (
        <Dialog open={!!editingMedicine} onOpenChange={() => setEditingMedicine(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Medicine</DialogTitle>
              <DialogDescription>Update medicine information</DialogDescription>
            </DialogHeader>
            <EditMedicineForm
              medicine={editingMedicine}
              onClose={() => setEditingMedicine(null)}
              onSuccess={loadInventory}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function AddMedicineForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock_quantity: "",
    requires_prescription: false,
    image_url: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("Please log in to add medicines")
      }

      const { error } = await supabase.from("medicines").insert({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number.parseFloat(formData.price),
        stock_quantity: Number.parseInt(formData.stock_quantity),
        requires_prescription: formData.requires_prescription,
        image_url: formData.image_url || null,
        store_manager_id: user.id,
      })

      if (error) throw error

      onSuccess()
      onClose()
    } catch (err) {
      console.error("Failed to add medicine:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Medicine Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pain Relief">Pain Relief</SelectItem>
              <SelectItem value="Antibiotics">Antibiotics</SelectItem>
              <SelectItem value="Allergy">Allergy</SelectItem>
              <SelectItem value="Digestive">Digestive</SelectItem>
              <SelectItem value="Diabetes">Diabetes</SelectItem>
              <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="prescription"
          checked={formData.requires_prescription}
          onChange={(e) => setFormData((prev) => ({ ...prev, requires_prescription: e.target.checked }))}
        />
        <Label htmlFor="prescription">Prescription Required</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Medicine"}
        </Button>
      </div>
    </form>
  )
}

function EditMedicineForm({
  medicine,
  onClose,
  onSuccess,
}: { medicine: Medicine; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: medicine.name,
    description: medicine.description || "",
    category: medicine.category || "",
    price: medicine.price.toString(),
    stock_quantity: medicine.stock_quantity.toString(),
    requires_prescription: medicine.requires_prescription,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("medicines")
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: Number.parseFloat(formData.price),
          stock_quantity: Number.parseInt(formData.stock_quantity),
          requires_prescription: formData.requires_prescription,
          updated_at: new Date().toISOString(),
        })
        .eq("id", medicine.id)

      if (error) throw error

      onSuccess()
      onClose()
    } catch (err) {
      console.error("Failed to update medicine:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Medicine Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-stock">Stock Quantity *</Label>
          <Input
            id="edit-stock"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-price">Price (₹) *</Label>
          <Input
            id="edit-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pain Relief">Pain Relief</SelectItem>
              <SelectItem value="Antibiotics">Antibiotics</SelectItem>
              <SelectItem value="Allergy">Allergy</SelectItem>
              <SelectItem value="Digestive">Digestive</SelectItem>
              <SelectItem value="Diabetes">Diabetes</SelectItem>
              <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="edit-prescription"
          checked={formData.requires_prescription}
          onChange={(e) => setFormData((prev) => ({ ...prev, requires_prescription: e.target.checked }))}
        />
        <Label htmlFor="edit-prescription">Prescription Required</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Medicine"}
        </Button>
      </div>
    </form>
  )
}
