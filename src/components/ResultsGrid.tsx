"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import SearchBar from "./SearchBar";
import VehicleCard from "./VehicleCard";
import type { VehicleModel, VehicleType } from "@/lib/types";

interface ApiSuccess {
    count: number;
    results: VehicleModel[];
}

interface ApiError {
    error: string;
}

const MAX_IMAGE_FETCHES = 12;

export default function ResultsGrid() {
    const [results, setResults] = useState<VehicleModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [imageMap, setImageMap] = useState<Record<string, string>>({});

    // Filter states
    const [currentMake, setCurrentMake] = useState<string>("");
    const [availableTypes, setAvailableTypes] = useState<VehicleType[]>([]);

    // Active filters
    const [yearFilter, setYearFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [sortOrder, setSortOrder] = useState<string>("az"); // "az" or "za"

    // Primary search from the top bar
    const handleInitialSearch = async (make: string) => {
        setCurrentMake(make);
        setYearFilter("all");
        setTypeFilter("all");
        setSortOrder("az");
        setAvailableTypes([]);
        await fetchVehicleData(make, "all", "all");
        fetchAvailableTypes(make);
    };

    // Derived effect when filters change (we only fetch if we already have a make)
    useEffect(() => {
        if (currentMake) {
            fetchVehicleData(currentMake, yearFilter, typeFilter);
        }
    }, [yearFilter, typeFilter, currentMake]);

    const fetchVehicleData = async (make: string, year: string, type: string) => {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        setImageMap({}); // Reset images when list changes

        try {
            const params = new URLSearchParams({ make });
            if (year !== "all") params.set("year", year);
            if (type !== "all") params.set("type", type);

            const res = await fetch(`/api/vehicles?${params.toString()}`);
            const data: ApiSuccess | ApiError = await res.json();

            if (!res.ok) throw new Error((data as ApiError).error || "Failed");

            const vehicles = (data as ApiSuccess).results || [];

            // Deduplicate models because NHTSA sometimes returns dupes
            const uniqueModels = Array.from(new Map(vehicles.map((v) => [v.Model_ID, v])).values());

            setResults(uniqueModels);

            if (uniqueModels.length > 0) {
                fetchModelImages(uniqueModels, make);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred.");
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableTypes = async (make: string) => {
        try {
            const res = await fetch(`/api/vehicle-types?make=${encodeURIComponent(make)}`);
            if (res.ok) {
                const data = await res.json();
                setAvailableTypes(data.results || []);
            }
        } catch (e) {
            console.error("Failed to load types");
        }
    };

    const fetchModelImages = async (vehicles: VehicleModel[], make: string) => {
        const uniqueModels = Array.from(new Map(vehicles.map(v => [v.Model_Name, v])).values()).slice(0, MAX_IMAGE_FETCHES);

        const entries = await Promise.all(
            uniqueModels.map(async (vehicle) => {
                try {
                    const query = `${make} ${vehicle.Model_Name} car`;
                    const res = await fetch(`/api/images?query=${encodeURIComponent(query)}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.images && data.images.length > 0) {
                            return [vehicle.Model_Name, data.images[0].url] as const;
                        }
                    }
                } catch { }
                return null;
            })
        );

        const newMap: Record<string, string> = {};
        for (const entry of entries) {
            if (entry) newMap[entry[0]] = entry[1];
        }
        setImageMap(newMap);
    };

    // Apply local sorting
    const sortedResults = useMemo(() => {
        return [...results].sort((a, b) => {
            const nameA = a.Model_Name.toLowerCase();
            const nameB = b.Model_Name.toLowerCase();
            if (sortOrder === "az") return nameA.localeCompare(nameB);
            return nameB.localeCompare(nameA);
        });
    }, [results, sortOrder]);

    const clearFilters = () => {
        setYearFilter("all");
        setTypeFilter("all");
        setSortOrder("az");
    };

    const hasActiveFilters = yearFilter !== "all" || typeFilter !== "all" || sortOrder !== "az";

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Search Bar Container */}
            <div className="-mt-8 mb-12">
                <SearchBar onSearch={handleInitialSearch} isLoading={isLoading && !hasSearched} />
            </div>

            {/* Results Area */}
            {hasSearched && (
                <div className="space-y-8 animate-[fadeInUp_0.5s_ease-out]">

                    {/* ── Filter & Sort Header ── */}
                    <div className="rounded-[2rem] bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-6 shadow-2xl">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                            {/* Left: Summary */}
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-bold text-white tracking-tight capitalize">{currentMake}</h2>
                                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold">
                                        {results.length} Models
                                    </span>
                                </div>
                                <p className="text-zinc-500 text-sm">Refine your search using the advanced filters below.</p>
                            </div>

                            {/* Right: Controls */}
                            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">

                                {/* Year Dropdown */}
                                <div className="flex flex-col gap-1 w-full sm:w-auto">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Model Year</label>
                                    <select
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        className="bg-[#050510] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-cyan-500/50 appearance-none min-w-[120px]"
                                    >
                                        <option value="all">All Years</option>
                                        {Array.from({ length: 6 }).map((_, i) => {
                                            const y = 2025 - i;
                                            return <option key={y} value={y}>{y}</option>;
                                        })}
                                    </select>
                                </div>

                                {/* Sort Dropdown */}
                                <div className="flex flex-col gap-1 w-full sm:w-auto">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Sort By</label>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="bg-[#050510] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-cyan-500/50 appearance-none min-w-[150px]"
                                    >
                                        <option value="az">Name (A ➝ Z)</option>
                                        <option value="za">Name (Z ➝ A)</option>
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="mt-5 text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700 hover:decoration-white"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Vehicle Type Pills */}
                        {availableTypes.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-white/[0.05]">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Vehicle Types</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setTypeFilter("all")}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${typeFilter === "all" ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]" : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08]"}`}
                                    >
                                        All Types
                                    </button>
                                    {availableTypes.map((type) => (
                                        <button
                                            key={type.VehicleTypeId}
                                            onClick={() => setTypeFilter(type.VehicleTypeName)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${typeFilter === type.VehicleTypeName ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200"}`}
                                        >
                                            {type.VehicleTypeName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Status display (Loading / Error / Empty) ── */}
                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="aspect-[4/3] shimmer" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-6 w-2/3 rounded-lg shimmer" />
                                        <div className="h-4 w-1/3 rounded-lg shimmer" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="py-20 text-center">
                            <p className="text-red-400 font-semibold">{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && sortedResults.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="inline-flex w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/[0.06] items-center justify-center mb-6">
                                <span className="text-3xl">📭</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No models found</h3>
                            <p className="text-zinc-500">Try adjusting your filters or year range.</p>
                        </div>
                    )}

                    {!isLoading && !error && sortedResults.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                            {sortedResults.map((vehicle, index) => (
                                <VehicleCard
                                    key={`${vehicle.Make_ID}-${vehicle.Model_ID}`}
                                    vehicle={vehicle}
                                    imageUrl={imageMap[vehicle.Model_Name]}
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
