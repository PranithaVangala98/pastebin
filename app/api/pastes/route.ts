// app/api/paste/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    // ---- Validation ----
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "content is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "ttl_seconds must be an integer ≥ 1" },
        { status: 400 },
      );
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "max_views must be an integer ≥ 1" },
        { status: 400 },
      );
    }

    // ---- Create Paste ----
    const id = crypto.randomBytes(4).toString("hex");
    const expiresAt = ttl_seconds
      ? new Date(Date.now() + ttl_seconds * 1000)
      : null;

    // ---- Insert into Neon ----
    await sql`
      INSERT INTO pastes (id, content, expires_at, max_views)
      VALUES (${id}, ${content}, ${expiresAt}, ${max_views ?? null})
    `;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://your-app.vercel.app";

    return NextResponse.json(
      {
        id,
        url: `${baseUrl}/p/${id}`,
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
