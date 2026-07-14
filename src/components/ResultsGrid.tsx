// =============================================================================
// ResultsGrid Component — Premium Car Showroom
// =============================================================================
//
// WHAT THIS FILE DOES:
//   1. Renders the SearchBar and handles search state.
//   2. Fetches vehicle data from /api/vehicles.
//   3. Fetches UNIQUE images per model from /api/images (e.g., "Ford Focus car").
//   4. Renders premium shimmer skeletons while loading.
//   5. Displays VehicleCards with staggered fade-in animations.
//
// IMAGE STRATEGY:
//   - After vehicle results arrive, we fetch images for each UNIQUE model.
//   - To stay within Unsplash's 50 req/hr free limit, we cap at 12 images.
//   - Each query is "${make} ${model} car" for model-specific results.
//   - Images are stored in a Map<modelKey, imageUrl>.
// =============================================================================

"use client";

import { useState, useCallback } from "react";
import SearchBar from "./SearchBar";
import VehicleCard from "./VehicleCard";
import type { VehicleModel } from "@/lib/types";

interface ApiSuccess {
    count: number;
    results: VehicleModel[];
    searchCriteria: string | null;
}

interface ApiError {
    error: string;
}

/** Maximum number of unique model images to fetch (rate limit protection) */
const MAX_IMAGE_FETCHES = 12;

export default function ResultsGrid() {
    const [results, setResults] = useState<VehicleModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchInfo, setSearchInfo] = useState<{ make: string; year?: number } | null>(null);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});

    const handleSearch = useCallback(async (make: string, year?: number) => {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        setSearchInfo({ make, year });
        setImageMap({});

        try {
            // ── Step 1: Fetch vehicle data ──
            const params = new URLSearchParams({ make });
            if (year) params.set("year", year.toString());

            const vehicleResponse = await fetch(`/api/vehicles?${params.toString()}`);
            const vehicleData: ApiSuccess | ApiError = await vehicleResponse.json();

            if (!vehicleResponse.ok) {
                throw new Error((vehicleData as ApiError).error || "Something went wrong");
            }

            const vehicles = (vehicleData as ApiSuccess).results || [];
            setResults(vehicles);

            // ── Step 2: Fetch unique images per model (non-blocking) ──
            // We do this AFTER setting results so the UI shows cards immediately
            // (with gradient fallbacks), then images pop in as they load.
            if (vehicles.length > 0) {
                fetchModelImages(vehicles, make);
            }
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

    /** Fetch images for unique models, capped at MAX_IMAGE_FETCHES */
    const fetchModelImages = async (vehicles: VehicleModel[], make: string) => {
        // Deduplicate by model name
        const uniqueModels = Array.from(
            new Map(vehicles.map((v) => [v.Model_Name, v])).values()
        ).slice(0, MAX_IMAGE_FETCHES);

        // Fetch all images in parallel
        const entries = await Promise.all(
            uniqueModels.map(async (vehicle) => {
                try {
                    const query = `${make} ${vehicle.Model_Name} car`;
                    const res = await fetch(
                        `/api/images?query=${encodeURIComponent(query)}`
                    );
                    if (res.ok) {
                        const data = await res.json();
                        if (data.images && data.images.length > 0) {
                            return [vehicle.Model_Name, data.images[0].url] as const;
                        }
                    }
                } catch {
                    // Silently fail — gradient fallback will be used
                }
                return null;
            })
        );

        // Build the image map
        const newMap: Record<string, string> = {};
        for (const entry of entries) {
            if (entry) {
                newMap[entry[0]] = entry[1];
            }
        }
        setImageMap(newMap);
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* ── Search Bar ── */}
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />

            {/* ── Results Area ── */}
            <div className="mt-12">
                {/* Loading — Premium shimmer skeletons */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06]"
                                style={{
                                    animationDelay: `${i * 100}ms`,
                                    animationFillMode: "both",
                                }}
                            >
                                {/* Image skeleton (4:3 aspect) */}
                                <div className="aspect-[4/3] shimmer" />
                                {/* Content skeleton */}
                                <div className="p-5 space-y-3">
                                    <div className="h-5 w-3/4 rounded-lg shimmer" />
                                    <div className="h-3 w-1/2 rounded-lg shimmer" />
                                    <div className="h-10 w-full rounded-xl shimmer mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/10 mb-6">
                            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-red-400 mb-2">Something Went Wrong</h3>
                        <p className="text-zinc-500 max-w-md mx-auto">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && hasSearched && results.length === 0 && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/10 mb-6">
                            <svg className="w-10 h-10 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-zinc-300 mb-2">No Vehicles Found</h3>
                        <p className="text-zinc-500 max-w-md mx-auto">
                            No models found for &quot;{searchInfo?.make}&quot;
                            {searchInfo?.year ? ` (${searchInfo.year})` : ""}. Try a different make or remove the year filter.
                        </p>
                    </div>
                )}

                {/* Success State — Premium cards */}
                {!isLoading && !error && results.length > 0 && (
                    <>
                        {/* Results count */}
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm text-zinc-500">
                                Found{" "}
                                <span className="font-semibold text-cyan-400">{results.length}</span>{" "}
                                model{results.length !== 1 ? "s" : ""} for{" "}
                                <span className="font-semibold text-white">{searchInfo?.make}</span>
                                {searchInfo?.year && <span className="text-zinc-400"> ({searchInfo.year})</span>}
                            </p>
                        </div>

                        {/* Card grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((vehicle, index) => (
                                <VehicleCard
                                    key={`${vehicle.Make_ID}-${vehicle.Model_ID}`}
                                    vehicle={vehicle}
                                    imageUrl={imageMap[vehicle.Model_Name]}
                                    index={index}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Initial State */}
                {!isLoading && !hasSearched && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-white/[0.06] mb-8">
                            <svg className="w-12 h-12 text-cyan-400/50" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.079-.481 1.035-1.1a60.27 60.27 0 0 0-1.341-7.575 1.126 1.126 0 0 0-.768-.794C18.225 8.862 16.318 8.25 12 8.25s-6.225.612-7.506 1.03a1.126 1.126 0 0 0-.768.794 60.293 60.293 0 0 0-1.341 7.576c-.044.618.414 1.1 1.035 1.1H3.75m14.5 0H9.75" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-zinc-300 mb-3">
                            Search for Vehicles
                        </h3>
                        <p className="text-zinc-600 max-w-md mx-auto text-base">
                            Enter a vehicle make like &quot;Toyota&quot;, &quot;BMW&quot;, or &quot;Ford&quot; and optionally a model year to explore.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
