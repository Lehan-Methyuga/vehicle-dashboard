// =============================================================================
// SearchBar Component (Client Component)
// =============================================================================
//
// WHAT THIS FILE DOES:
//   Renders a search form with two inputs: Make (text) and Year (number).
//   When the user clicks "Search", it calls the `onSearch` callback
//   with the current values so the parent can trigger an API call.
//
// WHY "use client"?
//   This component uses React hooks (useState) and handles user events
//   (onChange, onSubmit). These features only work in the browser,
//   so we must mark it as a Client Component.
//
// WHY A CALLBACK INSTEAD OF FETCHING HERE?
//   Separation of concerns: SearchBar only knows about the FORM.
//   It doesn't know about APIs or data — that's ResultsGrid's job.
//   This makes SearchBar reusable and easy to test.
// =============================================================================

"use client";

import { useState } from "react";

interface SearchBarProps {
    /** Called when the user submits the search form */
    onSearch: (make: string, year?: number) => void;
    /** Whether a search is currently in progress (disables the button) */
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [make, setMake] = useState("");
    const [year, setYear] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        // Prevent the browser from reloading the page (default form behavior).
        e.preventDefault();

        // Don't search if the make field is empty.
        if (!make.trim()) return;

        // Convert year to a number if provided, otherwise leave it undefined.
        const yearNum = year ? parseInt(year, 10) : undefined;

        onSearch(make.trim(), yearNum);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] p-6 shadow-2xl">
                {/* Decorative gradient glow behind the card */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-fuchsia-500/20 blur-xl -z-10" />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    {/* ── Make Input ── */}
                    <div className="flex-1">
                        <label
                            htmlFor="make-input"
                            className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2"
                        >
                            Vehicle Make
                        </label>
                        <input
                            id="make-input"
                            type="text"
                            value={make}
                            onChange={(e) => setMake(e.target.value)}
                            placeholder="e.g. Toyota, Honda, BMW..."
                            className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white/[0.08]"
                        />
                    </div>

                    {/* ── Year Input ── */}
                    <div className="w-full sm:w-36">
                        <label
                            htmlFor="year-input"
                            className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2"
                        >
                            Year <span className="text-zinc-600">(optional)</span>
                        </label>
                        <input
                            id="year-input"
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="2024"
                            min={1886}
                            max={new Date().getFullYear() + 2}
                            className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white/[0.08] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>

                    {/* ── Search Button ── */}
                    <button
                        id="search-button"
                        type="submit"
                        disabled={isLoading || !make.trim()}
                        className="relative w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-cyan-500/25"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                {/* Simple spinning loader */}
                                <svg
                                    className="animate-spin h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Searching…
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                {/* Search icon */}
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                    />
                                </svg>
                                Search
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
