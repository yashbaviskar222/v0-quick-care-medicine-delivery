"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function BackButton({ onClick, label = "Back", className = "" }: BackButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} className={`mb-6 ${className}`}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </Button>
  )
}
