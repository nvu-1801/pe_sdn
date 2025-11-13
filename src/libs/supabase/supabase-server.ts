import { createClient } from '@supabase/supabase-js';

export function supabaseServer() {
  // Cách đơn giản: client server-side dùng anon key (đủ cho bài thi)
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
