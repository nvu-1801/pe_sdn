// app/lib/getRecipes.ts
import 'server-only';
import { cacheTag } from 'next/cache';

export async function getRecipes(q = '', tag = '', sort: 'title_asc'|'title_desc' = 'title_asc') {
  'use cache';
  cacheTag('recipes'); // <— gắn tag
  const qs = new URLSearchParams({ q, tag, sort }).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/recipes?` + qs, {
    next: { tags: ['recipes'] }, // <— gắn tag qua fetch
  });
  if (!res.ok) throw new Error('Failed to load recipes');
  const { data } = await res.json();
  return data as Array<{
    id: string; title: string; ingredients: string; tags: string[]; image_url?: string|null;
  }>;
}
