export const dynamic = "force-dynamic";

async function getPaste(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/pastes/${id}`,
  );
  const data = await res.json();
  return { status: res.status, data };
}

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  if (!id) {
    return (
      <ErrorState title="Paste unavailable" message="No paste ID provided." />
    );
  }

  const { status, data } = await getPaste(id);
  console.log("status", status);
  console.log("data", data);

  if (status !== 200) {
    let message = "This paste is unavailable.";
    if (data?.error === "Paste expired") message = "This paste has expired.";
    else if (data?.error === "View limit exceeded")
      message = "This paste's view limit has been reached.";
    else if (data?.error === "Paste not found")
      message = "This paste does not exist.";
    return <ErrorState title="Paste unavailable" message={message} />;
  }

  const paste = data;

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h2>Shared Paste</h2>
        <small>
          {paste.remaining_views !== null && (
            <>Remaining views: {paste.remaining_views}</>
          )}
        </small>
      </header>

      <pre style={styles.paste}>{paste.content}</pre>
    </main>
  );
}

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
