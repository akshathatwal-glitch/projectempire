import { db } from "@/lib/db";
import type { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const updated = db.updateBounty(id, body);
  if (!updated) {
    return Response.json({ error: "BOUNTY NOT FOUND" }, { status: 404 });
  }

  return Response.json({ bounty: updated });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bounty = db.getBountyById(id);
  if (!bounty) {
    return Response.json({ error: "BOUNTY NOT FOUND" }, { status: 404 });
  }
  return Response.json({ bounty });
}
