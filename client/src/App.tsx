import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { useGetCurrentUser } from "./hooks/useGetCurrentUser"
import { useUserStore } from "./store/store";
import Admin from "./pages/Admin";
import { Toaster } from "./components/ui/sonner";
import Partner from "./pages/Partner";
import { useGetAllPublicData } from "./hooks/useGetAllPublicData";
import PublicPartner from "./pages/PublicPartner";
import PublicProduct from "./pages/PublicProduct";
import NotFound from "./pages/NotFound";

const App = () => {
  useGetCurrentUser();
  useGetAllPublicData();

  const user = useUserStore((s) => s.user);
  const loading = useUserStore((s) => s.loading);

  if (loading) {
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

  return (
    <>
      <Toaster />
      <Routes>
        <Route 
        path="/" 
        element={
          user?.role === "admin"
           ? <Navigate to='/admin' replace/>
            : <Home />
            } 
            />

        <Route 
        path="/admin" 
        element={
          user?.role === "admin" 
          ? <Admin /> 
          : <Navigate to='/' replace/>
          } 
          />

        <Route 
        path="/partner" 
        element={
          user?.role === "partner" 
          ? <Partner /> 
          : user?.role === "admin"
           ? <Navigate to='/admin' replace/>
            : <Navigate to='/' replace/>
            } 
            />

        <Route path="/partner/:slug" element={<PublicPartner />} />

        <Route path="/product/:slug" element={<PublicProduct />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App