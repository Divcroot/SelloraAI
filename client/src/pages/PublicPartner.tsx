import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight, Link2, Store, UserRoundX } from "lucide-react";
import { usePublicStore } from "@/store/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { CategoryThumbnail, PRODUCT_META_TYPES } from "@/components/product/ProductMetaType";
import { Badge } from "@/components/ui/badge";

const PublicPartner = () => {

    const { slug } = useParams<{ slug: string }>();

    const navigate = useNavigate();

    const allPublicPartners = usePublicStore((s) => s.allPublicPartners);
    const allPublicProducts = usePublicStore((s) => s.allPublicProducts);
    const loading = usePublicStore((s) => s.loading);

    const partner = allPublicPartners.find((p) =>
        p.partnerProfile.slug === slug && p.isActive === true
    );

    const products = partner ? allPublicProducts.filter((p) => p.partnerId === partner._id) : [];

    if (loading) {
        return (
            <main className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#05060f] px-4 py-12 text-slate-300">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[56px_56px] before:absolute before:left-1/2 before:top-1/2 before:size-160 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-indigo-600/25 before:blur-[130px] after:absolute after:-right-24 after:top-1/4 after:size-md after:rounded-full after:bg-fuchsia-600/15 after:blur-[120px]" />
                <section className="flex flex-col items-center gap-5 text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_35px_-8px_rgba(99,102,241,0.6)] backdrop-blur">
                        <div className="size-7 animate-spin rounded-full border-2 border-indigo-300/30 border-t-fuchsia-400" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-white">Finding this creator</p>
                        <p className="mt-1 text-sm text-slate-400">Loading their public profile...</p>
                    </div>
                </section>
            </main>
        )
    }

    if (!partner) {
        return (
            <main className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#05060f] px-4 py-12 text-slate-300">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[56px_56px] before:absolute before:left-1/2 before:top-1/2 before:size-160 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-indigo-600/25 before:blur-[130px] after:absolute after:-right-24 after:top-1/4 after:size-md after:rounded-full after:bg-fuchsia-600/15 after:blur-[120px]" />

                <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/85 p-7 text-center shadow-[0_24px_100px_-35px_rgba(99,102,241,0.55)] ring-1 ring-white/5 backdrop-blur-xl sm:p-10">
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none bg-linear-to-b from-white/5 to-transparent bg-clip-text text-[11rem] font-black leading-none tracking-tighter text-transparent sm:text-[14rem]">
                        404
                    </div>

                    <div className="relative mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-200 shadow-[0_0_35px_-10px_rgba(99,102,241,0.75)]">
                        <UserRoundX className="size-7" />
                    </div>

                    <p className="relative mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
                        Creator unavailable
                    </p>
                    <h1 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        This profile isn’t available.
                    </h1>
                    <p className="relative mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                        The creator may have changed their profile link, or their page is no longer public.
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

            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
                <div className="flex flex-col items-center overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 p-6 text-center shadow-[0_24px_80px_-35px_rgba(99,102,241,0.5)] ring-1 ring-white/5 backdrop-blur-xl sm:p-9">
                    <Avatar className="mb-5 size-20 ring-2 ring-indigo-400/40 shadow-[0_0_35px_-10px_rgba(99,102,241,0.7)] sm:size-24">
                        <AvatarFallback className="bg-linear-to-br from-indigo-500 to-fuchsia-500 text-2xl font-bold text-white sm:text-3xl">
                            {partner?.name.split(" ").map((part) => part[0]).join("").toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <h1 className="bg-linear-to-b from-white via-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                        {partner.name}
                    </h1>

                    {partner.partnerProfile.bio && (
                        <p className="mx-auto mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-400 sm:text-base">
                            {partner.partnerProfile.bio}
                        </p>
                    )}

                    {partner.partnerProfile.website && (
                        <a className="mx-auto mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/[0.07] px-4 py-2 text-sm font-medium text-indigo-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-white" target="_blank" rel="noopener noreferrer" href={partner.partnerProfile.website.startsWith("http://") || partner.partnerProfile.website.startsWith("https://") ? partner.partnerProfile.website : `https://${partner.partnerProfile.website}`}>
                            <Link2 className="size-4 shrink-0" />
                            {partner.partnerProfile.website}
                        </a>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                        {partner.partnerProfile.socialLinks?.youtube && (
                            <a className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300" target="_blank" rel="noopener noreferrer" href={partner.partnerProfile.socialLinks.youtube.startsWith("http://") || partner.partnerProfile.socialLinks.youtube.startsWith("https://") ? partner.partnerProfile.socialLinks.youtube : `https://${partner.partnerProfile.socialLinks.youtube}`}>
                                <FaYoutube className="size-4" />
                            </a>
                        )}

                        {partner.partnerProfile.socialLinks?.instagram && (
                            <a className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-slate-400 transition hover:border-fuchsia-400/30 hover:bg-fuchsia-500/10 hover:text-fuchsia-300" target="_blank" rel="noopener noreferrer" href={partner.partnerProfile.socialLinks.instagram.startsWith("http://") || partner.partnerProfile.socialLinks.instagram.startsWith("https://") ? partner.partnerProfile.socialLinks.instagram : `https://${partner.partnerProfile.socialLinks.instagram}`}>
                                <FaInstagram className="size-4" />
                            </a>
                        )}

                        {partner.partnerProfile.socialLinks?.linkedin && (
                            <a className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-slate-400 transition hover:border-sky-400/30 hover:bg-sky-500/10 hover:text-sky-300" target="_blank" rel="noopener noreferrer" href={partner.partnerProfile.socialLinks.linkedin.startsWith("http://") || partner.partnerProfile.socialLinks.linkedin.startsWith("https://") ? partner.partnerProfile.socialLinks.linkedin : `https://${partner.partnerProfile.socialLinks.linkedin}`}>
                                <FaLinkedin className="size-4" />
                            </a>
                        )}

                        {partner.partnerProfile.socialLinks?.github && (
                            <a className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-slate-400 transition hover:border-white/25 hover:bg-white/10 hover:text-white" target="_blank" rel="noopener noreferrer" href={partner.partnerProfile.socialLinks.github.startsWith("http://") || partner.partnerProfile.socialLinks.github.startsWith("https://") ? partner.partnerProfile.socialLinks.github : `https://${partner.partnerProfile.socialLinks.github}`}>
                                <FaGithub className="size-4" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Products by {partner.name}
                    </h2>

                    {products.length === 0 ? (
                        <p className="mt-5 rounded-2xl border border-white/10 bg-[#0b0d1f]/70 px-5 py-10 text-center text-sm text-slate-400">
                            This creator has not listed any products yet.
                        </p>
                    ) : (
                        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {products.map((p) => {
                                const metaType = PRODUCT_META_TYPES[p.type];
                                return (
                                    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d1f]/80 shadow-[0_18px_55px_-30px_rgba(99,102,241,0.45)] ring-1 ring-white/5 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:shadow-[0_24px_65px_-30px_rgba(99,102,241,0.6)]" key={p._id}>
                                        <div className="h-44 overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,rgba(99,102,241,0.12),rgba(217,70,239,0.08))]">
                                            <CategoryThumbnail
                                                type={p.type}
                                                fill
                                            />
                                        </div>

                                        <div className="flex h-[calc(100%-11rem)] flex-col p-5">
                                            <Badge className={`mb-3 w-fit border border-white/10 ${metaType.classname} text-slate-200`}>
                                                {metaType.label ?? p.type}
                                            </Badge>

                                            <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-white">
                                                {p.title}
                                            </h3>

                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                                                {p.description}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                                                <p className="text-lg font-bold tabular-nums text-white">₹{p.price}</p>
                                                <Button className="cursor-pointer rounded-lg border-white/15 bg-white/4 text-slate-200 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white" onClick={() => window.open(`/product/${p.slug}`, "_blank", "noopener noreferrer")} variant="outline" size="sm">
                                                    View Product
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PublicPartner