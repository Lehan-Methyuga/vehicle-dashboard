"use client";

import { useState } from "react";

interface SearchBarProps {
    onSearch: (make: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [make, setMake] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!make.trim()) return;
        onSearch(make.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto animate-float">
            <div className="relative rounded-2xl bg-[#050510]/60 backdrop-blur-xl border border-white/[0.1] p-3 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex items-center justify-between">
                {/* Decorative glow */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-violet-500/20 blur-xl -z-10" />

                <div className="flex w-full items-center">
                    <div className="pl-4 pr-3 text-cyan-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        placeholder="Search for a vehicle make (e.g., Ford, Audi, Tesla)..."
                        className="w-full bg-transparent border-none text-white placeholder-zinc-500 focus:ring-0 outline-none py-3 px-2 text-lg font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !make.trim()}
                        className="ml-2 rounded-xl bg-white text-[#050510] px-6 py-2.5 font-bold transition-all duration-300 hover:bg-cyan-400 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:shadow-none"
                    >
                        {isLoading ? (
                            <div className="h-5 w-5 border-2 border-[#050510] border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                            "Search"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
