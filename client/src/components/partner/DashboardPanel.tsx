
import { usePublicStore, useUserStore } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ExternalLink, IndianRupee, Package, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { CategoryIcon } from "../product/ProductMetaType";
import { Button } from "../ui/button";

interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatsCard = ({
  label,
  value,
  icon
}: StatsCardProps) => {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_16px_50px_-30px_rgba(99,102,241,0.35)] ring-1 ring-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/25 hover:bg-[#10132a]/90">
      <CardContent className="flex items-center justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</p>
        </div>

        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 transition-colors duration-300 group-hover:border-indigo-400/40 group-hover:bg-indigo-500/20 group-hover:text-indigo-200 sm:size-14">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

const DashboardPanel = () => {

  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  const partner = useUserStore((s) => s.partner);
  const allPublicProducts = usePublicStore((s) => s.allPublicProducts);
  const allOrders = usePublicStore((s) => s.allOrders);

  const partnerProducts = partner ? allPublicProducts.filter((p) => p.partnerId === partner._id) : [];

  const partnerOrders = partner
    ? allOrders
      .filter((o) => String(o.partnerId) === String(partner._id))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
    : [];

  const totalRevenue = partner?.totalRevenue ?? 0;
  const totalSales = partner?.totalSales ?? 0;

  const activeProducts = partnerProducts.length;

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-8 sm:gap-10 sm:px-6 lg:px-8">

      <div className="flex flex-col gap-3">
        <h1 className="bg-linear-to-b from-white via-white to-indigo-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl lg:text-4xl">
          Hello, {partner?.name || "Partner"} 👋
        </h1>

        <p className="text-sm leading-6 text-slate-400 sm:text-base">
          Here's an overview of your store performance.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          Your Analytics
        </h2>

        <p className="text-sm leading-6 text-slate-400">
          Track your sales, earnings, and product performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <StatsCard
          label="Total Earnings"
          value={`₹${totalRevenue.toFixed(2)}`}
          icon={<IndianRupee className="size-6" />}
        />

        <StatsCard
          label="Total Sales"
          value={String(totalSales)}
          icon={<ShoppingBag className="size-6" />}
        />

        <StatsCard
          label="Active Products"
          value={String(activeProducts)}
          icon={<Package className="size-6" />}
        />
      </div>

      <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.4)] ring-1 ring-white/5 backdrop-blur-xl">
        <CardHeader className="border-b border-white/10 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              {activeTab === "products" ? "Your Products" : "Recent Orders"}
            </CardTitle>

            <div className="flex w-full items-center gap-1 rounded-xl border border-white/10 bg-black/20 p-1 sm:w-auto">
              <button
                onClick={() => setActiveTab("products")}
                type="button"
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 sm:flex-none ${activeTab === "products"
                  ? "border border-indigo-400/20 bg-indigo-500/15 text-indigo-200 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
              >
                <Package className="size-4" />
                Products
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                type="button"
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 sm:flex-none ${activeTab === "orders"
                  ? "border border-indigo-400/20 bg-indigo-500/15 text-indigo-200 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
              >
                <ShoppingBag className="size-4" />
                Orders
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {activeTab === "products" ? (
            partnerProducts.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 bg-white/2 px-4 py-12 text-center text-sm text-slate-500">
                No published products yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {partnerProducts.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    className="group flex min-w-0 flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/2.5 p-3 transition-all duration-200 hover:border-indigo-400/20 hover:bg-white/4.5 sm:gap-4 sm:p-4"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-indigo-300 sm:size-12">
                      <CategoryIcon type={p.type} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-100 sm:text-base">
                        {p.title}
                      </p>
                      <p className="mt-1 text-xs capitalize text-slate-500 sm:text-sm">
                        {p.type}
                      </p>
                    </div>

                    <div className="hidden items-center gap-8 md:flex">
                      <div className="min-w-16">
                        <p className="text-xs font-medium text-slate-500">Sales</p>
                        <p className="mt-1 text-sm font-semibold tabular-nums text-slate-200">
                          {p.totalSales ?? 0}
                        </p>
                      </div>
                      <div className="min-w-24">
                        <p className="text-xs font-medium text-slate-500">Revenue</p>
                        <p className="mt-1 text-sm font-semibold tabular-nums text-emerald-300">
                          ₹{(p.totalRevenue ?? 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="hidden min-w-12 sm:block md:hidden">
                      <p className="text-xs font-medium text-slate-500">Sales</p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-slate-200">
                        {p.totalSales ?? 0}
                      </p>
                    </div>

                    <Button
                      onClick={() => window.open(`/product/${p.slug}`, "_blank", "noopener noreferrer")}
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0 rounded-xl text-slate-400 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300"
                    >
                      <ExternalLink className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )
          ) : (
            partnerOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/2 px-4 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-500">
                  <ShoppingBag className="size-5" />
                </div>
                <p className="text-sm text-slate-500">No orders yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {partnerOrders.slice(0, 5).map((o) => (
                  <div
                    key={o._id}
                    className="flex min-w-0 flex-wrap items-center gap-3 rounded-2xl border border-white/8 bg-white/2.5 p-3 transition-colors duration-200 hover:border-indigo-400/20 hover:bg-white/4.5 sm:gap-4 sm:p-4"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-indigo-300 sm:size-12">
                      <ShoppingBag className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-100 sm:text-base">
                        {o.productTitle}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                        Customer: {o.customerName}
                      </p>

                      <div className="mt-2 text-xs text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </div>

                    <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
                      <p className="text-sm font-semibold tabular-nums text-white sm:text-base">
                        ₹{o.partnerAmount.toFixed(2)}
                      </p>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize tracking-wide ${o.paymentStatus === "success"
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : o.paymentStatus === "pending"
                            ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                            : "border-rose-400/20 bg-rose-400/10 text-rose-300"
                          }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPanel
