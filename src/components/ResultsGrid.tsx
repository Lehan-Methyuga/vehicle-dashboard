// =============================================================================
// ResultsGrid Component (Client Component)
// =============================================================================
//
// WHAT THIS FILE DOES:
//   This is the "brain" of the dashboard. It:
//   1. Receives a search trigger (make + year) from the parent.
//   2. Calls our server-side API route (/api/vehicles).
//   3. Manages three states: loading, error, success.
//   4. Renders a grid of VehicleCard components when results arrive.
//
// WHY "use client"?
//   This component uses useState, useEffect, and fetch — all browser-only.
//   It needs to react to user interactions (new searches) and update the UI
//   without a full page reload.
//
// WHY FETCH OUR OWN /api/vehicles INSTEAD OF NHTSA DIRECTLY?
//   Security! The browser should never know about external API URLs.
//   Our API route (route.ts) acts as a middleman:
//   Browser → /api/vehicles → NHTSA → /api/vehicles → Browser
// =============================================================================

"use client";

import { useState, useCallback } from "react";
import SearchBar from "./SearchBar";
import VehicleCard from "./VehicleCard";
import type { VehicleModel } from "@/lib/types";

/** The shape of a successful response from our /api/vehicles route */
interface ApiSuccess {
    count: number;
    results: VehicleModel[];
    searchCriteria: string | null;
}

/** The shape of an error response from our /api/vehicles route */
interface ApiError {
    error: string;
}

export default function ResultsGrid() {
    // ─── State ───
    const [results, setResults] = useState<VehicleModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchInfo, setSearchInfo] = useState<{ make: string; year?: number } | null>(null);

    // ─── Search handler ───
    // useCallback prevents re-creating this function on every render,
    // which would cause SearchBar to re-render unnecessarily.
    const handleSearch = useCallback(async (make: string, year?: number) => {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        setSearchInfo({ make, year });

        try {
            // Build the URL to our OWN API route (not NHTSA directly!)
            const params = new URLSearchParams({ make });
            if (year) params.set("year", year.toString());

            const response = await fetch(`/api/vehicles?${params.toString()}`);
            const data: ApiSuccess | ApiError = await response.json();

            if (!response.ok) {
                // Our API route returned an error (400 or 500)
                throw new Error((data as ApiError).error || "Something went wrong");
            }

            setResults((data as ApiSuccess).results || []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred. Please try again."
            );
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* ── Search Bar ── */}
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {/* ── Results Area ── */}
            <div className="mt-10">
                {/* Loading State — skeleton cards */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-5 animate-pulse"
                            >
                                <div className="h-5 w-3/4 bg-white/[0.08] rounded mb-2" />
                                <div className="h-4 w-1/2 bg-white/[0.06] rounded mb-3" />
                                <div className="border-t border-white/[0.06] pt-3 mt-3">
                                    <div className="h-3 w-full bg-white/[0.04] rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                            <svg
                                className="w-8 h-8 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-red-400 mb-1">
                            Search Error
                        </h3>
                        <p className="text-zinc-500 max-w-md mx-auto">{error}</p>
                    </div>
                )}

                {/* Empty State — searched but no results */}
                {!isLoading && !error && hasSearched && results.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 mb-4">
                            <svg
                                className="w-8 h-8 text-violet-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-300 mb-1">
                            No Vehicles Found
                        </h3>
                        <p className="text-zinc-500 max-w-md mx-auto">
                            No models found for &quot;{searchInfo?.make}&quot;
                            {searchInfo?.year ? ` (${searchInfo.year})` : ""}. Try a different
                            make or remove the year filter.
                        </p>
                    </div>
                )}

                {/* Success State — show results */}
                {!isLoading && !error && results.length > 0 && (
                    <>
                        {/* Results count banner */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-zinc-400">
                                Found{" "}
                                <span className="font-semibold text-cyan-400">
                                    {results.length}
                                </span>{" "}
                                model{results.length !== 1 ? "s" : ""} for{" "}
                                <span className="font-semibold text-white">
                                    {searchInfo?.make}
                                </span>
                                {searchInfo?.year && (
                                    <span>
                                        {" "}
                                        ({searchInfo.year})
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Grid of cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.map((vehicle, index) => (
                                <VehicleCard
                                    key={`${vehicle.Make_ID}-${vehicle.Model_ID}`}
                                    vehicle={vehicle}
                                    index={index}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Initial State — haven't searched yet */}
                {!isLoading && !hasSearched && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 mb-6">
                            <svg
                                className="w-10 h-10 text-cyan-400/60"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.079-.481 1.035-1.1a60.27 60.27 0 0 0-1.341-7.575 1.126 1.126 0 0 0-.768-.794C18.225 8.862 16.318 8.25 12 8.25s-6.225.612-7.506 1.03a1.126 1.126 0 0 0-.768.794 60.293 60.293 0 0 0-1.341 7.576c-.044.618.414 1.1 1.035 1.1H3.75m14.5 0H9.75"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                            Search for Vehicles
                        </h3>
                        <p className="text-zinc-500 max-w-md mx-auto">
                            Enter a vehicle make (like &quot;Toyota&quot; or &quot;BMW&quot;) and optionally a
                            model year to discover matching vehicle models.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
