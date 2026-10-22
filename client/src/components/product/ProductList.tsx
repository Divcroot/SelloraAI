import { ExternalLink, Filter, MoreHorizontal, Pencil, Plus, Search, Share2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import type { Product } from "./types";
import { Input } from "../ui/input";
import { useState } from "react";
import { CategoryIcon } from "./ProductMetaType";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface ProductListProps {
    products: Product[];
    onCreateClick: () => void;
    onEditClick: (product: Product) => void;
    onDeleteClick: (product: Product) => void;
}

const ProductList = ({
    products,
    onCreateClick,
    onEditClick,
    onDeleteClick
}: ProductListProps) => {

    const [query, setQuery] = useState<string>("");

    const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Products <span className="mx-1 text-slate-600">&gt;</span> All Products</p>
                    <h1 className="bg-linear-to-b from-white via-white to-indigo-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">Products</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">Manage your digital products and sell them to customers.</p>
                </div>

                <Button
                    onClick={onCreateClick}
                    className="h-11 shrink-0 cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 font-semibold text-white shadow-[0_0_30px_-8px_rgba(139,92,246,0.7)] ring-1 ring-white/15 transition hover:scale-[1.02] hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.85)]"
                >
                    <Plus className="size-4" />
                    Create Product
                </Button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.5)] ring-1 ring-white/5 backdrop-blur-xl">
                <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                        <Input
                            className="h-11 rounded-xl border-white/10 bg-white/4 pl-10 text-white placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                            placeholder="Filter products..."
                            onChange={(e) => setQuery(e.target.value)}
                            value={query}
                        />
                    </div>

                    <Button variant="outline" className="h-11 cursor-pointer rounded-xl border-white/15 bg-white/4 px-4 text-slate-200 hover:bg-white/10 hover:text-white">
                        <Filter className="size-4" />
                        Filter
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-225 border-collapse text-left">
                        <thead className="bg-white/2.5">
                            <tr className="border-b border-white/10">
                                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Total Sales</th>
                                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</th>
                                <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">CreatedAt</th>
                                <th className="px-4 py-4" />
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={index} className="border-b border-white/6 transition-colors last:border-0 hover:bg-white/[0.035]">
                                    <td className="px-5 py-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <CategoryIcon
                                                type={product.type}
                                                size="sm"
                                            />

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-white">{product.title}</p>
                                                <p className="mt-1 truncate text-xs text-slate-500">{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-sm font-medium tabular-nums text-slate-200">
                                        ₹{product.price.toFixed(2)}
                                    </td>

                                    <td className="px-4 py-4">
                                        <Badge className={product.status === "published"
                                            ? "h-6 border border-emerald-400/20 bg-emerald-400/10 px-2.5 text-[11px] font-semibold text-emerald-300"
                                            : "h-6 border border-amber-400/20 bg-amber-400/10 px-2.5 text-[11px] font-semibold text-amber-300"}>
                                            {product.status === "published" ? "Published" : "Draft"}
                                        </Badge>
                                    </td>

                                    <td className="px-4 py-4 text-sm tabular-nums text-slate-300">{product.totalSales ?? 0}</td>

                                    <td className="px-4 py-4 text-sm font-medium tabular-nums text-slate-200">₹{(product.totalRevenue ?? 0.00).toFixed(2)}</td>

                                    <td className="px-4 py-4 text-sm text-slate-400">
                                        {new Date(product.createdAt ?? "").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {product.status === "published" && (
                                                <Button variant="outline" size="sm" className="h-8 cursor-pointer rounded-lg border-white/10 bg-white/3 px-2.5 text-xs text-slate-300 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-indigo-200">
                                                    <Share2 className="size-3.5" />
                                                    Share Link
                                                </Button>
                                            )}

                                            {product.status === "published" && (
                                                <Button variant="ghost" size="icon" title="Open product" className="size-8 cursor-pointer rounded-lg text-slate-400 hover:bg-white/10 hover:text-white">
                                                    <ExternalLink className="size-4" />
                                                </Button>
                                            )}

                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50">
                                                    <MoreHorizontal className="size-4" />
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end" className="w-40 rounded-xl border border-white/10 bg-[#111329] p-1.5 text-slate-200 shadow-xl">
                                                    <DropdownMenuItem onClick={() => onEditClick(product)} className="cursor-pointer rounded-lg px-2.5 py-2 focus:bg-indigo-500/15 focus:text-indigo-100">
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </DropdownMenuItem>

                                                     <DropdownMenuItem onClick={() => onDeleteClick(product)} className="cursor-pointer rounded-lg px-2.5 py-2 text-rose-300 focus:bg-rose-500/10 focus:text-rose-200">
                                                        <Trash2 className="size-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center text-sm text-slate-400">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ProductList