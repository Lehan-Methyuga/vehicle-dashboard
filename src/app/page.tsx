// =============================================================================
// Dashboard Page — Premium Car Showroom
// =============================================================================
//
// WHAT THIS FILE DOES:
//   Renders the homepage with:
//   1. Animated floating particle background
//   2. Premium hero section: "Discover Your Next Drive"
//   3. The ResultsGrid (search + cards)
//   4. Footer with attributions
// =============================================================================

import ResultsGrid from "@/components/ResultsGrid";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* ── Animated Background ── */}
      {/* Gradient orbs that shift and pulse for a living feel */}
      <div className="fixed inset-0 -z-10">
        {/* Primary dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a1a] to-[#050508]" />

        {/* Animated gradient orbs */}
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-blue-600/[0.07] rounded-full blur-[150px] glow-pulse" />
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-violet-600/[0.06] rounded-full blur-[130px] glow-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-[120px] glow-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[50%] right-[35%] w-[350px] h-[350px] bg-fuchsia-500/[0.04] rounded-full blur-[100px] glow-pulse" style={{ animationDelay: "3s" }} />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${5 + (i * 4.7) % 90}%`,
              animationDuration: `${8 + (i * 1.3) % 12}s`,
              animationDelay: `${(i * 0.7) % 8}s`,
              bottom: "-10px",
              background: i % 3 === 0
                ? "rgba(6, 182, 212, 0.4)"
                : i % 3 === 1
                  ? "rgba(139, 92, 246, 0.3)"
                  : "rgba(236, 72, 153, 0.3)",
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
            }}
          />
        ))}
      </div>

      {/* ── Hero Section ── */}
      <header className="relative pt-24 pb-16 px-4 text-center">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* API badge */}
        <div className="relative inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/[0.08] px-4 py-1.5 text-xs font-medium text-cyan-400/80 mb-10 backdrop-blur-sm">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Powered by NHTSA vPIC API
        </div>

        {/* Main headline */}
        <h1 className="relative text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-white mb-6 text-glow">
          Discover Your{" "}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
            Next Drive
          </span>
        </h1>

        {/* Subtitle */}
        <p className="relative text-zinc-500 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed mb-12">
          Explore every vehicle ever registered in the NHTSA database,{" "}
          <span className="text-zinc-400">brought to life with stunning imagery.</span>
        </p>

        {/* Decorative separator */}
        <div className="relative mx-auto max-w-lg h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 pb-20 px-4 relative z-10">
        <ResultsGrid />
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-4 text-center">
        <p className="text-xs text-zinc-700">
          Data from{" "}
          <a
            href="https://vpic.nhtsa.dot.gov/api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-cyan-400 transition-colors"
          >
            NHTSA vPIC API
          </a>
          {" · "}Images by{" "}
          <a
            href="https://unsplash.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-cyan-400 transition-colors"
          >
            Unsplash
          </a>
          {" · "}For educational purposes only.
        </p>
      </footer>
    </div>
  );
}
