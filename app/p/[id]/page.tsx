import { sql } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const rows = await sql`
    UPDATE pastes
    SET views = views + 1
    WHERE id = ${id}
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (max_views IS NULL OR views < max_views)
    RETURNING content, expires_at, max_views, views
  `;

  if (rows.length === 0) {
    return (
      <ErrorState
        title="Paste unavailable"
        message="This paste has expired or its view limit has been reached."
      />
    );
  }

  const paste = rows[0];

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h2>Shared Paste</h2>
        <small>
          {paste.max_views !== null && (
            <>Remaining views: {paste.max_views - paste.views}</>
          )}
        </small>
      </header>

      <pre style={styles.paste}>{paste.content}</pre>
    </main>
  );
}

/* ---------------- Error UI ---------------- */

function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <main style={styles.errorContainer}>
      <h2>{title}</h2>
      <p>{message}</p>
      <a href="/" style={styles.link}>
        {/* Create a new paste */}
      </a>
    </main>
  );
}

/* ---------------- Styles ---------------- */

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "3rem auto",
    padding: "1.5rem",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
  },
  paste: {
    background: "#f4f4f4",
    padding: "1rem",
    borderRadius: "6px",
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    fontSize: "0.95rem",
  },
  errorContainer: {
    maxWidth: "500px",
    margin: "5rem auto",
    textAlign: "center",
    fontFamily: "system-ui, sans-serif",
  },
  link: {
    marginTop: "1rem",
    display: "inline-block",
    color: "#0070f3",
  },
};
