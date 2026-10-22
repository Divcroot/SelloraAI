import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import logo from '../assets/logo.png';
import img from '../assets/image.png';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from 'react-icons/fc'
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/utils/firebase";
import api from "@/utils/axios";
import { useUserStore } from "@/store/store";
import { toast } from "sonner";
import { motion } from 'motion/react';
import { useNavigate } from "react-router-dom";
import { BookOpen, Code2, Contact, GraduationCap, LayoutTemplate, MessageSquare, type LucideIcon } from "lucide-react";

interface Categories {
    title: string,
    icon: LucideIcon
}

const categories: Categories[] = [
    { title: "Courses", icon: GraduationCap },
    { title: "Source Code", icon: Code2 },
    { title: "Templates", icon: LayoutTemplate },
    { title: "Ebooks", icon: BookOpen },
    { title: "AI Prompts", icon: MessageSquare },
]

interface Step {
    number: number,
    title: string,
    desc: string
}

const steps: Step[] = [
    {
        number: 1,
        title: "Explore Products",
        desc: "Browse thousands of high-quality digital assets across multiple categories.",
    },
    {
        number: 2,
        title: "Purchase Instantly",
        desc: "Secure checkout and immediate access to your downloaded files or links.",
    },
    {
        number: 3,
        title: "Sell & Earn",
        desc: "Join as a creator, upload your work, and start generating passive income.",
    },
]

