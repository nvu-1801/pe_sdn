import Link from "next/link";
import { createBook } from "../(actions)/book.actions";
import ImageUrlField from "@/src/components/common/ImageUrlField";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with gradient */}
        <header className="mb-10">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl sm:p-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTZ2LTZoNnYxOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

            <div className="relative">
              <Link
                href="/home"
                className="group mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
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

              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <span className="text-3xl">✨</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Create New Book
                  </h1>
                  <p className="mt-1 text-indigo-100">
                    Add a new book to your collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Form Card */}
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xl sm:p-10">
          <form action={createBook} className="space-y-8">
            {/* Title & Cover in 2 columns */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Title */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <svg
                    className="h-4 w-4 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Book Title
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  name="title"
                  required
                  placeholder="e.g., Clean Code"
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
                <p className="flex items-start gap-2 text-xs text-slate-500">
                  <svg
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
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
                  Enter a clear, searchable book title
                </p>
              </div>

              {/* Cover image URL */}
              <ImageUrlField name="cover_url" />
            </div>

            {/* Author */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <svg
                  className="h-4 w-4 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Author
                <span className="text-rose-500">*</span>
              </label>
              <input
                name="author"
                required
                placeholder="e.g., Robert C. Martin"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
              <p className="flex items-start gap-2 text-xs text-slate-500">
                <svg
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
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
                Enter the primary author's name
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <svg
                  className="h-4 w-4 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Categories
                <span className="text-xs font-normal text-slate-500">
                  (optional)
                </span>
              </label>
              <input
                name="tags"
                placeholder="Fiction, Mystery, Thriller"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
              <p className="flex items-start gap-2 text-xs text-slate-500">
                <svg
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
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
                Separate tags with commas (e.g.,{" "}
                <em className="font-medium">Fiction, Mystery</em>)
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-8">
              <Link
                href="/home"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-300"
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
                Create Book
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 backdrop-blur">
          <p className="flex items-center justify-center gap-2 text-sm text-indigo-700">
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
            After saving, you'll be redirected to the book collection
          </p>
        </div>
      </div>
    </main>
  );
}
