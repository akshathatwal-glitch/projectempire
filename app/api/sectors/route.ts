import { db } from "@/lib/db";

/**
 * GET /api/sectors
 * Returns sector activity heatmap data for the SectorMap component.
 */
export async function GET() {
  const sectors = db.getSectors();
  const totalSightings = sectors.reduce((sum, s) => sum + s.sightings, 0);
  return Response.json({ sectors, totalSightings });
}
