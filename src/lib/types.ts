// =============================================================================
// TypeScript Types for NHTSA vPIC API Responses
// =============================================================================
//
// WHAT THIS FILE DOES:
//   Defines the "shape" of data we get back from the NHTSA API.
//   Think of these interfaces like blueprints — they tell TypeScript
//   "this is what a vehicle model object looks like" so it can
//   catch mistakes (like typos in property names) before we even run the code.
//
// WHY A SEPARATE FILE:
//   Every component that touches vehicle data imports from here.
//   If NHTSA ever changes their API response format, we update ONE file
//   and TypeScript tells us everywhere else that needs fixing.
// =============================================================================

/**
 * A single vehicle model returned by NHTSA.
 *
 * Example JSON from the API:
 * {
 *   "Make_ID": 441,
 *   "Make_Name": "TOYOTA",
 *   "Model_ID": 1861,
 *   "Model_Name": "Camry"
 * }
 */
export interface VehicleModel {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

/**
 * The wrapper envelope that NHTSA wraps around ALL their responses.
 *
 * Every endpoint returns: { Count: number, Message: string, Results: [...] }
 * The generic <T> lets us reuse this for different result types.
 *
 * Example: NHTSAResponse<VehicleModel> means Results is VehicleModel[].
 */
export interface NHTSAResponse<T> {
  Count: number;
  Message: string;
  SearchCriteria: string | null;
  Results: T[];
}

/**
 * The search parameters our frontend sends to our API route.
 * - make: required (e.g. "Toyota")
 * - year: optional (e.g. 2024)
 */
export interface SearchParams {
  make: string;
  year?: number;
}
