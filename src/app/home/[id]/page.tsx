// src/app/home/[id]/page.tsx
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { supabaseServer } from "@/src/libs/supabase/supabase-server";
import { deleteBook, updateBook } from "@/src/app/(actions)/book.actions";
import ConfirmDeleteButton from "@/src/components/common/ConfirmDeleteButton";
import PreImage from "@/src/components/common/PreImage";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const sb = supabaseServer();
  const { data: book, error } = await sb
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !book) {
    return notFound();
  }

  async function onUpdate(formData: FormData) {
    "use server";
    await updateBook(id, formData);
    revalidatePath("/home");
    redirect("/home");
  }

  async function onDelete() {
    "use server";
    await deleteBook(id);
    revalidatePath("/home");
    redirect("/home");
  }

  const deleteFormId = "delete-form";

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Books / Detail</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {book.title}
            </h1>
          </div>
          <Link
            href="/home"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Back
          </Link>
        </header>

        {/* View card */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <PreImage
            src={book.cover_url}
            alt={book.title ?? "Book cover"}
            className="h-60 w-full"
          />
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Created:{" "}
                {book.created_at
                  ? new Date(book.created_at).toLocaleString()
                  : "—"}
              </div>
              {Array.isArray(book.tags) && book.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {book.tags.map((t: string) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h2 className="mt-4 text-sm font-semibold text-slate-900">
              Author
            </h2>
            <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              {book.author}
            </p>
          </div>
        </div>

        {/* UPDATE FORM */}
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_10px_30px_-12px_rgba(2,6,23,0.18)] backdrop-blur">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Update
          </h3>
          <form action={onUpdate} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Title *
                </label>
                <input
                  name="title"
                  required
                  defaultValue={book.title ?? ""}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Cover URL
                </label>
                <input
                  name="cover_url"
                  defaultValue={book.cover_url ?? ""}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
                />
                <div className="relative mt-2 h-40 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <PreImage
                    src={book.cover_url}
                    alt={book.title ?? "Preview cover"}
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Author *
              </label>
              <input
                name="author"
                required
                defaultValue={book.author ?? ""}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Tags (comma separated)
              </label>
              <input
                name="tags"
                defaultValue={
                  Array.isArray(book.tags) ? book.tags.join(",") : ""
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* DANGER ZONE */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-6">
          <h3 className="mb-2 text-sm font-semibold text-rose-700">
            Danger zone
          </h3>
          <p className="mb-4 text-xs text-slate-500">
            Xoá vĩnh viễn book này.
          </p>

          <form id={deleteFormId} action={onDelete} />
          <ConfirmDeleteButton formId={deleteFormId} />
        </div>
      </div>
    </main>
  );
}
