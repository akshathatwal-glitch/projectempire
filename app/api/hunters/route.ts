import { db } from "@/lib/db";

/**
 * GET /api/hunters
 * Returns all active hunter deployments.
 */
export async function GET() {
  const hunters = db.getHunters();
  return Response.json({ hunters, total: hunters.length });
}
