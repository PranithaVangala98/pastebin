import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  let now = new Date().getTime();

  if (process.env.TEST_MODE === "1") {
    const xTestNowValue = Number(request.headers.get("x-test-now-ms") || 0);
    if (xTestNowValue) {
      now = xTestNowValue;
    }
  }

  const rows = await sql`
    SELECT id, content, expires_at, max_views, views
    FROM pastes
    WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 });
  }

  const paste = rows[0];

  if (paste.expires_at && now > new Date(paste.expires_at).getTime()) {
    return NextResponse.json({ error: "Paste expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  await sql`
    UPDATE pastes
    SET views = views + 1
    WHERE id = ${id}
  `;

  const remainingViews =
    paste.max_views === null ? null : paste.max_views - (paste.views + 1);

  return NextResponse.json(
    {
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expires_at,
    },
    { status: 200 },
  );
}
