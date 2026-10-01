"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { createUpdateProducts } from "@/lib/apicalls/products"
import { getModules } from "@/lib/apicalls/qrcode"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface CreateProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editData?: any
  onSuccess?: () => void
}

interface ModuleItem {
  name: string
  code: string
  isActive: boolean
}

export function CreateProductModal({ open, onOpenChange, editData, onSuccess }: CreateProductModalProps) {
  const [modules, setModules] = useState<ModuleItem[]>([])
  const [moduleType, setModuleType] = useState("")
  const [basePrice, setBasePrice] = useState<string>("")
  const [downloadPrice, setDownloadPrice] = useState<string>("")
  const [minQuantity, setMinQuantity] = useState<string>("")
  const [maxQuantity, setMaxQuantity] = useState<string>("")
  const [discountPercentage, setDiscountPercentage] = useState<string>("")
  const router = useRouter();

  const fetchModules = async () => {
    try {
      const response = await getModules()

      // Force redirect if unauthorized
      if (response?.unauthorized) {
        router.push("/admin/login");
        toast.error("Session expired. Please login again.");
        return;
      }

      if (response?.success && Array.isArray(response.data)) {
        const activeModules = response.data.filter((mod: ModuleItem) => mod.isActive === true)
        setModules(activeModules)
      } else {
        console.error("Module API failed:", response?.error)
      }
    } catch (error) {
      console.error("Error fetching modules:", error)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [])

  // Prefill when editData changes
  useEffect(() => {
    if (editData) {
      setModuleType(editData.moduleType ?? "")
      setBasePrice(editData.basePrice != null ? String(editData.basePrice) : "")
      setDownloadPrice(editData.downloadPrice != null ? String(editData.downloadPrice) : "")
      setMinQuantity(editData.bulkDiscounts[0]?.minQuantity != null ? String(editData.bulkDiscounts[0].minQuantity) : "")
      setMaxQuantity(editData.bulkDiscounts[0]?.maxQuantity != null ? String(editData.bulkDiscounts[0].maxQuantity) : "")
      setDiscountPercentage(editData.bulkDiscounts[0]?.discountPercentage != null ? String(editData.bulkDiscounts[0].discountPercentage) : "")
    } else {
      setModuleType("")
      setBasePrice("")
      setDownloadPrice("")
      setMinQuantity("")
      setMaxQuantity("")
      setDiscountPercentage("")
    }
  }, [editData])

  const handleCreateOrUpdate = async () => {
    if (!moduleType) {
      toast.error("Please select module type")
      return
    }
    const payload = {
      moduleType,
      basePrice: Number(basePrice || 0),
      downloadPrice: Number(downloadPrice || 0),
      bulkDiscounts: {
        minQuantity: Number(minQuantity || 0),
        maxQuantity: Number(maxQuantity || 0),
        discountPercentage: Number(discountPercentage || 0),
      },
    }

    const result = await createUpdateProducts(payload)

    // ✅ Force redirect if unauthorized
    if (result?.status === 401) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (result.success) {
      toast.success(editData ? "Product updated successfully" : "Product created successfully")
      onOpenChange(false)
      onSuccess?.()
      setModuleType("")
      setBasePrice("")
      setDownloadPrice("")
      setMinQuantity("")
      setMaxQuantity("")
      setDiscountPercentage("")
    } else {
      toast.error("Operation failed")
      console.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>Create or update a product for QR codes, smart cards, or subscriptions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="module-type">Module Type</Label>
            <Select value={moduleType} onValueChange={setModuleType} disabled={!!editData}>
              <SelectTrigger id="module-type">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Base Price (₹)</Label>
            <Input id="price" type="number" placeholder="Enter price" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Download Price (₹)</Label>
            <Input id="price" type="number" placeholder="Enter price" value={downloadPrice} onChange={(e) => setDownloadPrice(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minquantity">Minimum Quantity</Label>
            <Input id="minquantity" type="number" placeholder="Enter min quantity" value={minQuantity} onChange={(e) => setMinQuantity(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxquantity">Maximum Quantity</Label>
            <Input id="maxquantity" type="number" placeholder="Enter max quantity" value={maxQuantity} onChange={(e) => setMaxQuantity(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount percentage</Label>
            <Input id="discount" type="number" placeholder="Enter discount percentage" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => { onOpenChange(false); }}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleCreateOrUpdate}>
              {editData ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
