import { UserRound } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

const ProfileCompleteNote = () => {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full overflow-hidden rounded-3xl border border-indigo-400/15 bg-[#0b0d1f]/85 text-slate-200 shadow-[0_24px_80px_-35px_rgba(99,102,241,0.5)] ring-1 ring-white/5 backdrop-blur-xl">
            <CardHeader className="flex flex-col items-center gap-3 p-6 text-center sm:p-8">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 shadow-[0_0_30px_-10px_rgba(99,102,241,0.7)]">
                    <UserRound className="size-6" />
                </div>

                <CardTitle className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    Complete Your Profile First
                </CardTitle>

                <CardDescription className="max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
                    Before creating your product, please complete your partner profile and payments details.
                </CardDescription>
            </CardHeader>
        </Card>
    </div>
  )
}

export default ProfileCompleteNote