import { db } from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.toLowerCase();
  const status = searchParams.get("status");
  const sector = searchParams.get("sector");
  const sort = searchParams.get("sort") ?? "THREAT";

  let results = db.getDossiers();

  if (q) {
    results = results.filter(
      (d) =>
        d.codename.toLowerCase().includes(q) ||
        d.realName.toLowerCase().includes(q) ||
        d.affiliation.toLowerCase().includes(q) ||
        d.sector.toLowerCase().includes(q)
    );
  }
  if (status && status !== "ALL") {
    results = results.filter((d) => d.status === status);
  }
  if (sector && sector !== "ALL") {
    results = results.filter((d) =>
      d.sector.toLowerCase().includes(sector.toLowerCase())
    );
  }

  results = [...results].sort((a, b) =>
    sort === "THREAT" ? b.threat - a.threat : a.id < b.id ? 1 : -1
  );

  return Response.json({ dossiers: results, total: results.length });
}
