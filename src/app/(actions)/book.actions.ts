// app/(actions)/book.actions.ts
"use server";

import { revalidatePath } from "next/cache";

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

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author, tags, cover_url }),
    });

    if (!res.ok) {
      const { error } = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(error || "Create failed");
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

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/book/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, tags, cover_url }),
      }
    );

    if (!res.ok) {
      const { error } = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(error || "Update failed");
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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/book/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const { error } = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(error || "Delete failed");
    }

    revalidatePath("/home", "page");
    return { ok: true };
  } catch (e: unknown) {
    console.error("deleteBook failed:", e);
    throw new Error(getErrorMessage(e));
  }
}
