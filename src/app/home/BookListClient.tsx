// src/app/home/BookListClient.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type SearchParams = {
  q?: string;
  tag?: string;
  sort?: "newest" | "title_asc" | "title_desc";
};

type Book = {
  id: string;
  title: string;
  author: string;
  tags: string[] | null;
  cover_url: string | null;
  created_at: string | null;
};

export default function BookListClient({
  books,
  uniqueTags,
  initial,
}: {
  books: Book[];
  uniqueTags: string[];
  initial: { q?: string; tag?: string; sort?: SearchParams["sort"] };
}) {
  const [q, setQ] = useState<string>(initial.q ?? "");
  const [tag, setTag] = useState<string>(initial.tag ?? "");
  const [sort, setSort] = useState<SearchParams["sort"]>(
    initial.sort ?? "newest"
  );

  const filtered = useMemo(() => {
    let res = books.slice();

    if (q.trim()) {
      const t = q.toLowerCase();
      res = res.filter((b) => (b.title ?? "").toLowerCase().includes(t));
    }

    if (tag) {
      res = res.filter((b) => Array.isArray(b.tags) && b.tags.includes(tag));
    }

    if (sort === "title_asc") {
      res.sort((a, b) =>
        (a.title ?? "").localeCompare(b.title ?? "", undefined, {
          sensitivity: "base",
        })
      );
    } else if (sort === "title_desc") {
      res.sort((a, b) =>
        (b.title ?? "").localeCompare(a.title ?? "", undefined, {
          sensitivity: "base",
        })
      );
    } else {
      // newest: created_at desc
      res.sort((a, b) => {
        const ta = a.created_at ? Date.parse(a.created_at) : 0;
        const tb = b.created_at ? Date.parse(b.created_at) : 0;
        return tb - ta;
      });
    }

    return res;
  }, [books, q, tag, sort]);

  return (
    <div>
      {/* Filters Card (client-side) */}
      <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_10px_30px_-12px_rgba(2,6,23,0.18)] backdrop-blur">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title…"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
          />

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
          >
            <option value="">All tags</option>
            {uniqueTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SearchParams["sort"])}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
          >
            <option value="newest">Newest first</option>
            <option value="title_asc">Title A → Z</option>
            <option value="title_desc">Title Z → A</option>
          </select>
        </div>

        {/* Quick tags */}
        {uniqueTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setTag("")}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs transition ${
                !tag
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              All
            </button>
            {uniqueTags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs transition ${
                  tag === t
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-xl">📚</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            No books found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Thử đổi từ khoá, chọn tag khác hoặc tạo book mới.
          </p>
          <div className="mt-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300"
            >
              Create a Book
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <li key={b.id}>
              <Link
                href={`/home/${b.id}`}
                className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
                aria-label={`Open ${b.title}`}
              >
                <div className="relative w-full overflow-hidden bg-slate-100">
                  <div className="aspect-[4/3] w-full">
                    {b.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.cover_url}
                        alt={b.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        No cover
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="line-clamp-1 text-base font-semibold text-slate-900 underline-offset-2 group-hover:underline">
                      {b.title}
                    </div>
                    <span
                      className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                      title={
                        b.created_at
                          ? new Date(b.created_at).toLocaleString()
                          : ""
                      }
                    >
                      {b.created_at
                        ? new Date(b.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {b.author}
                  </p>

                  {Array.isArray(b.tags) && b.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {b.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-700 transition group-hover:bg-slate-200"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 underline-offset-2 group-hover:text-slate-900 group-hover:underline">
                      View
                    </span>
                    <div className="text-xs text-slate-400">
                      {Array.isArray(b.tags) && b.tags.length > 0
                        ? `${b.tags.length} tag${b.tags.length > 1 ? "s" : ""}`
                        : "—"}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
