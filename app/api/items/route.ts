export const dynamic = "force-static";

// Next.js example
import postgres from "postgres";

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const conn = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
});

export async function GET() {
  //   const res = await fetch('https://data.mongodb-api.com/...', {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'API-Key': process.env.DATA_API_KEY,
  //     },
  //   })
  //   const data = await res.json()

  const users = await conn`SELECT * FROM playing_with_neon`;
  console.log("db call", users);

  return Response.json({ users });
}
