"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit2, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductStats } from "./product-stats"
import { CreateProductModal } from "./create-product-modal"
import { getProductList, getProductDetails, deleteProduct } from "@/lib/apicalls/products"
import { toast } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function ProductManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [productData, setProductData] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const router = useRouter();

  const fetchProductData = async () => {
    const response = await getProductList()
    // console.log("fetch products...", response);

    // Force redirect if unauthorized
    if (response?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (response.success) {
      return response.data || []
    } else {
      console.error("Error fetching products:", response.error)
      return []
    }
  }

  const loadProducts = async () => {
    const products = await fetchProductData()
    setProductData(products)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleView = async (moduleType: string) => {
    const res = await getProductDetails({ moduleType })

    // Force redirect if unauthorized
    if (res?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (res.success) {
      setSelectedProduct(res.data)
      setIsViewOpen(true)
    } else {
      toast.error("Failed to fetch product details")
    }
  }

  const handleEdit = async (moduleType: string) => {
    const res = await getProductDetails({ moduleType })

    // ✅ Force redirect if unauthorized
    if (res?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (res.success) {
      setSelectedProduct(res.data)
      setIsEditOpen(true)
    } else {
      toast.error("Failed to fetch product details")
    }
  }

  const handleDelete = async (moduleType: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    const res = await deleteProduct({ moduleType })

    // ✅ Force redirect if unauthorized
    if (res?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (res.success) {
      toast.success("Product deleted")
      await loadProducts()
    } else {
      toast.error("Delete failed")
      console.error(res.error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Products</h1>
        <p className="text-muted-foreground mt-2">Create and manage Products like vehicle safety, door bells, smart cards and lost & found.</p>
      </div>

      <ProductStats />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md"></div>
        <Button
          onClick={() => {
            setSelectedProduct(null)
            setIsCreateModalOpen(true)
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Base price</TableHead>
                  <TableHead>Download price</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productData.map((product) => (
                  <TableRow key={product.moduleType ?? product.id}>
                    <TableCell className="font-medium">{product.moduleType}</TableCell>
                    <TableCell>₹{product.basePrice}</TableCell>
                    <TableCell>₹{product.downloadPrice}</TableCell>
                    <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "outline"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(product.moduleType)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product.moduleType)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.moduleType)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {productData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Modal */}
      <CreateProductModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open)
          if (!open) setSelectedProduct(null)
        }}
        editData={null}
        onSuccess={loadProducts}
      />

      {/* Edit Modal */}
      <CreateProductModal
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) setSelectedProduct(null)
        }}
        editData={selectedProduct ?? undefined}
        onSuccess={async () => {
          await loadProducts()
          setIsEditOpen(false)
          setSelectedProduct(null)
        }}
      />

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-sm">
            <p><strong>Module:</strong> {selectedProduct?.moduleType}</p>
            <p><strong>Base Price:</strong> ₹{selectedProduct?.basePrice}</p>
            <p><strong>Download Price:</strong> ₹{selectedProduct?.downloadPrice}</p>
            <p><strong>Min Qty:</strong> {selectedProduct?.bulkDiscounts[0]?.minQuantity}</p>
            <p><strong>Max Qty:</strong> {selectedProduct?.bulkDiscounts[0]?.maxQuantity}</p>
            <p><strong>Discount:</strong> {selectedProduct?.bulkDiscounts[0]?.discountPercentage}%</p>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsViewOpen(false); setSelectedProduct(null) }}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
