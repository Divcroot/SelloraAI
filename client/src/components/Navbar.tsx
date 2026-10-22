import { useState } from 'react';
import logo from '../assets/logo.png';
import { X, Menu, LogOut } from 'lucide-react'
import { Button } from './ui/button';
import { useUserStore } from '@/store/store';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
    setModalOpen: (isOpen: boolean) => void;
}

const Navbar = ({ setModalOpen }: NavbarProps) => {

    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const user = useUserStore((s) => s.user);
    const logout = useUserStore((s) => s.logout);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    return (
        <>
        {openMenu && (
            <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpenMenu(false)}
                className="fixed inset-0 z-40 cursor-default bg-black/40 md:hidden"
            />
        )}
        <header className="sticky top-0 z-50 bg-transparent px-4 pt-4">
            <div className="mx-auto flex h-18 max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#0b0d1f]/60 px-4 shadow-[0_0_50px_-15px_rgba(99,102,241,0.45)] ring-1 ring-white/5 backdrop-blur-2xl sm:px-6">
                <div className="flex items-center gap-3">
                    <img src={logo} alt='logo' className="size-11 rounded-full bg-white/10 p-1.5 object-contain ring-1 ring-white/15" />
                    <span className="text-[1.2rem] font-extrabold tracking-[-0.045em] text-white">Sellora<span className="bg-linear-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span></span>
                </div>

                <div className="hidden md:block">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-10 ring-2 ring-indigo-400/40">
                                    <AvatarFallback className="bg-linear-to-br from-indigo-500 to-fuchsia-500 font-semibold text-white">
                                        {user?.name.split(" ").map((part) => part[0]).join("").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-slate-200">{user?.name}</span>
                            </div>
                            <Button onClick={handleLogout} variant='outline' className="cursor-pointer rounded-full border-white/15 bg-white/5 px-5 text-slate-200 transition duration-300 hover:border-indigo-400/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_30px_-8px_rgba(99,102,241,0.7)]">
                                <LogOut className="size-4" />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={() => setModalOpen(true)} className="h-10 cursor-pointer rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-7 font-semibold text-white shadow-[0_0_30px_-5px_rgba(139,92,246,0.7)] ring-1 ring-white/20 transition duration-300 hover:scale-105 hover:shadow-[0_0_45px_-5px_rgba(139,92,246,0.9)]">
                            Sign In
                        </Button>
                    )}
                </div>

                <button onClick={() => setOpenMenu(prev => !prev)} className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-indigo-400/50 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:hidden">
                    {openMenu ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {
                openMenu && (
                    <div className="absolute inset-x-4 top-full mx-auto mt-2 max-w-6xl rounded-3xl border border-white/10 bg-[#0b0d1f]/90 p-3 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)] backdrop-blur-2xl md:hidden">
                        {user ? (
                            <>
                                <div className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                                    <Avatar className="size-10 ring-2 ring-indigo-400/40">
                                        <AvatarFallback className="bg-linear-to-br from-indigo-500 to-fuchsia-500 font-semibold text-white">
                                            {user?.name.split(" ").map((part) => part[0]).join("").toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-slate-200">{user?.name}</span>
                                </div>
                                <Button onClick={handleLogout} variant='outline' className="h-11 w-full cursor-pointer rounded-full border-white/15 bg-white/5 text-slate-200 hover:border-indigo-400/50 hover:bg-white/10 hover:text-white">
                                    <LogOut className="size-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setModalOpen(true)} className="h-11 w-full cursor-pointer rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 font-semibold text-white shadow-[0_0_30px_-5px_rgba(139,92,246,0.7)] ring-1 ring-white/20">
                                Sign In
                            </Button>
                        )}

                    </div>
                )
            }
        </header >
        </>
    )
}

export default Navbar