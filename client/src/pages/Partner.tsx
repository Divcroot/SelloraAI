import DashboardPanel from "@/components/partner/DashboardPanel";
import DeactivateNotice from "@/components/partner/DeactivateNotice";
import PartnerNav, { type PartnerTab } from "@/components/partner/PartnerNav"
import ProductPanel from "@/components/partner/ProductPanel";
import ProfilePanel from "@/components/partner/ProfilePanel";
import { useUserStore, type Partner as PartnerData } from "@/store/store";
import api from "@/utils/axios";
import { useState } from "react"
import { toast } from "sonner";

const Partner = () => {

  const [activeTab, setActiveTab] = useState<PartnerTab>('dashboard');
  const [saving, setSaving] = useState<boolean>(false);

  const partner = useUserStore((s) => s.partner);
  const setPartner = useUserStore((s) => s.setPartner);

  const handleUpdatePartner = async (data: PartnerData) => {
    setSaving(true);
    try {
      const response = await api.patch('/api/auth/partner', {
        name: data.name,
        profileDetails: {
          slug: data.partnerProfile.slug ?? "",
          bio: data.partnerProfile.bio ?? "",
          website: data.partnerProfile.website ?? "",
          socialLinks: {
            youtube: data.partnerProfile.socialLinks?.youtube ?? "",
            linkedin: data.partnerProfile.socialLinks?.linkedin ?? "",
            instagram: data.partnerProfile.socialLinks?.instagram ?? "",
            github: data.partnerProfile.socialLinks?.github ?? "",
          }
        },
        paymentDetails: {
          method: data.paymentDetails.method ?? "upi",
          upiId: data.paymentDetails.upiId ?? "",
          accountHolderName: data.paymentDetails.accountHolderName ?? "",
          accountNumber: data.paymentDetails.accountNumber ?? "",
          ifscCode: data.paymentDetails.ifscCode ?? "",
        }
      });

      if (response.data.success) {
        setPartner(response.data.partner);
        setActiveTab("dashboard");
      }

      toast.success("Profile Updated.")
    } catch (error: any) {
      console.error("Update Partner Error: ", error)

      if (error?.response?.status === 409 && error?.response?.data?.field === "slug") {
        toast.error("This profile slug is already taken");
        return;
      }

      toast.error("Failed to update partner profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!partner) {
    return (
      <div className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#05060f] text-slate-300">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[56px_56px] before:absolute before:left-1/2 before:top-1/2 before:size-160 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-indigo-600/30 before:blur-[130px] after:absolute after:-right-24 after:top-1/4 after:size-md after:rounded-full after:bg-fuchsia-600/20 after:blur-[120px]" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_35px_-8px_rgba(99,102,241,0.6)] backdrop-blur">
              <div className="size-7 animate-spin rounded-full border-2 border-indigo-300/30 border-t-fuchsia-400" />
            </div>
            <span className="text-2xl font-extrabold tracking-[-0.045em] text-white">
              Sellora<span className="bg-linear-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>
          <p className="text-sm font-medium tracking-wide text-slate-400">Loading your marketplace</p>
        </div>
      </div>
    )
  }

  if (partner.isActive === false) <DeactivateNotice />

  return (
    <div className="relative isolate min-h-screen w-full overflow-x-hidden bg-[#05060f] text-slate-300 selection:bg-indigo-500/40 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] before:bg-size-[56px_56px] before:content-[''] after:pointer-events-none after:absolute after:-right-24 after:top-40 after:-z-10 after:size-md after:rounded-full after:bg-fuchsia-600/20 after:blur-[120px] after:content-['']">
      <PartnerNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'dashboard' ? (
        <DashboardPanel />
      ) : activeTab === 'profile' ? (
        <ProfilePanel
          partner={partner}
          onSave={handleUpdatePartner}
          onCancel={() => setActiveTab('dashboard')}
          saving={saving}
        />
      ) : (
        <ProductPanel />
      )}
    </div>
  )
}

export default Partner