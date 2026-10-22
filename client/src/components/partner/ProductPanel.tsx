import { useEffect, useState } from "react";
import CreateProductForm from "../product/CreateProductForm";
import EditProductForm from "../product/EditProductForm";
import ProductList from "../product/ProductList";
import type { Product } from "../product/types";
import api from "@/utils/axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/store";
import ProfileCompleteNote from "../product/ProfileCompleteNote";

type view = "list" | "create" | "edit";

const ProductPanel = () => {

  const [view, setView] = useState<view>("list");
  const [creating, setCreating] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const partner = useUserStore((s) => s.partner);

  const isProfileComplete = () => {
    if (!partner) return false;
    if (!partner.name?.trim()) return false;
    if (!partner.partnerProfile?.slug?.trim()) return false;
    if (!partner.partnerProfile?.bio?.trim()) return false;
    if (!partner.paymentDetails) return false;
    if (!partner.paymentDetails.accountHolderName?.trim()) return false;
    if (!partner.paymentDetails.accountHolderName?.trim()) return false;
    if (partner.paymentDetails.method === "upi") {
      if (!partner.paymentDetails.upiId?.trim()) return false;
    }
    if (partner.paymentDetails.method === "bank") {
      if (!partner.paymentDetails.accountNumber?.trim()) return false;
      if (!partner.paymentDetails.ifscCode?.trim()) return false;
    }

    return true;
  }

  const profileComplete = isProfileComplete();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/product/all');
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {

      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [])

  const handleCreateProduct = async (product: Product) => {
    setCreating(true);
    try {
      const response = await api.post("/api/product", product);
      setProducts((prev) => ([...prev, response.data.product]));
      setView("list");
      toast.success("Product Created.");
    } catch (error: any) {
      console.error("Create Product Error: ", error)

      if (error?.response?.status === 409 && error?.response?.data?.field === "slug") {
        toast.error("This product slug is already taken");
        return;
      }

      toast.error("Failed to Create Product.");
    } finally {
      setCreating(false);
    }
  }

  const handleEditClick = async (product: Product) => {
    setSelectedProduct(product);
    setView("edit");
  }

  const handleEditProduct = async (updated: Product) => {
    setEditing(true);
    try {
      const response = await api.patch(`/api/product/${updated._id}`, updated);
      if (response.data.success) {
        setProducts((prev) => prev.map((product) => product._id === updated._id ? response.data.product : product));
        setView("list");
      }
      toast.success("Product Updated.");
    } catch (error) {
      toast.error("Failed to update Product.")
    } finally {
      setEditing(false);
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(`Delete "${product.title}"? This cannot be undone.`);
      if (!confirmed) return;
    try {
      const response = await api.delete(`api/product/${product._id}`);
      if (response.data.success) {
        setProducts((prev) => prev.filter((p) => product._id !== p._id));
        setView("list");
        toast.success("Product Deleted");
      }
    } catch (error) {
      toast.error("Failed to delete Product.");
    }
  }

  if (loading) {
    return (
      <div className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#05060f] text-slate-300">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[56px_56px] before:absolute before:left-1/2 before:top-1/2 before:size-160 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-indigo-600/30 before:blur-[130px] after:absolute after:-right-24 after:top-1/4 after:size-md after:rounded-full after:bg-fuchsia-600/20 after:blur-[120px]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_35px_-8px_rgba(99,102,241,0.6)] backdrop-blur">
              <div className="size-7 animate-spin rounded-full border-2 border-indigo-300/30 border-t-fuchsia-400" />
            </div>
            <span className="text-2xl font-extrabold tracking-[-0.045em] text-white">
              Sellora<span className="bg-linear-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>
          <p className="text-sm font-medium tracking-wide text-slate-400">Loading your marketplace</p>
        </div>
      </div>
    )
  }

  if (!profileComplete) {
    return (
      <ProfileCompleteNote />
    )
  }

  return (
    <div>

      {view === "create" && (
        <CreateProductForm
          onCreate={handleCreateProduct}
          onCancel={() => setView("list")}
          loading={creating}
        />
      )}

      {view === "edit" && (
        selectedProduct && (
          <EditProductForm
            product={selectedProduct}
            loading={editing}
            onSave={handleEditProduct}
            onDelete={handleDeleteProduct}
            onCancel={() => setView("list")}
          />
        )
      )}

      {view === "list" && (
        <ProductList
          products={products}
          onCreateClick={() => setView("create")}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteProduct}
        />
      )}

    </div>
  )
}

export default ProductPanel