// =============================================================================
// VehicleCard Component — Premium Showroom Card
// =============================================================================
//
// FEATURES:
//   - Unsplash image with 4:3 aspect ratio (top 60% of card)
//   - Model name overlaid on the image with dark gradient fade
//   - Glassmorphism (frosted glass) card body
//   - Gradient glow border
//   - Hover: image zooms, card glows, "View Details" button fades in
//   - Gradient fallback with make initials when no image
//   - Staggered fade-in animation
// =============================================================================

"use client";

import Image from "next/image";
import { useState } from "react";
import type { VehicleModel } from "@/lib/types";

interface VehicleCardProps {
    vehicle: VehicleModel;
    imageUrl?: string;
    index: number;
}

/** Generate a deterministic gradient from a string (for fallback backgrounds) */
function getGradient(name: string): string {
    const gradients = [
        "from-cyan-600/40 via-blue-700/30 to-violet-800/40",
        "from-violet-600/40 via-purple-700/30 to-fuchsia-800/40",
        "from-blue-600/40 via-indigo-700/30 to-purple-800/40",
        "from-emerald-600/40 via-teal-700/30 to-cyan-800/40",
        "from-rose-600/40 via-pink-700/30 to-fuchsia-800/40",
        "from-amber-600/40 via-orange-700/30 to-red-800/40",
    ];
    const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
}

function getInitials(make: string): string {
    return make
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function VehicleCard({ vehicle, imageUrl, index }: VehicleCardProps) {
    const [imgError, setImgError] = useState(false);
    const showImage = imageUrl && !imgError;

    return (
        <div
            className="card-animate group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(6,182,212,0.12),0_0_100px_rgba(139,92,246,0.08)]"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* ── Gradient glow border ── */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/[0.12] via-cyan-500/[0.08] to-violet-500/[0.08] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

            {/* ── Card inner ── */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0a0a14]/80 backdrop-blur-xl border border-transparent">

                {/* ── Image Section (4:3 aspect) ── */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {showImage ? (
                        <Image
                            src={imageUrl}
                            alt={`${vehicle.Make_Name} ${vehicle.Model_Name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        /* Gradient fallback with make initials */
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${getGradient(vehicle.Make_Name)} flex items-center justify-center`}
                        >
                            <span className="text-5xl font-bold text-white/20 tracking-widest select-none">
                                {getInitials(vehicle.Make_Name)}
                            </span>
                            {/* Decorative lines */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a14] to-transparent" />
                        </div>
                    )}

                    {/* Dark gradient overlay at bottom of image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/40 to-transparent" />

                    {/* Model name overlaid on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
                        <h3 className="text-xl font-bold text-white tracking-tight truncate drop-shadow-lg">
                            {vehicle.Model_Name}
                        </h3>
                    </div>

                    {/* Make badge (top-left) */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {vehicle.Make_Name}
                    </div>
                </div>

                {/* ── Content Section (glassmorphism) ── */}
                <div className="relative p-5 bg-white/[0.02]">
                    {/* Top gradient accent line */}
                    <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

                    {/* Vehicle info row */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-[11px] text-zinc-600 font-mono">
                            <span>Make #{vehicle.Make_ID}</span>
                            <span>Model #{vehicle.Model_ID}</span>
                        </div>
                    </div>

                    {/* "View Details" button — fades in on hover */}
                    <div className="mt-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 text-center text-sm font-medium text-cyan-400 backdrop-blur-sm hover:from-cyan-500/30 hover:to-violet-500/30 transition-all">
                            View Details →
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
