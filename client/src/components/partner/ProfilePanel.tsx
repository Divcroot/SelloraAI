import type { Partner } from "@/store/store"
import { useState } from "react";
import { Button } from "../ui/button";
import { ExternalLink, Globe } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Badge } from "../ui/badge";

interface ProfilePanelProps {
  partner: Partner;
  onSave?: (data: Partner) => void;
  onCancel?: () => void;
  saving: boolean;
}

const BIO_MAX_LENGTH = 500;

const ProfilePanel = ({
  partner,
  onSave,
  onCancel,
  saving = false
}: ProfilePanelProps) => {

  const [form, setForm] = useState<Partner>(partner);

  const updateUser = (key: "name", value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const updateProfile = (key: "slug" | "bio" | "website", value: string) => {
    setForm((prev) => ({ ...prev, partnerProfile: { ...prev.partnerProfile, [key]: value } }));
  }

  const updateSocialLinks = (key: "youtube" | "instagram" | "linkedin" | "github", value: string) => {
    setForm((prev) => ({ ...prev, partnerProfile: { ...prev.partnerProfile, socialLinks: { ...prev.partnerProfile.socialLinks, [key]: value } } }));
  }

  const updatePayment = (key: "method" | "upiId" | "accountHolderName" | "accountNumber" | "ifscCode", value: string) => {
    setForm((prev) => ({ ...prev, paymentDetails: { ...prev.paymentDetails, [key]: key === "method" ? (value as "upi" | "bank") : value } }))
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="bg-linear-to-b from-white via-white to-indigo-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">Complete Your Partner Profile</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">Set up your profile and payment details to start selling digital products on SelloraAI.</p>
        </div>

        {partner?.partnerProfile?.slug && (
          <Button variant='outline' className="shrink-0 rounded-xl border-white/15 bg-white/4 text-slate-200 hover:bg-white/10 hover:text-white">
            <ExternalLink className="size-4" />
            View Public Profile
          </Button>
        )}
      </div>

      <Card className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.5)] ring-1 ring-white/5 backdrop-blur-xl">
        <CardContent className="flex flex-col gap-8 p-5 sm:gap-10 sm:p-8">
          <section className="space-y-5">
            <h2 className="border-b border-white/10 pb-3 text-base font-semibold tracking-wide text-white">Basic Information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Full Name{" "}
                  <span className="text-rose-400">*</span>
                </Label>

                <Input
                  className="h-11 rounded-xl border-white/10 bg-white/4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                  id="name"
                  value={form.name}
                  onChange={(e) => updateUser("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>

                <Input id="email"
                  className="h-11 rounded-xl border-white/10 bg-white/4 text-slate-400 disabled:opacity-70"
                  value={form.email}
                  type="email"
                  disabled
                />
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="border-b border-white/10 pb-3 text-base font-semibold tracking-wide text-white">Partner Profile</h2>

            <div className="space-y-2">
              <Label htmlFor="profile-slug" className="text-slate-300">
                Profile Slug{" "}
                <span className="text-rose-400">*</span>
              </Label>

              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-400/20">
                <span className="shrink-0 text-xs text-slate-500 sm:text-sm">sellora.ai/profile/</span>
                <Input
                  className="h-11 min-w-0 border-0 bg-transparent px-0 text-white shadow-none focus-visible:border-transparent focus-visible:ring-0"
                  id="profile-slug"
                  placeholder="your-profile-name"
                  value={form.partnerProfile?.slug ?? ""}
                  onChange={(e) => updateProfile("slug", e.target.value)}
                />
              </div>

              <p className="text-xs leading-5 text-slate-500">This will be used as your public partner profile URL.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="bio" className="text-slate-300">
                  Bio{" "}
                  <span className="text-rose-400">*</span>
                </Label>

                <span className="text-xs tabular-nums text-slate-500">{(form.partnerProfile.bio ?? "").length}/{BIO_MAX_LENGTH}</span>
              </div>

              <Textarea
                className="min-h-32 rounded-xl border-white/10 bg-white/4 text-white placeholder:text-slate-500 focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                id="bio"
                rows={4}
                maxLength={BIO_MAX_LENGTH}
                value={form.partnerProfile.bio ?? ""}
                onChange={(e) => updateProfile("bio", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-slate-300">
                Website
              </Label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-3 focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-400/20">
                <Globe className="size-4 shrink-0 text-slate-500" />
                <Input
                  className="h-11 border-0 bg-transparent px-0 text-white shadow-none focus-visible:border-transparent focus-visible:ring-0"
                  id="website"
                  value={form.partnerProfile.website ?? ""}
                  onChange={(e) => updateProfile("website", e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="border-b border-white/10 pb-3 text-base font-semibold tracking-wide text-white">Social Links</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="youtube" className="text-slate-300">
                  Youtube
                </Label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-3 focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-400/20">
                  <FaYoutube className="size-4 shrink-0 text-rose-400" />
                  <Input
                    className="h-11 border-0 bg-transparent px-0 text-white shadow-none focus-visible:border-transparent focus-visible:ring-0"
                    id="youtube"
                    value={form.partnerProfile.socialLinks?.youtube ?? ""}
                    onChange={(e) => updateSocialLinks("youtube", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-slate-300">
                  Instagram
                </Label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-3 focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-400/20">
                  <FaInstagram className="size-4 shrink-0 text-fuchsia-400" />
                  <Input
                    className="h-11 border-0 bg-transparent px-0 text-white shadow-none focus-visible:border-transparent focus-visible:ring-0"
                    id="instagram"
                    value={form.partnerProfile.socialLinks?.instagram ?? ""}
                    onChange={(e) => updateSocialLinks("instagram", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-slate-300">
                  Linkedin
                </Label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-3 focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-400/20">
                  <FaLinkedin className="size-4 shrink-0 text-sky-400" />
                  <Input
                    className="h-11 border-0 bg-transparent px-0 text-white shadow-none focus-visible:border-transparent focus-visible:ring-0"
                    id="linkedin"
                    value={form.partnerProfile.socialLinks?.linkedin ?? ""}
                    onChange={(e) => updateSocialLinks("linkedin", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="github" className="text-slate-300">
                  Github
                </Label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-3 focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-400/20">
                  <FaGithub className="size-4 shrink-0 text-slate-300" />
                  <Input
                    className="h-11 border-0 bg-transparent px-0 text-white shadow-none focus-visible:border-transparent focus-visible:ring-0"
                    id="github"
                    value={form.partnerProfile.socialLinks?.github ?? ""}
                    onChange={(e) => updateSocialLinks("github", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="border-b border-white/10 pb-3 text-base font-semibold tracking-wide text-white">Payment Details</h2>

            <RadioGroup className="grid gap-3 sm:grid-cols-2" value={form.paymentDetails.method} onValueChange={(value) => updatePayment("method", value)}>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3">
                <RadioGroupItem value="upi" id="upi" />
                <label className="cursor-pointer text-sm font-medium text-slate-200" htmlFor="upi">UPI</label>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3">
                <RadioGroupItem value="bank" id="bank" />
                <label className="cursor-pointer text-sm font-medium text-slate-200" htmlFor="bank">BANK</label>
              </div>
            </RadioGroup>

            {form.paymentDetails.method === "upi" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="upiId" className="text-slate-300">
                    UPI ID{" "}
                    <span className="text-rose-400">*</span>
                  </Label>

                  <Input
                    className="h-11 rounded-xl border-white/10 bg-white/4 text-white focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                    id="upiId"
                    value={form.paymentDetails.upiId ?? ""}
                    onChange={(e) => updatePayment("upiId", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolderName" className="text-slate-300">
                    Account Holder Name{" "}
                    <span className="text-rose-400">*</span>
                  </Label>

                  <Input
                    className="h-11 rounded-xl border-white/10 bg-white/4 text-white focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                    id="accountHolderName"
                    value={form.paymentDetails.accountHolderName}
                    onChange={(e) => updatePayment("accountHolderName", e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName" className="text-slate-300">
                    Account Holder Name{" "}
                    <span className="text-rose-400">*</span>
                  </Label>

                  <Input
                    className="h-11 rounded-xl border-white/10 bg-white/4 text-white focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                    id="accountHolderName"
                    value={form.paymentDetails.accountHolderName}
                    onChange={(e) => updatePayment("accountHolderName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-slate-300">
                    Account Number{" "}
                    <span className="text-rose-400">*</span>
                  </Label>

                  <Input
                    className="h-11 rounded-xl border-white/10 bg-white/4 text-white focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                    id="accountNumber"
                    value={form.paymentDetails.accountNumber}
                    onChange={(e) => updatePayment("accountNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifscCode" className="text-slate-300">
                    IFSC CODE{" "}
                    <span className="text-rose-400">*</span>
                  </Label>

                  <Input
                    className="h-11 rounded-xl border-white/10 bg-white/4 text-white focus-visible:border-indigo-400/60 focus-visible:ring-indigo-400/20"
                    id="ifscCode"
                    value={form.paymentDetails.ifscCode}
                    onChange={(e) => updatePayment("ifscCode", e.target.value)}
                  />
                </div>
              </div>
            )}
          </section>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-400">Status:</span>
              <Badge className={form.isActive
                ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : "border border-slate-400/20 bg-slate-400/10 text-slate-300"}
              >
                {form.isActive ? "ACTIVE" : "INACTIVE"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Button 
            variant="outline"
            className="rounded-xl border-white/15 bg-white/4 text-slate-200 hover:bg-white/10 hover:text-white sm:min-w-28"
            onClick={onCancel}
             disabled={saving}
             >
              Cancel
            </Button>

            <Button  
            className="rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 hover:bg-indigo-400 sm:min-w-40"
            onClick={() => onSave?.(form)}
             disabled={saving}
             >
              {saving ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePanel