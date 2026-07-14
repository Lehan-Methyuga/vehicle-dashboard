import ResultsGrid from "@/components/ResultsGrid";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#020204]">
      {/* ── Dynamic Moving Gradient Background ── */}
      <div className="fixed inset-0 -z-10 animate-gradient-xy bg-gradient-to-br from-[#050515] via-[#090518] to-[#020204]" />

      {/* Floating particles */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 13.7) % 100}%`,
              animationDuration: `${7 + (i * 1.3) % 8}s`,
              animationDelay: `${(i * 0.7) % 5}s`,
              bottom: "-10px",
              background: i % 2 === 0 ? "rgba(6, 182, 212, 0.5)" : "rgba(139, 92, 246, 0.4)",
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              boxShadow: `0 0 ${4 + (i % 5)}px rgba(6, 182, 212, 0.8)`,
            }}
          />
        ))}
      </div>

      {/* ── Hero Section ── */}
      <header className="relative pt-28 pb-20 px-4 text-center z-10">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        <div className="relative inline-flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 text-[11px] font-semibold tracking-widest uppercase text-cyan-400 mb-8 backdrop-blur-sm">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          NHTSA vPIC Global Data
        </div>

        <h1 className="relative text-6xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-white mb-6 text-glow leading-[1.1]">
          Discover Your <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Next Drive
          </span>
        </h1>

        <p className="relative text-zinc-400 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed mb-6 font-light">
          Experience every vehicle ever registered. Unleash the world's most comprehensive automotive database.
        </p>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 pb-24 px-4 relative z-20">
        <ResultsGrid />
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-4 text-center bg-[#020204]/80 backdrop-blur-xl">
        <p className="text-xs text-zinc-600 font-medium tracking-wide">
          DATA SOURCED FROM NHTSA VPIC API · IMAGES BY UNSPLASH
        </p>
      </footer>
    </div>
  );
}