const Home = () => {

    const [modalOpen, setModalOpen] = useState(false);

    const setUser = useUserStore((s) => s.setUser);
    const setPartner = useUserStore((s) => s.setPartner);
    const user = useUserStore((s) => s.user);
    const admin = useUserStore((s) => s.admin);

    const navigate = useNavigate();

    const googleAuth = async (): Promise<void> => {
        try {
            const result = await signInWithPopup(auth, provider);

            const token = await result.user.getIdToken();

            const { data } = await api.post('/api/auth/login', { token });

            if (!data.success) {
                setUser(null);
                return;
            }

            if (data.user.role === "partner") {
                const { data: partnerData } = await api.get('/api/auth/partner');
                setPartner(partnerData.success ? partnerData.partner : null);
            } else {
                setPartner(null);
            }

            setUser(data.user);

            toast.success("Login Successfully.")

        } catch (error) {
            toast.error("Failed to Login.")
        } finally {
            setModalOpen(false);
        }
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#05060f] text-slate-300 selection:bg-indigo-500/40">
            <Navbar setModalOpen={setModalOpen} />

            <main className="relative isolate overflow-hidden bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[56px_56px] before:absolute before:left-1/2 before:-top-40 before:-z-10 before:size-160 before:-translate-x-1/2 before:rounded-full before:bg-indigo-600/30 before:blur-[130px] after:absolute after:-right-24 after:top-40 after:-z-10 after:size-md after:rounded-full after:bg-fuchsia-600/20 after:blur-[120px]">
                <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
                    <motion.div
                        className="flex flex-col items-start"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-indigo-300 shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] backdrop-blur">
                            PREMIUM MARKETPLACE
                        </span>
                        <h1 className="mt-7 bg-linear-to-b from-white via-white to-indigo-300 bg-clip-text text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                            Discover Premium Digital Products Built by Creators
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                            Buy courses, source codes, templates, AI prompts, ebooks and digital assets from trusted creators. Elevate your projects with top-tier resources.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            {user ? (
                                <Button
                                    className="h-12 cursor-pointer rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-8 text-sm font-semibold text-white shadow-[0_0_40px_-5px_rgba(139,92,246,0.7)] ring-1 ring-white/20 transition duration-300 hover:scale-105 hover:shadow-[0_0_60px_-5px_rgba(139,92,246,0.9)]"
                                    onClick={() => navigate('/partner')}
                                >
                                    Start selling your digital products
                                </Button>
                            ) : (
                                <Button
                                    className="h-12 cursor-pointer rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-8 text-sm font-semibold text-white shadow-[0_0_40px_-5px_rgba(139,92,246,0.7)] ring-1 ring-white/20 transition duration-300 hover:scale-105 hover:shadow-[0_0_60px_-5px_rgba(139,92,246,0.9)]"
                                    onClick={() => setModalOpen(true)}
                                >
                                    Become a Partner
                                </Button>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative mx-auto w-full max-w-xl rounded-3xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <img
                            className="w-full rounded-2xl object-cover invert hue-rotate-180 brightness-90 contrast-110 shadow-[0_0_80px_-10px_rgba(99,102,241,0.55)]"
                            src={img}
                            alt="img"
                        />
                    </motion.div>
                </div>
            </main>

            <section className="mx-auto max-w-7xl px-6 py-20 md:py-24">
                <motion.div
                    className="mx-auto max-w-2xl text-center"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="bg-linear-to-b from-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">Popular Categories</h2>
                    <p className="mt-4 text-base text-slate-400">Explore our curated selection of high-quality digital assets.</p>
                </motion.div>

                <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {categories.map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                            <motion.div
                                className="group flex cursor-pointer flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/4 p-7 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-indigo-400/50 hover:bg-white/8 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)]"
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                            >
                                <Icon className="size-14 rounded-2xl bg-linear-to-br from-indigo-500/20 to-fuchsia-500/20 p-3.5 text-indigo-300 ring-1 ring-white/10 transition duration-300 group-hover:from-indigo-500 group-hover:to-fuchsia-500 group-hover:text-white group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.8)]" />
                                <span className="text-sm font-semibold text-slate-200">{cat.title}</span>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            <section className="relative border-y border-white/5 bg-[#080a1a] py-20 md:py-28">
                <div className="mx-auto max-w-7xl px-6">
                    <motion.div
                        className="mx-auto max-w-2xl text-center"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="bg-linear-to-b from-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">How It Works</h2>
                        <p className="mt-4 text-base text-slate-400">A seamless experience for both buyers and creators</p>
                    </motion.div>

                    <div className="mt-16 grid gap-8 md:grid-cols-3">
                        {steps.map((s, i) => (
                            <motion.div
                                className="relative rounded-3xl border border-white/10 bg-linear-to-b from-white/[0.07] to-white/2 p-8 backdrop-blur transition duration-300 hover:border-indigo-400/40 hover:shadow-[0_20px_60px_-20px_rgba(99,102,241,0.5)]"
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                {i !== 0 && <span className="absolute -left-8 top-12 hidden h-px w-8 bg-linear-to-r from-transparent to-indigo-400/60 md:block" />}
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-fuchsia-500 text-xl font-extrabold text-white shadow-[0_0_30px_-5px_rgba(168,85,247,0.8)]">
                                    {s.number}
                                </div>
                                <h2 className="mt-7 text-xl font-bold text-white">{s.title}</h2>
                                <div className="my-5 h-0.5 w-12 rounded-full bg-linear-to-r from-indigo-400 to-transparent" />
                                <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="relative bg-black">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-16 text-center">
                    <div className="flex items-center gap-3">
                        <img className="size-11 rounded-xl bg-white/10 p-1.5 object-contain ring-1 ring-white/15" src={logo} alt="logo" />
                        <span className="bg-linear-to-r from-white to-indigo-300 bg-clip-text text-xl font-bold tracking-tight text-transparent">SelloraAI</span>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-slate-500">The premier infrastructure for AI-driven commerce. Empowering creators globally.</p>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 [&>svg]:size-4 [&>svg]:text-indigo-400">
                        <Contact /> Email- {admin?.email}
                    </div>
                    <p className="mt-6 w-full border-t border-white/10 pt-6 text-xs text-slate-600">© {new Date().getFullYear()} SelloraAI. All rights reserved.</p>
                </div>
            </footer>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="gap-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 text-slate-900 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.35)] sm:max-w-md">
                    <DialogHeader className="items-center gap-3 pt-2 text-center">
                        <img src={logo} alt="logo" className="size-16 rounded-2xl bg-linear-to-br from-indigo-50 to-violet-100 p-2 object-contain ring-1 ring-indigo-100" />
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-950">
                            SelloraAI
                        </DialogTitle>
                    </DialogHeader>

                    <Button onClick={googleAuth} variant="outline" className="h-12 w-full gap-3 rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                        <FcGoogle className="size-5" />
                        Continue with Google
                    </Button>

                    <p className="text-center text-xs leading-relaxed text-slate-500">Secure authentication by Firebase.</p>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Home