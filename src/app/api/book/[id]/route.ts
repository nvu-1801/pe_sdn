import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/libs/supabase/supabase-admin";

// Next 15: params là Promise => phải await
type Ctx = { params: Promise<{ id: string }> };

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e) ?? "Internal error";
  } catch {
    return "Internal error";
  }
}

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (e: unknown) {
    console.error("GET /api/books/[id] failed:", e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { title, author, tags = [], cover_url = null } = body ?? {};

    if (!title?.trim() || !author?.trim()) {
      return NextResponse.json(
        { error: "Title và Author là bắt buộc" },
        { status: 400 }
      );
    }

    const sb = supabaseAdmin();
    const { error } = await sb
      .from("books")
      .update({ title, author, tags, cover_url })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("PUT /api/books/[id] failed:", e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const sb = supabaseAdmin();
    const { error } = await sb.from("books").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("DELETE /api/books/[id] failed:", e);
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 });
  }
}
