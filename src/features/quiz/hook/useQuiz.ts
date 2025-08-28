import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizApi, type QuestionParams } from "@/api/QuizApi";
import type { AdminQuestion, ID, PublicQuestion } from "@/types";
import { QK } from "./keys";
import type { PaginatedResponse } from "@/types/global";

export function useQuestions(
  enabled: boolean,
  runs: number,
  query: QuestionParams = { page: 1, limit: 10 }
) {
  return useQuery<PaginatedResponse<AdminQuestion>>({
    queryKey: [...QK.questions, runs, query],
    queryFn: () => quizApi.list(query),
    enabled,
  });
}

export function useCreateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: quizApi.create.bind(quizApi),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.questions }),
  });
}

export function useUpdateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: ID;
      payload: Partial<AdminQuestion>;
    }) => quizApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.questions }),
  });
}

export function useDeleteQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: quizApi.remove.bind(quizApi),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.questions }),
  });
}

export function useStartQuiz(enabled = true, runId = 0) {
  return useQuery<PublicQuestion[]>({
    queryKey: [...QK.quizStart, runId], // 👈 runId in key = new cache entry
    queryFn: quizApi.start.bind(quizApi),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

// export function useStartQuiz() {
//   return useQuery({
//     queryKey: ["quiz", "start"],
//   });
// }
export function useSubmitQuiz() {
  return useMutation({
    mutationFn: quizApi.submit,
  });
}
