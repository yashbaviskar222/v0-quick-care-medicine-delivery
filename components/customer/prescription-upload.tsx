"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Camera, X, Check } from "lucide-react"

interface PrescriptionUpload {
  id: string
  fileName: string
  uploadDate: string
  status: "pending" | "verified" | "rejected"
  doctorName?: string
  notes?: string
}

export function PrescriptionUpload() {
  const [uploads, setUploads] = useState<PrescriptionUpload[]>([
    {
      id: "1",
      fileName: "prescription_jan_2024.jpg",
      uploadDate: "2024-01-15",
      status: "verified",
      doctorName: "Dr. Smith",
      notes: "Valid prescription for antibiotics",
    },
    {
      id: "2",
      fileName: "prescription_dec_2023.pdf",
      uploadDate: "2023-12-20",
      status: "pending",
      doctorName: "Dr. Johnson",
    },
  ])

  const [dragActive, setDragActive] = useState(false)
  const [doctorName, setDoctorName] = useState("")
  const [notes, setNotes] = useState("")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const file = files[0]
    const newUpload: PrescriptionUpload = {
      id: Date.now().toString(),
      fileName: file.name,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "pending",
      doctorName: doctorName || undefined,
      notes: notes || undefined,
    }

    setUploads((prev) => [newUpload, ...prev])
    setDoctorName("")
    setNotes("")
  }

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id))
  }

  const getStatusColor = (status: PrescriptionUpload["status"]) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusIcon = (status: PrescriptionUpload["status"]) => {
    switch (status) {
      case "verified":
        return <Check className="h-4 w-4" />
      case "rejected":
        return <X className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Prescription</h2>
        <p className="text-gray-600">Upload your prescription for prescription medicines</p>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>New Prescription Upload</CardTitle>
          <CardDescription>
            Upload a clear photo or PDF of your prescription. Our pharmacists will verify it within 30 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Doctor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor-name">Doctor Name (Optional)</Label>
              <Input
                id="doctor-name"
                placeholder="Dr. John Smith"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              accept="image/*,.pdf"
            />

            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-900">Drop your prescription here, or click to browse</p>
                <p className="text-sm text-gray-500 mt-1">Supports: JPG, PNG, PDF (Max 10MB)</p>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Tips for better verification:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure the prescription is clearly visible and not blurry</li>
              <li>• Include the doctor's signature and stamp</li>
              <li>• Make sure the date is within the valid period</li>
              <li>• Capture all pages if it's a multi-page prescription</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Previous Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Uploads</CardTitle>
          <CardDescription>Track the status of your prescription uploads</CardDescription>
        </CardHeader>
        <CardContent>
          {uploads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No prescriptions uploaded yet</p>
          ) : (
            <div className="space-y-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{upload.fileName}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-500">
                          Uploaded: {new Date(upload.uploadDate).toLocaleDateString()}
                        </p>
                        {upload.doctorName && <p className="text-sm text-gray-500">Doctor: {upload.doctorName}</p>}
                      </div>
                      {upload.notes && <p className="text-sm text-gray-600 mt-1">{upload.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={`gap-1 ${getStatusColor(upload.status)}`}>
                      {getStatusIcon(upload.status)}
                      {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                    </Badge>

                    <Button variant="ghost" size="sm" onClick={() => removeUpload(upload.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
