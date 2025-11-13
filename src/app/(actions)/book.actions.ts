// app/(actions)/book.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/src/libs/supabase/supabase-server";

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e) ?? "Internal error";
  } catch {
    return "Internal error";
  }
}

export async function createBook(formData: FormData) {
  try {
    const title = formData.get("title")?.toString() ?? "";
    const author = formData.get("author")?.toString() ?? "";
    const tagsStr = formData.get("tags")?.toString() ?? "";
    const cover_url = formData.get("cover_url")?.toString() ?? "";

    if (!title.trim() || !author.trim()) {
      throw new Error("Title và Author là bắt buộc");
    }

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const sb = supabaseServer();
    const { error } = await sb
      .from("books")
      .insert({ title, author, tags, cover_url });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/home", "page");
    return { ok: true };
  } catch (e: unknown) {
    console.error("createBook failed:", e);
    throw new Error(getErrorMessage(e));
  }
}

export async function updateBook(id: string, formData: FormData) {
  try {
    const title = formData.get("title")?.toString() ?? "";
    const author = formData.get("author")?.toString() ?? "";
    const tagsStr = formData.get("tags")?.toString() ?? "";
    const cover_url = formData.get("cover_url")?.toString() ?? "";

    if (!title.trim() || !author.trim()) {
      throw new Error("Title và Author là bắt buộc");
    }

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const sb = supabaseServer();
    const { error } = await sb
      .from("books")
      .update({ title, author, tags, cover_url })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/home", "page");
    revalidatePath(`/home/${id}`, "page");
    return { ok: true };
  } catch (e: unknown) {
    console.error("updateBook failed:", e);
    throw new Error(getErrorMessage(e));
  }
}

export async function deleteBook(id: string) {
  try {
    const sb = supabaseServer();
    const { error } = await sb.from("books").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/home", "page");
    return { ok: true };
  } catch (e: unknown) {
    console.error("deleteBook failed:", e);
    throw new Error(getErrorMessage(e));
  }
}
