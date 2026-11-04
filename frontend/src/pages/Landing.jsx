import { Link } from "react-router-dom";
import { 
  Users, 
  ShieldCheck, 
  Zap, 
  Search, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  ChevronRight 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-neutral-950">
      
      {/* Navbar */}
      <header className="border-b border-neutral-900/80 backdrop-blur-md sticky top-0 z-40 bg-neutral-950/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Users size={18} />
            </div>
            <span className="font-semibold text-lg tracking-tight text-neutral-100">
              Nexus<span className="text-emerald-400">Contacts</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/auth?mode=login"
              className="text-xs sm:text-sm font-medium text-neutral-300 hover:text-neutral-100 transition"
            >
              Sign In
            </Link>
            <Link
              to="/auth?mode=register"
              className="text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Fast, secure, isolated contact storage
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-100 leading-[1.15]">
            Manage your professional connections with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              zero friction.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A developer-crafted contact manager built on Node.js and MongoDB. Fast JWT-backed access, 
            instant full-text search, and clean grouping for your most critical network.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth?mode=register"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              Create Free Account
              <ChevronRight size={16} />
            </Link>
            <Link
              to="/auth?mode=login"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-medium text-sm transition flex items-center justify-center"
            >
              Live Demo Access
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> End-to-end token validation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> Sub-50ms query indexing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" /> User-scoped databases
            </span>
          </div>
        </div>

        {/* Dashboard Preview Graphic */}
        <div className="mt-16 max-w-5xl mx-auto relative">
          <div className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-neutral-500 font-mono ml-2">/dashboard/contacts</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Lock size={12} className="text-emerald-400" /> Bearer Encrypted
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Aarav Sharma", email: "aarav.sharma@example.com", phone: "+91 98765 43210", tag: "Work", fav: true },
                { name: "Priya Nair", email: "priya.tech@domain.in", phone: "+91 98234 11223", tag: "Personal", fav: true },
                { name: "Devon Vance", email: "devon.v@cloudcore.io", phone: "+1 415 890 2210", tag: "Work", fav: false },
              ].map((card, i) => (
                <div key={i} className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/90 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-bold text-emerald-400">
                        {card.name[0]}
                      </div>
                      <Star size={14} className={card.fav ? "text-amber-400 fill-amber-400" : "text-neutral-700"} />
                    </div>
                    <div className="text-sm font-medium text-neutral-200">{card.name}</div>
                    <div className="text-xs text-neutral-500 font-mono mt-0.5">{card.email}</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-neutral-900 text-[11px] text-neutral-400">
                    <span>{card.phone}</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                      {card.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-t border-neutral-900 bg-neutral-950 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100">
              Architected for speed and clean data segregation
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Every design choice reflects clean RESTful principles and enterprise-grade authorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-semibold text-neutral-200 mb-2">Strict User Isolation</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Every CRUD query checks against decoded JWT token IDs (`req.user.id`). Nobody reads or modifies your records.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                <Search size={20} />
              </div>
              <h3 className="font-semibold text-neutral-200 mb-2">Instant Regex Filtering</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Debounced frontend search matches across names, email IDs, and phone digits on the fly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <h3 className="font-semibold text-neutral-200 mb-2">Zero Latency UI</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Lightweight state updates, smooth transitions, and persistent storage of session tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-900 py-8 px-6 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Nexus Contacts. Full Stack Application.</p>
          <div className="flex gap-4">
            <span className="text-neutral-400 font-mono">React 18 + Express 5 + MongoDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}