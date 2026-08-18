import { db } from "@/lib/db";
import type { NextRequest } from "next/server";
import type { Broadcast, BroadcastPriority } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.toLowerCase();

  let results = db.getBroadcasts();

  if (q) {
    results = results.filter(
      (b) =>
        b.message.toLowerCase().includes(q) ||
        b.sectors.some((s) => s.toLowerCase().includes(q)) ||
        b.priority.toLowerCase().includes(q)
    );
  }

  return Response.json({ broadcasts: results, total: results.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, sectors, priority } = body;

  if (!message?.trim()) {
    return Response.json({ error: "MESSAGE PAYLOAD REQUIRED" }, { status: 400 });
  }
  if (!Array.isArray(sectors) || sectors.length === 0) {
    return Response.json({ error: "SELECT AT LEAST ONE SECTOR" }, { status: 400 });
  }

  const validPriorities = ["STANDARD", "URGENT", "OMEGA"];
  const safePriority: BroadcastPriority = validPriorities.includes(priority)
    ? (priority as BroadcastPriority)
    : "STANDARD";

  const now = new Date();
  const timeStr =
    now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
    " GCT";

  const newBroadcast: Broadcast = {
    id: `tx-${Date.now().toString(36)}`,
    message: String(message).trim(),
    sectors: sectors as string[],
    priority: safePriority,
    status: "SENT",
    timestamp: timeStr,
    createdAt: now.toISOString(),
  };

  db.addBroadcast(newBroadcast);
  return Response.json({ broadcast: newBroadcast }, { status: 201 });
}
