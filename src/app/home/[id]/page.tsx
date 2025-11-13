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
  params: Promise<{ id: string }>;
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <header className="mb-8">
          <Link
            href="/home"
            className="group inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Library
          </Link>

          <div className="mt-6 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-1.5 text-sm font-semibold text-indigo-700">
                <span>📖</span>
                Book Details
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                {book.title}
              </h1>
              <p className="mt-2 text-lg text-slate-600">by {book.author}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column - Book preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Cover image card */}
              <div className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-xl">
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  <PreImage
                    src={book.cover_url}
                    alt={book.title ?? "Book cover"}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Metadata card */}
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Created
                    </p>
                    <p className="mt-1 text-sm text-slate-900">
                      {book.created_at
                        ? new Date(book.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </p>
                  </div>

                  {Array.isArray(book.tags) && book.tags.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Categories
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {book.tags.map((t: string) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Edit form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* UPDATE FORM */}
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Edit Book
                    </h2>
                    <p className="text-sm text-slate-500">
                      Update book information
                    </p>
                  </div>
                </div>

                <form action={onUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="title"
                        required
                        defaultValue={book.title ?? ""}
                        className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Author <span className="text-rose-500">*</span>
                      </label>
                      <input
                        name="author"
                        required
                        defaultValue={book.author ?? ""}
                        className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Cover Image URL
                    </label>
                    <input
                      name="cover_url"
                      defaultValue={book.cover_url ?? ""}
                      placeholder="https://example.com/cover.jpg"
                      className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                    <div className="relative mt-3 h-48 overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200">
                      <PreImage
                        src={book.cover_url}
                        alt={book.title ?? "Preview cover"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Tags (comma separated)
                    </label>
                    <input
                      name="tags"
                      defaultValue={
                        Array.isArray(book.tags) ? book.tags.join(", ") : ""
                      }
                      placeholder="Fiction, Mystery, Thriller"
                      className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              {/* DANGER ZONE */}
              <div className="overflow-hidden rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-red-50 shadow-lg">
                <div className="border-b border-rose-200 bg-white/50 p-6 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                      <svg
                        className="h-5 w-5 text-rose-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-rose-900">Danger Zone</h3>
                      <p className="text-sm text-rose-700">
                        Irreversible actions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="mb-4 text-sm text-rose-800">
                    Once you delete this book, there is no going back. Please be
                    certain.
                  </p>
                  <form id={deleteFormId} action={onDelete} />
                  <ConfirmDeleteButton formId={deleteFormId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
