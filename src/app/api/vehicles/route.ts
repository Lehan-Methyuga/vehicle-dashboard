import { NextRequest, NextResponse } from "next/server";
import type { NHTSAResponse, VehicleModel } from "@/lib/types";

const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const make = searchParams.get("make");
    const year = searchParams.get("year");
    const type = searchParams.get("type");

    if (!make || make.trim().length === 0) {
        return NextResponse.json({ error: "The 'make' parameter is required." }, { status: 400 });
    }

    const encodedMake = encodeURIComponent(make.trim());
    let nhtsaUrl = "";

    // NHTSA has a specific endpoint structure.
    // If either year OR type is provided, we must use the GetModelsForMakeYear endpoint,
    // which magically supports leaving year out if type is provided, or vice versa!
    if (year && type) {
        nhtsaUrl = `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${encodedMake}/modelyear/${year}/vehicletype/${encodeURIComponent(type)}?format=json`;
    } else if (year) {
        nhtsaUrl = `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${encodedMake}/modelyear/${year}?format=json`;
    } else if (type) {
        nhtsaUrl = `${NHTSA_BASE_URL}/GetModelsForMakeYear/make/${encodedMake}/vehicletype/${encodeURIComponent(type)}?format=json`;
    } else {
        // Just make
        nhtsaUrl = `${NHTSA_BASE_URL}/GetModelsForMake/${encodedMake}?format=json`;
    }

    try {
        const response = await fetch(nhtsaUrl, { next: { revalidate: 3600 } });
        if (!response.ok) throw new Error(`NHTSA API returned status ${response.status}`);

        const data: NHTSAResponse<VehicleModel> = await response.json();

        return NextResponse.json({
            count: data.Count,
            results: data.Results,
            searchCriteria: data.SearchCriteria,
        });
    } catch (error) {
        console.error("NHTSA API Error:", error);
        return NextResponse.json({ error: "Failed to fetch vehicle data." }, { status: 500 });
    }
}
