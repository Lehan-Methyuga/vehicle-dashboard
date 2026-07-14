// =============================================================================
// API Route: /api/vehicles
// =============================================================================
//
// WHAT THIS FILE DOES:
//   This is a server-side API endpoint. When the browser calls
//   GET /api/vehicles?make=toyota&year=2024, this code runs ON THE SERVER
//   (never in the browser), fetches data from NHTSA, and sends it back.
//
// WHY AN API ROUTE (THE PROXY PATTERN):
//   1. The browser never knows the NHTSA URL — if it changes, we fix one file.
//   2. We validate inputs HERE, on the server, before calling NHTSA.
//   3. If we ever add API keys or secrets, they stay on the server.
//   4. We can add caching or rate limiting later without touching the frontend.
//
// HOW IT WORKS:
//   Browser  -->  /api/vehicles?make=toyota  -->  This file  -->  NHTSA API
//   Browser  <--  Clean JSON response        <--  This file  <--  NHTSA API
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import type { NHTSAResponse, VehicleModel } from "@/lib/types";

// The base URL for all NHTSA vPIC API calls.
// This is a SERVER-ONLY constant — it never ships to the browser bundle.
const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

/**
 * GET /api/vehicles?make=toyota&year=2024
 *
 * Query Parameters:
 *   - make (required): The vehicle make name, e.g. "Toyota", "Honda"
 *   - year (optional): The model year, e.g. 2024
 *
 * Returns: A JSON object with a `results` array of VehicleModel objects.
 */
export async function GET(request: NextRequest) {
    // ─── Step 1: Extract query parameters from the URL ───
    // request.nextUrl.searchParams is like a dictionary of ?key=value pairs.
    const searchParams = request.nextUrl.searchParams;
    const make = searchParams.get("make");
    const year = searchParams.get("year");

    // ─── Step 2: Validate inputs ───
    // We reject empty requests early — no point calling NHTSA with garbage.
    if (!make || make.trim().length === 0) {
        return NextResponse.json(
            { error: "The 'make' query parameter is required. Example: ?make=toyota" },
            { status: 400 }
        );
    }

    // If year is provided, make sure it's a reasonable 4-digit number.
    if (year) {
        const yearNum = parseInt(year, 10);
        if (isNaN(yearNum) || yearNum < 1886 || yearNum > new Date().getFullYear() + 2) {
            return NextResponse.json(
                {
                    error: `Invalid year "${year}". Must be between 1886 and ${new Date().getFullYear() + 2}.`,
                },
                { status: 400 }
            );
        }
    }

    // ─── Step 3: Build the correct NHTSA URL ───
    // If the user provided a year, use the more specific endpoint.
    // Otherwise, get ALL models for that make (any year).
    const encodedMake = encodeURIComponent(make.trim());
    let nhtsaUrl: string;

    if (year) {
        // Endpoint: GetModelsForMakeYear — filters by make AND year
        nhtsaUrl = `${NHTSA_BASE_URL}/getmodelsformakeyear/make/${encodedMake}/modelyear/${year}?format=json`;
    } else {
        // Endpoint: GetModelsForMake — returns ALL models for this make
        nhtsaUrl = `${NHTSA_BASE_URL}/getmodelsformake/${encodedMake}?format=json`;
    }

    // ─── Step 4: Call the NHTSA API ───
    try {
        const response = await fetch(nhtsaUrl, {
            // Cache the response for 1 hour on the server side.
            // This means if 100 users search "Toyota" in the same hour,
            // we only call NHTSA once. Saves them bandwidth, speeds us up.
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            throw new Error(`NHTSA API returned status ${response.status}`);
        }

        const data: NHTSAResponse<VehicleModel> = await response.json();

        // ─── Step 5: Return the cleaned data ───
        // We return only what the frontend needs, not the raw NHTSA envelope.
        return NextResponse.json({
            count: data.Count,
            results: data.Results,
            searchCriteria: data.SearchCriteria,
        });
    } catch (error) {
        // ─── Error handling ───
        // Log the real error on the server (for debugging),
        // but send a generic message to the browser (for security).
        console.error("NHTSA API Error:", error);

        return NextResponse.json(
            { error: "Failed to fetch vehicle data. Please try again later." },
            { status: 500 }
        );
    }
}
