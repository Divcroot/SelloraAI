import { Button } from "@/components/ui/button";
import { usePublicStore } from "@/store/store";
import logo from "../assets/logo.png";
import { AlertTriangle, ArrowLeft, ArrowUpRight, ExternalLink, InfinityIcon, Link2, Lock, PackageX, ShieldCheck, ShoppingCart, Sparkles, Star, Store } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CategoryIcon, CategoryThumbnail, PRODUCT_META_TYPES } from "@/components/product/ProductMetaType";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { ProductLinkItem } from "@/components/product/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PublicProduct = () => {

  const { slug } = useParams<{ slug: string }>();

  const navigate = useNavigate();

  const allPublicPartners = usePublicStore((s) => s.allPublicPartners);
  const allPublicProducts = usePublicStore((s) => s.allPublicProducts);
  const loading = usePublicStore((s) => s.loading);

  const product = allPublicProducts.find((p) => p.slug === slug);

  const creator = product ? allPublicPartners.find((p) => p._id === product.partnerId) : undefined;

  const isProductAvailable = !!product && !!creator && creator.isActive === true;

  const [purchasedLinks, setPurchasedLinks] = useState<ProductLinkItem[] | undefined>(undefined);
  const [isBuyOpen, setIsBuyOpen] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState<string>("");
  const [buyerEmail, setBuyerEmail] = useState<string>("");

  if (loading) {
    return (
      <main className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#05060f] px-4 py-12 text-slate-300">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[56px_56px] before:absolute before:left-1/2 before:top-1/2 before:size-160 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-indigo-600/25 before:blur-[130px] after:absolute after:-right-24 after:top-1/4 after:size-md after:rounded-full after:bg-fuchsia-600/15 after:blur-[120px]" />
        <section className="flex flex-col items-center gap-5 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_35px_-8px_rgba(99,102,241,0.6)] backdrop-blur">
            <div className="size-7 animate-spin rounded-full border-2 border-indigo-300/30 border-t-fuchsia-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Finding this product</p>
            <p className="mt-1 text-sm text-slate-400">Loading product details...</p>
          </div>
        </section>
      </main>
    )
  }

  if (!isProductAvailable) {
    return (
      <main className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#05060f] px-4 py-12 text-slate-300">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[56px_56px] before:absolute before:left-1/2 before:top-1/2 before:size-160 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-indigo-600/25 before:blur-[130px] after:absolute after:-right-24 after:top-1/4 after:size-md after:rounded-full after:bg-fuchsia-600/15 after:blur-[120px]" />

        <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/85 p-7 text-center shadow-[0_24px_100px_-35px_rgba(99,102,241,0.55)] ring-1 ring-white/5 backdrop-blur-xl sm:p-10">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none bg-linear-to-b from-white/5 to-transparent bg-clip-text text-[11rem] font-black leading-none tracking-tighter text-transparent sm:text-[14rem]">
            404
          </div>

          <div className="relative mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-200 shadow-[0_0_35px_-10px_rgba(99,102,241,0.75)]">
            <PackageX className="size-7" />
          </div>

          <p className="relative mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
            Product unavailable
          </p>
          <h1 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
            This product isn’t available.
          </h1>
          <p className="relative mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
            The product or its creator is currently unavailable. Please explore other products on SelloraAI.
          </p>

          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              className="h-11 cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 font-semibold text-white shadow-[0_0_30px_-8px_rgba(139,92,246,0.7)] ring-1 ring-white/15 transition hover:scale-[1.02] hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.85)]"
              render={<Link to="/" />}
            >
              <Store className="size-4" />
              Explore marketplace
              <ArrowUpRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              className="h-11 cursor-pointer rounded-xl border-white/15 bg-white/4 px-5 text-slate-200 hover:bg-white/10 hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="size-4" />
              Go back
            </Button>
          </div>
        </section>
      </main>
    )
  }

  const metaType = PRODUCT_META_TYPES[product.type];

  const handlePay = async () => {
    if (!buyerName.trim() || !buyerEmail.trim()) return;
    setProcessing(true);
    try {
      setIsBuyOpen(false);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#05060f] text-slate-300 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] before:bg-size-[56px_56px] before:content-[''] after:pointer-events-none after:absolute after:-right-24 after:top-40 after:-z-10 after:size-md after:rounded-full after:bg-fuchsia-600/15 after:blur-[120px] after:content-['']">
      <div className="sticky top-0 z-40 bg-[#05060f]/70 px-4 pt-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#0b0d1f]/75 px-4 py-3 shadow-[0_0_50px_-15px_rgba(99,102,241,0.45)] ring-1 ring-white/5 sm:px-6">
          <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
            <img className="size-10 rounded-full bg-white/10 p-1.5 object-contain ring-1 ring-white/15" src={logo} alt="logo" />
            <span className="text-lg font-extrabold tracking-[-0.045em] text-white">
              Sellora<span className="bg-linear-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>

          <Button size="sm" className="h-10 cursor-pointer rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 font-semibold text-white shadow-[0_0_25px_-8px_rgba(139,92,246,0.7)] ring-1 ring-white/15 transition hover:scale-[1.02] hover:shadow-[0_0_35px_-8px_rgba(139,92,246,0.85)] sm:px-5" onClick={() => navigate('/')}>
            <span className="hidden sm:inline">Add Your Own Product</span>
            <span className="sm:hidden">List Product</span>
          </Button>
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8 lg:px-8">
        <div className="min-w-0 space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.5)] ring-1 ring-white/5 backdrop-blur-xl">
            <div className="relative h-56 overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,rgba(99,102,241,0.16),rgba(217,70,239,0.1))] sm:h-72">
              <CategoryThumbnail
                type={product.type}
                fill
                showIconBadge
                className="transition duration-500 hover:scale-[1.03]"
              />
            </div>

            <div className="p-6 sm:p-8">
              <Badge className={`mb-4 border border-white/10 ${metaType.classname} text-slate-100 shadow-sm`}>
                <Sparkles />
                {metaType.label ?? product.type}
              </Badge>

              <h1 className="max-w-3xl bg-linear-to-b from-white via-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">{product.title}</h1>

              <p className="mt-4 text-2xl font-bold tabular-nums text-white sm:text-3xl">₹{product.price}</p>

              <Button className="mt-6 h-12 w-full cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 font-semibold text-white shadow-[0_0_30px_-8px_rgba(139,92,246,0.7)] ring-1 ring-white/15 transition hover:scale-[1.01] hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.85)] sm:w-auto" onClick={() => setIsBuyOpen(true)} size="lg">
                <ShoppingCart />
                Buy Now
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b0d1f]/80 p-6 shadow-[0_18px_55px_-35px_rgba(99,102,241,0.4)] ring-1 ring-white/5 backdrop-blur-xl sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">About this {metaType.label}</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-400 sm:text-base">{product.description ?? "Product"}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0b0d1f]/80 p-6 shadow-[0_18px_55px_-35px_rgba(99,102,241,0.4)] ring-1 ring-white/5 backdrop-blur-xl sm:p-8">
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
              <Link2 className="size-5 text-indigo-300" />
              Included Resources
            </h2>

            {purchasedLinks && (
              <div className="mt-5 flex gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-100">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                <p className="text-sm leading-6">Your payment is successful. Download all purchased resources below. Keep this page open until your downloads are complete.</p>
              </div>
            )}

            <div className="mt-5 space-y-3">
              {(product.links ?? []).map((link, index) => {
                const unlocked = purchasedLinks?.[index];

                return (
                  <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 transition hover:border-indigo-400/25 hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between" key={index}>
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-200">
                        {unlocked ? <ExternalLink className="size-4" /> : <Link2 className="size-4" />}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">{link.title}</p>
                        {!unlocked && <p className="mt-1 flex items-center gap-1.5 text-xs leading-5 text-slate-500">
                          <Lock className="size-3 shrink-0" />
                          Purchase this product to access the resources
                        </p>
                        }
                      </div>
                    </div>

                    {unlocked ? (
                      <Button
                        className="cursor-pointer rounded-lg bg-indigo-500 px-4 text-white hover:bg-indigo-400"
                        onClick={() => window.open(unlocked.url, "_blank", "noopener,noreferrer")}
                      >
                        Download
                      </Button>
                    ) : (
                      <Button className="rounded-lg border-white/10 bg-white/5 text-slate-500" size="sm" disabled>
                        Download
                      </Button>
                    )}
                  </div>
                )
              })}

              {(!product.links || product.links.length === 0) && <p className="rounded-2xl border border-dashed border-white/10 bg-white/2 px-5 py-8 text-center text-sm text-slate-400">No resources listed for this product.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-white/10 bg-[#0b0d1f]/80 p-6 text-center shadow-[0_18px_55px_-35px_rgba(99,102,241,0.4)] ring-1 ring-white/5 backdrop-blur-xl">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-fuchsia-500 text-xl font-bold text-white shadow-[0_0_30px_-10px_rgba(99,102,241,0.75)] ring-2 ring-indigo-400/35">
              {creator?.name.split(" ").map((part) => part[0]).join("").toUpperCase()}
            </div>

            <h3 className="mt-4 text-lg font-bold text-white">{creator.name}</h3>

            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Creator</p>

            {creator.partnerProfile.bio && (
              <div className="mt-5 border-l-2 border-indigo-400/50 pl-4 text-left text-sm leading-6 text-slate-400">
                &quot;{creator.partnerProfile.bio}&quot;
              </div>
            )}

            <Button className="mt-6 w-full cursor-pointer rounded-xl border-white/15 bg-white/4 text-slate-200 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white" variant="outline" onClick={() => navigate(`/partner/${creator.partnerProfile.slug}`)}>
              View Profile
            </Button>
          </div>

          <div className="space-y-3 rounded-3xl border border-white/10 bg-[#0b0d1f]/80 p-5 shadow-[0_18px_55px_-35px_rgba(99,102,241,0.4)] ring-1 ring-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <Star className="size-5 text-amber-300" />
              High Quality Content
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <InfinityIcon className="size-5 text-indigo-300" />
              Lifetime Access
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
              <ShieldCheck className="size-5 text-emerald-300" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isBuyOpen} onOpenChange={setIsBuyOpen}>
        <DialogContent className="border-white/10 bg-[#0b0d1f] p-0 text-slate-300 shadow-[0_24px_100px_-35px_rgba(99,102,241,0.65)] sm:max-w-lg">
          <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(99,102,241,0.16),rgba(217,70,239,0.1))] p-6 pb-5">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0b0d1f]/60 text-indigo-200 shadow-lg">
                <CategoryIcon type={product.type} size="sm" />
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{product.title}</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-indigo-200">₹{product.price}</p>
              </div>
            </div>
          </div>

          <div className="px-6 pt-6">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                Complete Your Purchase
              </DialogTitle>

              <DialogDescription className="text-slate-400">
                Enter your details below to continue to payment.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div className="space-y-2">
              <Label className="text-slate-200" htmlFor="buyername">
                Full Name <span className="text-fuchsia-300">*</span>
              </Label>

              <Input className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20" id="buyername" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200" htmlFor="buyeremail">
                Email <span className="text-fuchsia-300">*</span>
              </Label>

              <Input className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20" id="buyeremail" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} type="email" placeholder="you@example.com" />
            </div>

            <div className="flex gap-3 rounded-xl border border-emerald-400/15 bg-emerald-500/[0.07] p-3 text-xs leading-5 text-emerald-100">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" />
              <span>Secure payment powered by Razorpay. Your card and UPI details are handled by Razorpay and never stored on our servers.</span>
            </div>
          </div>

          <DialogFooter className="border-t border-white/10 bg-white/2 px-6 py-4 sm:justify-end">
            <Button className="cursor-pointer border-white/15 bg-white/4 text-slate-200 hover:bg-white/10 hover:text-white" variant="outline" disabled={processing} onClick={() => setIsBuyOpen(false)}>
              Cancel
            </Button>

            <Button className="cursor-pointer bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_0_25px_-8px_rgba(139,92,246,0.7)] hover:brightness-110" disabled={processing} onClick={handlePay}>
              <ShoppingCart />
              {processing ? "Processing..." : `Pay ₹${product.price}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PublicProduct
