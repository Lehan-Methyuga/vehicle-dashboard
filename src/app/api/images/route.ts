// =============================================================================
// API Route: /api/images
// =============================================================================
//
// WHAT THIS FILE DOES:
//   Server-side proxy for the Unsplash Search Photos API.
//   Fetches images specific to a vehicle model (e.g., "Ford Focus car").
//
// SECURITY:
//   The Unsplash Access Key is read from process.env (server-only).
//   The browser never sees the key — only calls /api/images.
//
// RATE LIMITS:
//   Unsplash free tier: 50 requests/hour.
//   Next.js caches responses for 1 hour (revalidate: 3600).
// =============================================================================

import { NextRequest, NextResponse } from "next/server";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

interface UnsplashPhoto {
    urls: { regular: string; small: string };
    alt_description: string | null;
    user: { name: string };
}

interface UnsplashSearchResponse {
    results: UnsplashPhoto[];
}

export async function GET(request: NextRequest) {
    // ─── Step 1: Read the API key from environment variables ───
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!accessKey || accessKey === "your_key_here") {
        return NextResponse.json(
            { error: "Unsplash API key is not configured." },
            { status: 500 }
        );
    }

    // ─── Step 2: Validate the query parameter ───
    const query = request.nextUrl.searchParams.get("query");

    if (!query || query.trim().length === 0) {
        return NextResponse.json(
            { error: "The 'query' parameter is required. Example: ?query=Ford+Focus+car" },
            { status: 400 }
        );
    }

    // ─── Step 3: Call the Unsplash API ───
    try {
        const params = new URLSearchParams({
            query: query.trim(),
            per_page: "3",
            orientation: "landscape",
            content_filter: "high",
        });

        const response = await fetch(`${UNSPLASH_API_URL}?${params.toString()}`, {
            headers: {
                Authorization: `Client-ID ${accessKey}`,
            },
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            throw new Error(`Unsplash API returned status ${response.status}`);
        }

        const data: UnsplashSearchResponse = await response.json();

        // ─── Step 4: Return clean image data ───
        const images = data.results.map((photo) => ({
            url: photo.urls.small,
            urlFull: photo.urls.regular,
            alt: photo.alt_description || `Photo of ${query}`,
            photographer: photo.user.name,
        }));

        return NextResponse.json({ images });
    } catch (error) {
        console.error("Unsplash API Error:", error);

        return NextResponse.json(
            { error: "Failed to fetch images." },
            { status: 500 }
        );
    }
}
