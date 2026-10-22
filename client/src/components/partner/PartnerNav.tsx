import { LayoutDashboard, Package, UserRound, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import { Button } from "../ui/button";

export type PartnerTab = 'dashboard' | 'profile' | 'product'

interface PartnerNavProps {
    activeTab: PartnerTab;
    onTabChange: (tab: PartnerTab) => void;
}

const Tabs: {
    key: PartnerTab;
    label: string;
    icon: LucideIcon;
}[] = [
        {
            key: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            key: "profile",
            label: "Profile",
            icon: UserRound,
        },
        {
            key: "product",
            label: "Product",
            icon: Package,
        },
        // ...rest of your tabs
    ];

const PartnerNav = ({ activeTab, onTabChange }: PartnerNavProps) => {

    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 bg-transparent px-4 pt-4 sm:px-6">
            <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3 rounded-3xl border border-white/10 bg-[#0b0d1f]/75 px-4 py-3 shadow-[0_0_50px_-15px_rgba(99,102,241,0.45)] ring-1 ring-white/5 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-6">
                <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div onClick={() => navigate('/')} className="flex cursor-pointer items-center gap-3">
                        <img src={logo} alt="logo" className="size-11 rounded-full bg-white/10 p-1.5 object-contain ring-1 ring-white/15" />
                        <span className="text-[1.2rem] font-extrabold tracking-[-0.045em] text-white">
                            Sellora<span className="bg-linear-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
                        </span>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-1 sm:w-auto sm:gap-2">
                        {Tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <Button
                                    onClick={() => onTabChange(tab.key)}
                                    key={tab.key}
                                    size="sm"
                                    variant="ghost"
                                    className={activeTab === tab.key
                                        ? "shrink-0 cursor-pointer rounded-full bg-indigo-500/20 text-indigo-100 ring-1 ring-indigo-400/40 hover:bg-indigo-500/30 hover:text-white"
                                        : "shrink-0 cursor-pointer rounded-full text-slate-300 hover:bg-white/10 hover:text-white"}
                                >
                                    <Icon className="size-4" />
                                    {tab.label}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default PartnerNav