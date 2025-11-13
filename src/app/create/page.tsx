import Link from "next/link";
import { createBook } from "../(actions)/book.actions";
import ImageUrlField from "@/src/components/common/ImageUrlField";

export default function CreatePage() {
  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Books / Create</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Create Book
            </h1>
          </div>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span aria-hidden>←</span> Back
          </Link>
        </header>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_10px_30px_-12px_rgba(2,6,23,0.18)] backdrop-blur">
          <form action={createBook} className="space-y-8">
            {/* Title & Cover in 2 columns */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Title <span className="text-rose-600">*</span>
                </label>
                <input
                  name="title"
                  required
                  placeholder="Ví dụ: Clean Code"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
                />
                <p className="text-xs text-slate-500">
                  Đặt tên sách rõ ràng, dễ tìm kiếm.
                </p>
              </div>

              {/* Cover image URL */}
              <ImageUrlField name="cover_url" />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Author <span className="text-rose-600">*</span>
              </label>
              <input
                name="author"
                required
                placeholder="Ví dụ: Robert C. Martin"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
              />
              <p className="text-xs text-slate-500">
                Nhập tên tác giả chính của cuốn sách.
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Tags (comma separated)
              </label>
              <input
                name="tags"
                placeholder="IT, Programming, Self-help"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
              />
              <p className="text-xs text-slate-500">
                Dùng dấu phẩy để tách tag. VD: <em>IT, Programming</em>.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/home"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 active:translate-y-[1px]"
              >
                Save Book
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Sau khi lưu, bạn sẽ được chuyển về danh sách Books.
        </p>
      </div>
    </main>
  );
}
