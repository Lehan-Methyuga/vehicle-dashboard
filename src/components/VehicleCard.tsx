// =============================================================================
// VehicleCard Component (Presentational / Server-Compatible)
// =============================================================================
//
// WHAT THIS FILE DOES:
//   Renders a single card displaying a vehicle model (e.g. "Toyota Camry").
//   This is a "dumb" presentational component — it receives data via props
//   and just renders it. No state, no side effects, no API calls.
//
// WHY NO "use client"?
//   This component doesn't use any browser-only features (no useState,
//   no onClick, no useEffect). It CAN run on the server, which is faster.
//   However, since it's imported by ResultsGrid (a Client Component),
//   it will actually run on the client too — and that's fine. The point is
//   we don't FORCE it to be client-only.
//
// WHY A SEPARATE COMPONENT?
//   If we later want to add features to each card (click to expand, add to
//   favorites, etc.), we modify this one file. The grid doesn't need to change.
// =============================================================================

import type { VehicleModel } from "@/lib/types";

interface VehicleCardProps {
    vehicle: VehicleModel;
    /** Index used for staggered animation delay */
    index: number;
}

export default function VehicleCard({ vehicle, index }: VehicleCardProps) {
    return (
        <div
            className="group relative rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] p-5 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.12] hover:shadow-lg hover:shadow-cyan-500/5 hover:scale-[1.02]"
            style={{
                // Each card fades in with a slight delay based on its position.
                // Card 0 appears instantly, card 1 after 50ms, card 2 after 100ms, etc.
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
            }}
        >
            {/* Subtle gradient line at the top of the card */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Model Name — the big, prominent text */}
            <h3 className="text-lg font-semibold text-white tracking-tight mb-1 truncate">
                {vehicle.Model_Name}
            </h3>

            {/* Make Name — smaller, secondary */}
            <p className="text-sm text-zinc-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
                {vehicle.Make_Name}
            </p>

            {/* IDs — very subtle, for reference */}
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex gap-4 text-[11px] text-zinc-600 font-mono">
                <span>Make ID: {vehicle.Make_ID}</span>
                <span>Model ID: {vehicle.Model_ID}</span>
            </div>
        </div>
    );
}
