"use client";

import { useId, useState } from "react";
import PreImage from "./PreImage";

type Props = {
  name: string;                // trùng với field trong form (vd: "image_url")
  label?: string;
  helper?: string;
  defaultValue?: string;
};

export default function ImageUrlField({
  name,
  label = "Image URL",
  helper = "Dùng URL ảnh công khai (Unsplash, Supabase Storage, v.v.).",
  defaultValue = "",
}: Props) {
  const id = useId();
  const [url, setUrl] = useState(defaultValue);

  // chỉ preview khi chuỗi có vẻ là URL http(s)
  const previewUrl =
    url.trim().startsWith("http://") || url.trim().startsWith("https://")
      ? url.trim()
      : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      {/* input thật sẽ được submit cùng form server action */}
      <input
        id={id}
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://…/your-image.jpg"
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
      />

      <p className="text-xs text-slate-500">{helper}</p>

      {/* Preview */}
      <div className="mt-2 overflow-hidden rounded-xl border border-slate-200/70">
        <div className="relative aspect-[4/3]">
          <PreImage
            src={previewUrl}                 // ⬅️ chính là chỗ áp dụng PreImage
            alt="Recipe cover preview"
            className="h-full w-full"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}
