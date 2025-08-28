import axios, { type AxiosResponse } from "axios";
import type {
  AdminQuestion,
  QuizSubmitPayload,
  QuizResult,
  ID,
  PublicQuestion,
} from "@/types";
import QueryBuilder from "@/libs/utils";
import type { PaginatedResponse } from "@/types/global";

export type SortDir = "ASC" | "DESC";

export interface QuestionParams {
  page?: number; // default handled server-side (or pass explicitly)
  limit?: number; // cap on server (e.g., 100)
  order?: SortDir; // "ASC" | "DESC"
  activeOnly?: boolean; // filter by isActive
  lean?: boolean; // plain objects if your API supports it
}

class QuizApi {
  private readonly qUrl = "/api/questions";
  private readonly quizUrl = "/api/quiz";

  // ----- Questions CRUD (protected) -----

  async list(
    params?: QuestionParams
  ): Promise<PaginatedResponse<AdminQuestion>> {
    const qb = new QueryBuilder(`${this.qUrl}`)
      .set("page", params?.page)
      .set("limit", params?.limit)
      .set("order", params?.order)
      .set("activeOnly", params?.activeOnly)
      .set("lean", params?.lean);
    const res: AxiosResponse<PaginatedResponse<AdminQuestion>> =
      await axios.get(qb.build());
    return res.data;
  }

  // Create question
  async create(
    payload: Omit<AdminQuestion, "id" | "createdAt" | "updatedAt">
  ): Promise<AdminQuestion> {
    const { data } = await axios.post<{ data: AdminQuestion }>(
      this.qUrl,
      payload
    );
    return data.data;
  }

  // Update question
  async update(
    id: ID,
    payload: Partial<Omit<AdminQuestion, "id">>
  ): Promise<AdminQuestion> {
    const { data } = await axios.put<{ data: AdminQuestion }>(
      `${this.qUrl}/${id}`,
      payload
    );
    return data.data;
  }

  // Delete question
  async remove(id: ID): Promise<{ message: string }> {
    const { data } = await axios.delete<{ data: { message: string } }>(
      `${this.qUrl}/${id}`
    );
    return data.data;
  }

  // ----- Quiz flow -----
  async start(): Promise<PublicQuestion[]> {
    const { data } = await axios.get<{ data: PublicQuestion[] }>(
      `${this.quizUrl}/start`,
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );
    return data.data;
  }

  // Submit Quiz
  async submit(payload: QuizSubmitPayload): Promise<QuizResult> {
    const { data } = await axios.post<{ data: QuizResult }>(
      `api/quiz/submit`,
      payload
    );
    return data.data;
  }
}

export const quizApi = new QuizApi();
