import { ArrowLeft, ArrowUpRight, House, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#05060f] px-4 py-12 text-slate-300">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[56px_56px] before:absolute before:left-1/2 before:top-1/2 before:size-160 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-indigo-600/25 before:blur-[130px] after:absolute after:-right-24 after:top-1/4 after:size-md after:rounded-full after:bg-fuchsia-600/15 after:blur-[120px]" />

      <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d1f]/80 p-7 text-center shadow-[0_24px_100px_-35px_rgba(99,102,241,0.55)] ring-1 ring-white/5 backdrop-blur-xl sm:p-12">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none bg-linear-to-b from-white/6 to-transparent bg-clip-text text-[12rem] font-black leading-none tracking-tighter text-transparent sm:text-[17rem]">
          404
        </div>

        <div className="relative z-10 mx-auto mb-7 flex size-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-200 shadow-[0_0_35px_-10px_rgba(99,102,241,0.75)]">
          <SearchX className="size-7" />
        </div>

        <p className="relative z-10 mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
          Page not found
        </p>
        <h1 className="relative z-10 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Looks like you took a wrong turn.
        </h1>
        <p className="relative z-10 mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
          The page you’re looking for may have moved, been removed, or never existed.
          Let’s get you back to the marketplace.
        </p>

        <div className="relative z-10 mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            className="h-11 cursor-pointer rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 font-semibold text-white shadow-[0_0_30px_-8px_rgba(139,92,246,0.7)] ring-1 ring-white/15 transition hover:scale-[1.02] hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.85)]"
            render={<Link to="/" />}
          >
            <House className="size-4" />
            Back to home
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
  );
};

export default NotFound;
