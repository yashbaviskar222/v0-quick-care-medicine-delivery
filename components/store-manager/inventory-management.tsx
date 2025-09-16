"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Medicine {
  id: string
  name: string
  genericName: string
  manufacturer: string
  category: string
  price: number
  costPrice: number
  stock: number
  minStock: number
  maxStock: number
  expiryDate: string
  batchNumber: string
  prescription: boolean
  status: "active" | "inactive" | "discontinued"
  lastUpdated: string
}

const sampleInventory: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    manufacturer: "Sun Pharma",
    category: "Pain Relief",
    price: 25,
    costPrice: 18,
    stock: 150,
    minStock: 50,
    maxStock: 500,
    expiryDate: "2025-12-31",
    batchNumber: "PCM2024001",
    prescription: false,
    status: "active",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    genericName: "Amoxicillin",
    manufacturer: "Cipla",
    category: "Antibiotics",
    price: 85,
    costPrice: 65,
    stock: 25,
    minStock: 30,
    maxStock: 200,
    expiryDate: "2024-08-15",
    batchNumber: "AMX2024002",
    prescription: true,
    status: "active",
    lastUpdated: "2024-01-10",
  },
  {
    id: "3",
    name: "Cetirizine 10mg",
    genericName: "Cetirizine HCl",
    manufacturer: "Dr. Reddy's",
    category: "Allergy",
    price: 45,
    costPrice: 32,
    stock: 80,
    minStock: 40,
    maxStock: 300,
    expiryDate: "2025-06-30",
    batchNumber: "CTZ2024003",
    prescription: false,
    status: "active",
    lastUpdated: "2024-01-12",
  },
  {
    id: "4",
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    manufacturer: "Lupin",
    category: "Gastric",
    price: 120,
    costPrice: 95,
    stock: 0,
    minStock: 25,
    maxStock: 150,
    expiryDate: "2025-03-15",
    batchNumber: "OMP2024004",
    prescription: true,
    status: "active",
    lastUpdated: "2024-01-08",
  },
]

