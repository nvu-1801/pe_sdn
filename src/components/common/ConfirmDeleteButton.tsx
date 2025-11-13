// components/ConfirmDeleteButton.tsx
"use client";

export default function ConfirmDeleteButton({ formId }: { formId: string }) {
  return (
    <button
      form={formId}
      onClick={(e) => {
        if (!confirm("Xóa Book này?")) e.preventDefault();
      }}
      className="inline-flex items-center justify-center rounded-xl border border-rose-300/70 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 focus:outline-none focus:ring-4 focus:ring-rose-200"
    >
      Delete
    </button>
  );
}
