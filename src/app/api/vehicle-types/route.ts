// =============================================================================
// API Route: /api/vehicle-types
// =============================================================================
//
// WHAT THIS FILE DOES:
//   Server-side proxy for the NHTSA GetVehicleTypesForMake API.
//   Fetches the list of vehicle types (e.g., Passenger Car, Truck) for a make.
//
// WHY A PROXY?
//   Keeps API calls clean and prevents the frontend from hardcoding external URLs.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const make = request.nextUrl.searchParams.get("make");

    if (!make || make.trim().length === 0) {
        return NextResponse.json(
            { error: "The 'make' parameter is required. Example: ?make=toyota" },
            { status: 400 }
        );
    }

    const encodedMake = encodeURIComponent(make.trim());
    const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMake/${encodedMake}?format=json`;

    try {
        const response = await fetch(nhtsaUrl, { next: { revalidate: 3600 } }); // Cache for 1 hr

        if (!response.ok) {
            throw new Error(`NHTSA API returned status ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            count: data.Count,
            results: data.Results,
            searchCriteria: data.SearchCriteria,
        });
    } catch (error) {
        console.error("NHTSA Vehicle Types API Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch vehicle types." },
            { status: 500 }
        );
    }
}
