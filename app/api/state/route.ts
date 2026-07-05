import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

// Eén gedeelde rij (id=1) met de hele AppState als JSON: genoeg voor een
// persoonlijke reisplanner die vanaf meerdere toestellen (pc + telefoon(s))
// wordt gebruikt. Zonder DATABASE_URL (bijv. lokaal zonder db) geeft de route
// gewoon 503 terug en valt de app terug op alleen localStorage.
export const dynamic = "force-dynamic";

function getSql(): NeonQueryFunction<false, false> | null {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  return neon(url);
}

async function ensureTable(sql: NeonQueryFunction<false, false>) {
  await sql.query(
    "CREATE TABLE IF NOT EXISTS app_state (id INT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())"
  );
}

export async function GET() {
  const sql = getSql();
  if (!sql) return NextResponse.json({ error: "no-db" }, { status: 503 });
  try {
    await ensureTable(sql);
    const rows = await sql.query("SELECT data FROM app_state WHERE id = 1");
    if (rows.length === 0) return NextResponse.json(null);
    return NextResponse.json(rows[0].data);
  } catch {
    return NextResponse.json({ error: "db-error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const sql = getSql();
  if (!sql) return NextResponse.json({ error: "no-db" }, { status: 503 });
  const data = await request.json();
  try {
    await ensureTable(sql);
    await sql.query(
      `INSERT INTO app_state (id, data, updated_at) VALUES (1, $1::jsonb, now())
       ON CONFLICT (id) DO UPDATE SET data = $1::jsonb, updated_at = now()`,
      [JSON.stringify(data)]
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "db-error" }, { status: 500 });
  }
}
