// src/app/home/page.tsx
import Link from "next/link";
import { supabaseServer } from "@/src/libs/supabase/supabase-server";
import BookListClient from "./BookListClient";

type SearchParams = {
  q?: string;
  tag?: string;
  sort?: "newest" | "title_asc" | "title_desc";
};

export const revalidate = 60;
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
    query = query
      .order("created_at", { ascending: false })
      .order("title", { ascending: true });
  }

  const { data, error, count } = await query;

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50 to-rose-100/50 px-6 py-4 text-rose-800 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold">Lỗi tải dữ liệu</p>
              <p className="mt-1 text-sm text-rose-600">{error.message}</p>
            </div>
          </div>
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
    new Set<string>(books.flatMap((b) => (Array.isArray(b.tags) ? b.tags : [])))
  ).sort();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with gradient */}
        <header className="mb-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl sm:p-12">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZ2LTZoNnYxOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
                  <span className="text-lg">📚</span>
                  <span className="text-sm font-medium text-white">
                    Library
                  </span>
                </div>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Book Collection
                </h1>
                <p className="mt-3 text-lg text-indigo-100">
                  {typeof count === "number" ? (
                    <>
                      Discover{" "}
                      <span className="font-semibold text-white">
                        {count} amazing book{count !== 1 ? "s" : ""}
                      </span>
                    </>
                  ) : (
                    "Explore your library"
                  )}
                </p>
              </div>

              <Link
                href="/create"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-6 py-3.5 font-semibold text-indigo-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 transition-transform group-hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Book
                </span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity group-hover:opacity-10"></div>
              </Link>
            </div>
          </div>
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
