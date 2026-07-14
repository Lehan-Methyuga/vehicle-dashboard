// =============================================================================
// Dashboard Page (Server Component)
// =============================================================================
//
// WHAT THIS FILE DOES:
//   This is the homepage — the first thing users see. It renders:
//   1. A hero section with the app title and description.
//   2. The ResultsGrid (which includes SearchBar inside it).
//   3. A footer with attribution.
//
// WHY IS THIS A SERVER COMPONENT (no "use client")?
//   - By default, all files in the App Router are Server Components.
//   - The page itself doesn't need useState or browser events.
//   - The interactive parts (search, results) are in Client Components
//     that we import. Next.js handles the boundary automatically.
//   - Server Components are faster: they render on the server and send
//     finished HTML to the browser, which is better for SEO and performance.
//
// THE KEY PATTERN: "Server Component Shell + Client Islands"
//   The page.tsx (server) wraps ResultsGrid (client). This is the
//   recommended Next.js pattern — keep as much as possible on the server,
//   and only "island" the parts that need interactivity to the client.
// =============================================================================

import ResultsGrid from "@/components/ResultsGrid";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Background decorations ── */}
      {/* These are fixed gradient orbs that add depth to the dark background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/[0.07] rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-fuchsia-500/[0.04] rounded-full blur-3xl" />
      </div>

      {/* ── Header / Hero ── */}
      <header className="pt-16 pb-10 px-4 text-center">
        {/* Small badge above the title */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-400 mb-6">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Powered by NHTSA vPIC API
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Vehicle{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>

        <p className="text-zinc-400 max-w-lg mx-auto text-lg leading-relaxed">
          Search the U.S. National Highway Traffic Safety Administration database
          for vehicle models by make and year.
        </p>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 pb-16 px-4">
        <ResultsGrid />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-6 px-4 text-center">
        <p className="text-xs text-zinc-600">
          Data sourced from the{" "}
          <a
            href="https://vpic.nhtsa.dot.gov/api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-cyan-400 transition-colors underline underline-offset-2"
          >
            NHTSA vPIC API
          </a>
          . This application is for educational purposes only.
        </p>
      </footer>
    </div>
  );
}
