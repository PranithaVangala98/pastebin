// export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  let now = new Date().getTime();

  if (process.env.TEST_MODE === "1") {
    const xTestNowValue = Number(request.headers.get("x-test-now-ms") || 0);
    if (xTestNowValue) {
      now = xTestNowValue;
    }
  }

  // 1️⃣ Fetch paste
  const rows = await sql`
    SELECT id, content, expires_at, max_views, views
    FROM pastes
    WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 });
  }

  const paste = rows[0];

  // 2️⃣ Check expiration
  if (paste.expires_at && now > new Date(paste.expires_at).getTime()) {
    return NextResponse.json({ error: "Paste expired" }, { status: 404 });
  }

  // 3️⃣ Check view limit
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // 4️⃣ Increment views (successful fetch)
  await sql`
    UPDATE pastes
    SET views = views + 1
    WHERE id = ${id}
  `;

  // 5️⃣ Calculate remaining views
  const remainingViews =
    paste.max_views === null ? null : paste.max_views - (paste.views + 1);

  // 6️⃣ Response
  return NextResponse.json(
    {
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expires_at,
    },
    { status: 200 },
  );
}
