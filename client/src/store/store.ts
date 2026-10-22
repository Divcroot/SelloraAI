import api from '@/utils/axios';
import { toast } from 'sonner';
import { create } from 'zustand'

interface User {
    userId: string;
    name: string;
    email: string;
    role: string;
}

interface Admin {
    name: string;
    email: string;
    role: string;
}

export interface Partner {
    _id: string;
    firebaseUid: string;
    name: string;
    email: string;
    role: "partner";
    partnerProfile: {
        slug?: string;
        bio?: string;
        website?: string;
        socialLinks?: {
            youtube?: string;
            linkedin?: string;
            instagram?: string;
            github?: string;
        };
    };
    paymentDetails: {
        method: "upi" | "bank";
        upiId?: string;
        accountHolderName?: string;
        accountNumber?: string;
        ifscCode?: string;
    };
    totalSales: number;
    totalRevenue: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UserState {
    user: User | null;
    admin: Admin | null;
    partner: Partner | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setAdmin: (admin: Admin | null) => void;
    setPartner: (partner: Partner | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set) => ({
    user: null,
    admin: null,
    partner: null,
    loading: true,
    setUser: (user) => set({ user }),
    setAdmin: (admin) => set({ admin }),
    setPartner: (partner) => set({ partner }),
    setLoading: (loading) => set({ loading }),
    logout: async () => {
        try {
            await api.post('/api/auth/logout');
            toast.success("Logout Successfully.");
            set({ user: null });
        } catch (error) {
            toast.error("Failed to Logout.")
        }
    },
}))