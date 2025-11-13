// libs/base-url.ts
import { headers } from 'next/headers';

export async function baseUrl(): Promise<string> {
  // 1) Thử lấy từ request headers (Vercel/Proxy)
  try {
    const h = await headers(); // ✅ ở bản của bạn là Promise
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const host  = h.get('x-forwarded-host') ?? h.get('host');
    if (host) return `${proto}://${host}`;
  } catch {
    // headers() có thể throw nếu gọi ngoài req context → fallback ENV
  }

  // 2) ENV (nên set để chắc ăn)
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // 3) Local fallback
  return 'http://localhost:3000';
}
