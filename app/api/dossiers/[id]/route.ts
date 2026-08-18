import { db } from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dossier = db.getDossierById(id);
  if (!dossier) {
    return Response.json({ error: "DOSSIER NOT FOUND — CLEARANCE DENIED" }, { status: 404 });
  }
  return Response.json({ dossier });
}
