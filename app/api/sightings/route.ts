import { db } from "@/lib/db";
import type { NextRequest } from "next/server";
import type { Sighting, SightingThreat, SightingStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sector = searchParams.get("sector");
  const threat = searchParams.get("threat");
  const status = searchParams.get("status");

  let results = db.getSightings();

  if (sector && sector !== "ALL") {
    results = results.filter((s) => s.sector === sector);
  }
  if (threat && threat !== "ALL") {
    results = results.filter((s) => s.threat === threat);
  }
  if (status && status !== "ALL") {
    results = results.filter((s) => s.status === status);
  }

  return Response.json({ sightings: results, total: results.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sector, designation, threat, status, angle, note } = body;

  if (!sector || !designation) {
    return Response.json({ error: "SECTOR AND DESIGNATION REQUIRED" }, { status: 400 });
  }

  const validThreats = ["STANDARD", "URGENT", "OMEGA"];
  const validStatuses = ["ACTIVE PURSUIT", "CONFIRMED CAPTURE", "COLD TRAIL"];

  const now = new Date();
  const timeStr =
    now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
    " GCT";

  const newSighting: Sighting = {
    id: `sg-${Date.now().toString(36)}`,
    sector: String(sector),
    designation: String(designation),
    threat: (validThreats.includes(threat) ? threat : "STANDARD") as SightingThreat,
    status: (validStatuses.includes(status) ? status : "COLD TRAIL") as SightingStatus,
    angle: typeof angle === "number" ? angle : Math.floor(Math.random() * 360),
    note: note?.trim() || "No additional notes.",
    timestamp: timeStr,
  };

  db.addSighting(newSighting);
  return Response.json({ sighting: newSighting }, { status: 201 });
}
