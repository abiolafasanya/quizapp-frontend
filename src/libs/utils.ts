import type { QuestionInput } from "@/features/quiz/validation";
import type { AdminOption, AdminQuestion } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric characters except space and hyphen
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove multiple consecutive hyphens
}

export function toFormDefaults(q?: AdminQuestion): QuestionInput {
  if (q) {
    const correctIndex = Math.max(
      0,
      q.options.findIndex((o: AdminOption) => o.isCorrect === true)
    );
    return {
      text: q.text,
      options: q.options.map((o: AdminOption) => ({ text: o.text })), // drop id/isCorrect
      correctOptionId: String(correctIndex), // store index ("0".."3") in form
    };
  }
  return {
    text: "",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctOptionId: "",
  };
}

class QueryBuilder {
  private query: string;

  constructor(url: string) {
    this.query = `${url}?`;
  }

  set(key: string, value: string | number | boolean | undefined): this {
    if (value === undefined || value === null || value === "") return this;
    this.query += `${encodeURIComponent(key)}=${encodeURIComponent(
      String(value)
    )}&`;
    return this;
  }

  addParams(
    params: Record<string, string | number | boolean | undefined>
  ): this {
    for (const [key, value] of Object.entries(params)) {
      this.set(key, value);
    }
    return this;
  }

  build(): string {
    return this.query.slice(0, -1);
  }
}

export default QueryBuilder;
