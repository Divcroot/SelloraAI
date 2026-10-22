import { useState } from "react";
import { PRODUCT_TYPES, type Product, type PRODUCT_STATUSES, type ProductLinkItem } from "./types"
import { FileText, SlidersHorizontal, Trash2, UploadCloud } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ProductLinksEditor from "./ProductLinksEditor";
import { Button } from "../ui/button";
import ProductPreviewCard from "./ProductPreviewCard";
import { toast } from "sonner";

interface EditProductProps {
  product: Product;
  onSave: (product: Product) => void;
  onDelete: (product: Product) => void;
  onCancel: () => void;
  loading: boolean;
}

const EditProductForm = ({
  product,
  loading,
  onSave,
  onDelete,
  onCancel
}: EditProductProps) => {

  const [title, setTitle] = useState<string>(product.title);
  const [description, setDescription] = useState<string>(product.description);
  const [type, setType] = useState<PRODUCT_TYPES>(product.type);
  const [price, setPrice] = useState<string>(String(product.price));
  const [links, setLinks] = useState<ProductLinkItem[]>(product.links ?? []);
  const [status, setStatus] = useState<PRODUCT_STATUSES>(product.status);

  const buildProduct = (overrideStatus?: PRODUCT_STATUSES) : Product => ({
    ...product,
    title,
    description,
    type,
    price: Number(price),
    links,
    status: overrideStatus ?? status,
  }) 

  const handleSubmit = () => {
    if (!title || !description || !price) {
      toast.error("Please fill all required fields.");
      return;
    }

    onSave(buildProduct());
  }

  const handleToggleStatus = () => {
    const nextStatus: PRODUCT_STATUSES = status === "published" ? "draft" : "published";
    setStatus(nextStatus);
    onSave(buildProduct(nextStatus));
  }

  const isPublished = status === "published";

  return (
    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-8 text-slate-200 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-medium tracking-wide text-slate-500">Products <span className="mx-1 text-slate-600">&gt;</span> Edit</p>
          <h1 className="bg-linear-to-b from-white via-white to-indigo-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">Edit Product</h1>
          <p className="mt-1 text-sm text-slate-400">Update your product information and settings.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="h-11 cursor-pointer rounded-xl border-rose-400/20 bg-rose-500/60 px-4 text-rose-300 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200" disabled={loading} onClick={() => onDelete(product)}>
            <Trash2 className="size-4" />
            Delete Product
          </Button>

          <Button onClick={handleToggleStatus} disabled={loading} className={isPublished
            ? "h-11 cursor-pointer rounded-xl border border-amber-400/20 bg-amber-500/6 px-4 text-amber-200 hover:bg-amber-500/15"
            : "h-11 cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 font-semibold text-white shadow-[0_0_30px_-8px_rgba(139,92,246,0.7)] ring-1 ring-white/15 transition hover:scale-[1.02] hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.85)]"}>
            {isPublished ? "Move to Draft" : "Publish Product"}
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)] lg:gap-8">
        <div className="min-w-0">
          <div className="space-y-5">
            {/* Basic Info */}
            <section className="space-y-5 rounded-2xl border border-white/10 bg-[#0b0d1f]/80 p-5 shadow-[0_24px_80px_-45px_rgba(99,102,241,0.45)] ring-1 ring-white/5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <FileText className="size-5 text-indigo-300" />
                <h2 className="text-base font-semibold tracking-wide text-white">Basic Info</h2>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300" htmlFor="title">
                  Product Title
                  <span className="text-rose-400">*</span>
                </Label>

                <Input
                  className="h-11 rounded-xl border-white/10 bg-white/4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                  id="title"
                  placeholder="e.g. Advanced Metrics Dashboard"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300" htmlFor="desc">
                  Product Description
                  <span className="text-rose-400">*</span>
                </Label>

                <Textarea
                  className="min-h-32 rounded-xl border-white/10 bg-white/4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                  id="desc"
                  placeholder="Briefly describe the product..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-5 rounded-2xl border border-white/10 bg-[#0b0d1f]/80 p-5 shadow-[0_24px_80px_-45px_rgba(99,102,241,0.45)] ring-1 ring-white/5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <SlidersHorizontal className="size-5 text-indigo-300" />
                <h2 className="text-base font-semibold tracking-wide text-white">Product Details</h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    Product Category
                    <span className="text-rose-400">*</span>
                  </Label>

                  <Select value={type} onValueChange={(v) => setType(v as PRODUCT_TYPES)}>
                    <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/4 text-slate-200 focus:ring-indigo-400/20">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl border border-white/10 bg-[#111329] text-slate-200 shadow-xl">
                      {
                        PRODUCT_TYPES.map((type) => (
                          <SelectItem
                            key={type.label}
                            value={type.value}
                            className="cursor-pointer rounded-lg focus:bg-indigo-500/15 focus:text-indigo-100"
                          >
                            {type.label}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300" htmlFor="price">
                    Price (INR)
                    <span className="text-rose-400">*</span>
                  </Label>

                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-400/20">
                    <span className="text-slate-500">₹</span>
                    <Input
                      className="h-11 border-0 bg-transparent px-0 text-white shadow-none focus-visible:border-transparent focus-visible:ring-0"
                      id="price"
                      type="number"
                      step="1"
                      min={0}
                      placeholder="299"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 rounded-xl border border-indigo-400/15 bg-indigo-500/[0.07] p-4">
                <UploadCloud className="mt-0.5 size-5 shrink-0 text-indigo-300" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200">Where do I host my product files?</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                    Upload your product (files, folders, source code, etc.) to Google Drive, set
                    sharing to <span>&quot;Anyone with the link&quot;</span>,
                    then paste that link below — e.g. title it &quot;Download&quot; and add the Drive URL as
                    a Product Link.
                  </p>
                </div>
              </div>

              <ProductLinksEditor
                links={links}
                onChange={setLinks}
              />
            </section>
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 pt-1 sm:flex-row">
            <Button className="h-11 cursor-pointer rounded-xl border-white/15 bg-white/4 px-5 text-slate-200 hover:bg-white/10 hover:text-white" disabled={loading} variant="outline" onClick={onCancel}>
              Cancel
            </Button>

            <Button className="h-11 cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 font-semibold text-white shadow-[0_0_30px_-10px_rgba(139,92,246,0.7)] transition hover:brightness-110" disabled={loading} onClick={handleSubmit}>
              {loading ? "Updating..." : "Edit Product"}
            </Button>
          </div>
        </div>

        <div className="min-w-0 lg:sticky lg:top-6">
          <ProductPreviewCard
            title={title}
            description={description}
            price={Number(price) || 0}
            type={type}
            status={status}
          />
        </div>
      </div>
    </div>
  )
}

export default EditProductForm