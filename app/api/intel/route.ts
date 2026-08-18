import { db } from "@/lib/db";

/**
 * GET /api/intel
 *
 * Returns the last 20 intercept feed lines.
 * Also generates a new random line each call to simulate live data
 * streaming — the frontend polls this every ~3 seconds.
 */
export async function GET() {
  // Generate a new intercept line on each poll so the feed stays live
  db.generateIntercept();
  const lines = db.getIntercepts();
  return Response.json({ lines, total: lines.length });
}
