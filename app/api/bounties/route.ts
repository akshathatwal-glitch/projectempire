import { db } from "@/lib/db";
import type { NextRequest } from "next/server";
import type { Bounty, BountyThreat } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sector = searchParams.get("sector");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") ?? "PAYOUT";
  const q = searchParams.get("q")?.toLowerCase();

  let results = db.getBounties();

  if (sector && sector !== "ALL") {
    results = results.filter((b) => b.sector === sector);
  }
  if (status && status !== "ALL") {
    results = results.filter((b) => b.status === status);
  }
  if (q) {
    results = results.filter(
      (b) =>
        b.target.toLowerCase().includes(q) ||
        b.alias.toLowerCase().includes(q) ||
        b.sector.toLowerCase().includes(q)
    );
  }

  results = [...results].sort((a, b) =>
    sort === "THREAT" ? b.threat - a.threat : b.payout - a.payout
  );

  return Response.json({ bounties: results, total: results.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { target, alias, sector, threat, payout, lastSeen } = body;

  if (!target?.trim()) {
    return Response.json({ error: "TARGET DESIGNATION REQUIRED" }, { status: 400 });
  }
  if (!payout || Number(payout) <= 0) {
    return Response.json({ error: "VALID PAYOUT REQUIRED" }, { status: 400 });
  }
  if (!sector) {
    return Response.json({ error: "SECTOR REQUIRED" }, { status: 400 });
  }

  const newBounty: Bounty = {
    id: `bt-${Date.now().toString(36)}`,
    target: String(target).trim(),
    alias: alias?.trim() ? `"${String(alias).trim()}"` : "Unlisted",
    sector: String(sector),
    threat: (Number(threat) || 3) as BountyThreat,
    payout: Number(payout),
    lastSeen: lastSeen?.trim() || "Position unconfirmed",
    status: "ACTIVE",
    postedAt: new Date().toISOString(),
  };

  db.addBounty(newBounty);
  return Response.json({ bounty: newBounty }, { status: 201 });
}
