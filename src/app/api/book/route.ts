import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/libs/supabase/supabase-admin";

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e) ?? "Internal error";
  } catch {
    return "Internal error";
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const tag = (searchParams.get("tag") ?? "").trim();
    const sort =
      (searchParams.get("sort") as "title_asc" | "title_desc") ?? "title_asc";

    const sb = supabaseAdmin();
    let query = sb.from("books").select("*");

    if (q) query = query.ilike("title", `%${q}%`); // search theo title
    if (tag) query = query.contains("tags", [tag]);

    query = query.order("title", { ascending: sort !== "title_desc" });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    return NextResponse.json({ data });
  } catch (e: unknown) {
    console.error("GET /api/books failed:", e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title, author, tags = [], cover_url = null } = body ?? {};

    if (!title?.trim() || !author?.trim()) {
      return NextResponse.json(
        { error: "Title và Author là bắt buộc" },
        { status: 400 }
      );
    }

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("books")
      .insert({ title, author, tags, cover_url })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e: unknown) {
    console.error("POST /api/books failed:", e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}
