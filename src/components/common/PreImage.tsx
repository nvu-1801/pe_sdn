// components/common/PreImage.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  /** container class (nền, border, aspect…) */
  className?: string;
  /** nếu muốn tải sớm (ảnh hero) */
  priority?: boolean;
};

export default function PreImage({
  src,
  alt,
  className = "",
  priority = false,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  // Reset state khi URL đổi
  useEffect(() => {
    setLoaded(false);
    setErr(false);
  }, [src]);

  // Không có src hoặc lỗi → fallback
  if (!src || err) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* shimmer */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
      )}

      <img
        src={src}
        alt={alt}
        // Fill + object-cover như next/image
        className={`absolute inset-0 h-full w-full object-cover ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        onError={() => setErr(true)}
        // mapping priority -> eager/lazy
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // Giảm rủi ro CORS/referrer; vẫn hiển thị được hầu hết ảnh công khai
        crossOrigin="anonymous"
        referrerPolicy="no-referrer-when-downgrade"
        draggable={false}
      />
    </div>
  );
}
