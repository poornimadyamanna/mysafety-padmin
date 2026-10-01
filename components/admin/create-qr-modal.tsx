"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { createQr, getModules } from "@/lib/apicalls/qrcode"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useLocation } from "@/context/location-context"

interface CreateQRModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface ModuleItem {
  name: string
  code: string
  isActive: boolean
}

export function CreateQRModal({ open, onOpenChange, onSuccess }: CreateQRModalProps) {
  const [moduleType, setModuleType] = useState("")
  const [count, setCount] = useState("")
  const [batchInfo, setBatchInfo] = useState("")
  const [modules, setModules] = useState<ModuleItem[]>([])
  const router = useRouter();
  const { lat, lng } = useLocation();
  console.log("QR code page:", lat, lng)
  const [fullAddress, setFullAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");


  // OTP STATES
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [pendingPayload, setPendingPayload] = useState<any>(null)

  // AUTO FOCUS FIRST OTP
  useEffect(() => {
    if (showOtpModal) {
      setTimeout(() => {
        document.getElementById("otp-0")?.focus()
      }, 100)
    }
  }, [showOtpModal])

  // OTP HANDLERS
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otpValues]
    newOtp[index] = value
    setOtpValues(newOtp)

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const isOtpComplete = otpValues.every((digit) => digit !== "")
  const finalOtp = otpValues.join("")

  // OPEN OTP MODAL
  const handleOpenOtp = () => {
    if (!moduleType || !count || !batchInfo) {
      toast.error("All fields are required")
      return
    }

    const payload = {
      moduleType,
      count: Number(count),
      batchInfo,
    }

    setPendingPayload(payload)
    setShowOtpModal(true)
  }

  const verifyCreateQr = async () => {
    setLoading(true)
    try {
      const result = await createQr(pendingPayload, finalOtp)

      // ✅ Force redirect if unauthorized
      if (result?.unauthorized) {
        router.push("/admin/login");
        toast.error("Session expired. Please login again.");
        return;
      }

      if (result.success) {
        toast.success("QR Code created successfully")
        onSuccess()

        setModuleType("")
        setCount("")
        setBatchInfo("")
        setOtpValues(["", "", "", "", "", ""])
        setPendingPayload(null)
        setShowOtpModal(false)
        onOpenChange(false)
      } else {
        toast.error(result.error || "Failed to create QR")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // FETCH MODULES
  const fetchModules = async () => {
    try {
      const response = await getModules()

      // ✅ Force redirect if unauthorized
      if (response?.unauthorized) {
        router.push("/admin/login");
        toast.error("Session expired. Please login again.");
        return;
      }

      if (response?.success && Array.isArray(response.data)) {
        setModules(response.data.filter((mod: ModuleItem) => mod.isActive))
      }
    } catch (error) {
      console.error("Error fetching modules:", error)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [])

  useEffect(() => {
    if (!open) return;
    if (!lat || !lng) return;

    const fetchAddress = async () => {
      try {
        const res = await fetch("/api/app/get-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat, lng }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Address fetch failed:", data.message);
          return;
        }

        console.log("Address data:", data);

      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };

    fetchAddress();
  }, [open, lat, lng]);

  return (
    <>
      {/* MAIN CREATE QR MODAL */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New QR Code</DialogTitle>
            <DialogDescription>
              Generate a new QR code for vehicle safety, door bell, lost & found, or smart card.
            </DialogDescription>
          </DialogHeader>


          <div className="space-y-6">
            {/* Module Type */}
            <Select value={moduleType} onValueChange={setModuleType}>
              <SelectTrigger id="qr-type">
                <SelectValue placeholder="Select module type" />
              </SelectTrigger>

              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module.code} value={module.code}>
                    {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Count */}
            <div className="space-y-2">
              <Label htmlFor="count">Count</Label>
              <Input
                id="count"
                type="number"
                placeholder="Enter the count"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>

            {/* Batch Info */}
            <div className="space-y-2">
              <Label htmlFor="batch">Batch Info</Label>
              <Input
                id="batch"
                placeholder="e.g., Batch-2024-001"
                value={batchInfo}
                onChange={(e) => setBatchInfo(e.target.value)}
              />
            </div>
            {/* Description */}
            {/* <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Additional details..." rows={3} />
          </div> */}

            {/* Location */}
            {/* <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select defaultValue="delhi">
              <SelectTrigger id="location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleOpenOtp}>
                Create QR Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP MODAL */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP to confirm QR generation.
            </DialogDescription>
          </DialogHeader>

          {/* OTP INPUT BOXES */}
          <div className="flex justify-center gap-2 py-4">
            {otpValues.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleOtpBackspace(e, index)}
                className="w-12 h-12 text-center text-xl font-semibold border border-yellow-400"
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <Button
            className="w-full"
            disabled={!isOtpComplete || loading}
            onClick={verifyCreateQr}
          >
            {loading ? "Verifying..." : "Verify & Create"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
