"use client";

import Image from "next/image";
import { useState } from "react";
import type { VehicleModel } from "@/lib/types";

interface VehicleCardProps {
    vehicle: VehicleModel;
    imageUrl?: string;
    index: number;
}

function getGradient(name: string): string {
    const gradients = [
        "from-indigo-600/40 via-blue-800/30 to-slate-900/40",
        "from-cyan-600/40 via-blue-800/30 to-slate-900/40",
        "from-violet-600/40 via-purple-800/30 to-slate-900/40",
        "from-fuchsia-600/40 via-purple-800/30 to-slate-900/40",
        "from-slate-600/40 via-slate-800/30 to-black/40",
    ];
    const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
}

function getInitials(name: string): string {
    const parts = name.split(" ").filter(w => w.match(/[a-zA-Z0-9]/));
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export default function VehicleCard({ vehicle, imageUrl, index }: VehicleCardProps) {
    const [imgError, setImgError] = useState(false);
    const showImage = imageUrl && !imgError;

    return (
        <div
            className="card-animate group relative rounded-[1.5rem] overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)]"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Glowing gradient border */}
            <div className="absolute inset-0 rounded-[1.5rem] p-[1px] bg-gradient-to-b from-white/20 via-cyan-500/20 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" style={{ WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />

            {/* Card inner */}
            <div className="relative h-full w-full rounded-[1.5rem] overflow-hidden bg-white/[0.03] backdrop-blur-2xl flex flex-col">

                {/* ── Image Section (60% height) ── */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                    {showImage ? (
                        <Image
                            src={imageUrl}
                            alt={`${vehicle.Make_Name} ${vehicle.Model_Name}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-110"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        /* Fallback using MODEL initials */
                        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(vehicle.Model_Name)} flex items-center justify-center`}>
                            <span className="text-[4rem] font-bold text-white/10 tracking-widest select-none">
                                {getInitials(vehicle.Model_Name)}
                            </span>
                        </div>
                    )}

                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020204]/90 via-[#020204]/30 to-transparent" />

                    {/* MAKE BADGE (Top Right) */}
                    <div className="absolute top-4 right-4 inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                        {vehicle.Make_Name}
                    </div>

                    {/* OVERLAY: MODEL NAME at the bottom of the image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight">
                            {vehicle.Model_Name}
                        </h3>
                    </div>
                </div>

                {/* ── Content Section ── */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#020204]/50 to-[#020204]/80">
                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">
                        <span>Model ID {vehicle.Model_ID}</span>
                    </div>

                    {/* View Details Button (fades in slightly on hover, glowing) */}
                    <button className="w-full relative overflow-hidden rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-cyan-500 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                        <span className="relative z-10">View Details</span>
                        {/* Shimmer effect inside button on hover */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