export function InventoryManagement() {
  const [inventory, setInventory] = useState<Medicine[]>(sampleInventory)
  const [filteredInventory, setFilteredInventory] = useState<Medicine[]>(sampleInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)

  const categories = ["all", ...Array.from(new Set(inventory.map((m) => m.category)))]

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
          m.genericName.toLowerCase().includes(search.toLowerCase()) ||
          m.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
          m.batchNumber.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (category !== "all") {
      filtered = filtered.filter((m) => m.category === category)
    }

    if (status !== "all") {
      if (status === "low_stock") {
        filtered = filtered.filter((m) => m.stock <= m.minStock)
      } else if (status === "out_of_stock") {
        filtered = filtered.filter((m) => m.stock === 0)
      } else if (status === "expiring_soon") {
        const threeMonthsFromNow = new Date()
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
        filtered = filtered.filter((m) => new Date(m.expiryDate) <= threeMonthsFromNow)
      } else {
        filtered = filtered.filter((m) => m.status === status)
      }
    }

    setFilteredInventory(filtered)
  }

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.stock === 0) return { status: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (medicine.stock <= medicine.minStock) return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    if (medicine.stock >= medicine.maxStock) return { status: "Overstock", color: "bg-blue-100 text-blue-800" }
    return { status: "In Stock", color: "bg-green-100 text-green-800" }
  }

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)

    if (expiry <= now) return { status: "Expired", color: "bg-red-100 text-red-800" }
    if (expiry <= threeMonthsFromNow) return { status: "Expiring Soon", color: "bg-yellow-100 text-yellow-800" }
    return { status: "Valid", color: "bg-green-100 text-green-800" }
  }

  const deleteMedicine = (id: string) => {
    setInventory((prev) => prev.filter((m) => m.id !== id))
    setFilteredInventory((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Manage your medicine inventory and stock levels</p>
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
            <AddMedicineForm onClose={() => setShowAddDialog(false)} />
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
                  {inventory.filter((m) => m.stock <= m.minStock && m.stock > 0).length}
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
                <p className="text-2xl font-bold text-red-600">{inventory.filter((m) => m.stock === 0).length}</p>
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
                  ₹{inventory.reduce((total, m) => total + m.stock * m.costPrice, 0).toLocaleString()}
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
            placeholder="Search medicines, batch numbers..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
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
                  <th className="text-left p-4 font-medium text-gray-900">Expiry</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((medicine) => {
                  const stockStatus = getStockStatus(medicine)
                  const expiryStatus = getExpiryStatus(medicine.expiryDate)

                  return (
                    <tr key={medicine.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{medicine.name}</p>
                          <p className="text-sm text-gray-600">{medicine.genericName}</p>
                          <p className="text-xs text-gray-500">{medicine.manufacturer}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{medicine.category}</Badge>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{medicine.stock}</p>
                          <p className="text-xs text-gray-500">Min: {medicine.minStock}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">₹{medicine.price}</p>
                          <p className="text-xs text-gray-500">Cost: ₹{medicine.costPrice}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm">{new Date(medicine.expiryDate).toLocaleDateString()}</p>
                          <Badge className={`text-xs ${expiryStatus.color}`}>{expiryStatus.status}</Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge className={stockStatus.color}>{stockStatus.status}</Badge>
                          {medicine.prescription && (
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
            <EditMedicineForm medicine={editingMedicine} onClose={() => setEditingMedicine(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function AddMedicineForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    manufacturer: "",
    category: "",
    price: "",
    costPrice: "",
    stock: "",
    minStock: "",
    maxStock: "",
    expiryDate: "",
    batchNumber: "",
    prescription: false,
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would save to database
    console.log("Adding medicine:", formData)
    onClose()
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
          <Label htmlFor="genericName">Generic Name *</Label>
          <Input
            id="genericName"
            value={formData.genericName}
            onChange={(e) => setFormData((prev) => ({ ...prev, genericName: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer *</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer}
            onChange={(e) => setFormData((prev) => ({ ...prev, manufacturer: e.target.value }))}
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
              <SelectItem value="Gastric">Gastric</SelectItem>
              <SelectItem value="Diabetes">Diabetes</SelectItem>
              <SelectItem value="Vitamins">Vitamins</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Selling Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price (₹) *</Label>
          <Input
            id="costPrice"
            type="number"
            value={formData.costPrice}
            onChange={(e) => setFormData((prev) => ({ ...prev, costPrice: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Current Stock *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStock">Minimum Stock *</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData((prev) => ({ ...prev, minStock: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date *</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="batchNumber">Batch Number *</Label>
          <Input
            id="batchNumber"
            value={formData.batchNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, batchNumber: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="prescription"
          checked={formData.prescription}
          onChange={(e) => setFormData((prev) => ({ ...prev, prescription: e.target.checked }))}
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
        <Button type="submit">Add Medicine</Button>
      </div>
    </form>
  )
}

function EditMedicineForm({ medicine, onClose }: { medicine: Medicine; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: medicine.name,
    genericName: medicine.genericName,
    manufacturer: medicine.manufacturer,
    category: medicine.category,
    price: medicine.price.toString(),
    costPrice: medicine.costPrice.toString(),
    stock: medicine.stock.toString(),
    minStock: medicine.minStock.toString(),
    maxStock: medicine.maxStock.toString(),
    expiryDate: medicine.expiryDate,
    batchNumber: medicine.batchNumber,
    prescription: medicine.prescription,
    status: medicine.status,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would update in database
    console.log("Updating medicine:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-stock">Current Stock *</Label>
          <Input
            id="edit-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-price">Selling Price (₹) *</Label>
          <Input
            id="edit-price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-minStock">Minimum Stock *</Label>
          <Input
            id="edit-minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData((prev) => ({ ...prev, minStock: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Update Medicine</Button>
      </div>
    </form>
  )
}
