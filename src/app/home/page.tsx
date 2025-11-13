// src/app/home/page.tsx
import Link from "next/link";
import { supabaseServer } from "@/src/libs/supabase/supabase-server";
import BookListClient from "./BookListClient";

type SearchParams = {
  q?: string;
  tag?: string;
  sort?: "newest" | "title_asc" | "title_desc";
};

export const revalidate = 60; // 1 phút
export const fetchCache = "force-cache";
export const dynamic = "force-static";

export default async function Home({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const q = (searchParams?.q ?? "").trim();
  const tag = (searchParams?.tag ?? "").trim();
  const sort = (searchParams?.sort as SearchParams["sort"]) ?? "newest";

  const sb = supabaseServer();
  let query = sb.from("books").select("*", { count: "exact" });

  if (q) query = query.ilike("title", `%${q}%`);
  if (tag) query = query.contains("tags", [tag]);

  if (sort === "title_desc") {
    query = query
      .order("title", { ascending: false })
      .order("created_at", { ascending: false });
  } else if (sort === "title_asc") {
    query = query
      .order("title", { ascending: true })
      .order("created_at", { ascending: false });
  } else {
    // newest
    query = query
      .order("created_at", { ascending: false })
      .order("title", { ascending: true });
  }

  const { data, error, count } = await query;

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
          Lỗi tải dữ liệu: {error.message}
        </div>
      </main>
    );
  }

  const books = (data ?? []) as {
    id: string;
    title: string;
    author: string;
    tags: string[] | null;
    cover_url: string | null;
    created_at: string | null;
  }[];

  const uniqueTags = Array.from(
    new Set<string>(
      books.flatMap((b) => (Array.isArray(b.tags) ? b.tags : []))
    )
  ).sort();

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Books</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Explore & Manage
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {typeof count === "number"
                ? `${count} book${count === 1 ? "" : "s"} found`
                : ""}
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
          >
            <span aria-hidden>＋</span> Create
          </Link>
        </header>

        {/* Client-side filters + list */}
        <BookListClient
          books={books}
          uniqueTags={uniqueTags}
          initial={{ q, tag, sort }}
        />
      </div>
    </main>
  );
}
