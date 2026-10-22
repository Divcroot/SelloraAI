import { Badge } from "../ui/badge";
import { CategoryThumbnail } from "./ProductMetaType";
import type { PRODUCT_STATUSES, PRODUCT_TYPES } from "./types";

interface ProductPreviewCardProps {
    title: string;
    price: number;
    description: string;
    type: PRODUCT_TYPES | "";
    status: PRODUCT_STATUSES;
}

const ProductPreviewCard = ({
    title,
    price,
    description,
    type,
    status
}: ProductPreviewCardProps) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d1f]/85 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.5)] ring-1 ring-white/5 backdrop-blur-xl">
            <div className="h-48 overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(217,70,239,0.08))] sm:h-56">
                {type ? (
                    <CategoryThumbnail
                        type={type}
                        fill
                        showIconBadge
                    />
                ) : (
                    <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.2),transparent_65%)]" />
                )}
            </div>

            <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Live Preview</p>

                    <Badge className={status === "published"
                        ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10"
                        : "border border-amber-400/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/10"}>
                        {status === "published" ? "Published" : "Draft"}
                    </Badge>
                </div>

                <h3 className="wrap-break-word text-xl font-semibold tracking-tight text-white">{title || "Untitled Product"}</h3>

                <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-300">{type.toUpperCase() ?? "No category selected"}</p>

                <p className="text-2xl font-bold tracking-tight text-white">₹{price ? price.toFixed(2) : "0.00"}</p>

                {description && (
                    <p className="border-t border-white/10 pt-4 text-sm leading-6 text-slate-400">{description}</p>
                )}
            </div>
        </div>
    )
}

export default ProductPreviewCard