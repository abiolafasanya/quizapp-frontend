// src/store/quizStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ID, PublicQuestion } from "@/types";

interface QuizState {
  questions: PublicQuestion[];
  index: number;
  answers: Record<ID, ID | null>; // questionId -> optionKey (id or stringified index)
  startTs: number | null;

  // optional: useful to know when rehydrate is done
  hasHydrated: boolean;

  setQuestions: (qs: PublicQuestion[]) => void;
  answer: (questionId: ID, optionKey: ID) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      index: 0,
      answers: {},
      startTs: null,
      hasHydrated: false,

      setQuestions: (qs) =>
        set({ questions: qs, index: 0, answers: {}, startTs: Date.now() }),

      answer: (qid, key) => set({ answers: { ...get().answers, [qid]: key } }),

      next: () =>
        set((s) => ({ index: Math.min(s.index + 1, s.questions.length - 1) })),

      prev: () => set((s) => ({ index: Math.max(s.index - 1, 0) })),

      reset: () => {
        set({ questions: [], index: 0, answers: {}, startTs: null });
        // If you also want to wipe localStorage when pressing "Retake":
        // useQuizStore.persist.clearStorage();
      },

      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "quiz-storage",
      // 👇 Explicitly bind to window.localStorage for React (Vite) apps
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        questions: state.questions,
        index: state.index,
        answers: state.answers,
        startTs: state.startTs,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error("zustand persist rehydrate error", error);
        } else {
          state?.setHasHydrated(true);
          // eslint-disable-next-line no-console
          console.debug("zustand rehydrated", {
            questions: state?.questions.length ?? 0,
            index: state?.index,
          });
        }
      },
      version: 1,
    }
  )
);
