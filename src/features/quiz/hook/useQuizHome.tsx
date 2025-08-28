import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useCreateQuestion,
  useDeleteQuestion,
  useQuestions,
  useUpdateQuestion,
} from "./useQuiz";
import type { AdminQuestion, UpdateQuestionInput } from "@/types";
import { questionSchema, type QuestionInput } from "../validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toFormDefaults } from "@/libs/utils";
import type { SortDir } from "@/api/QuizApi";

export default function useQuizHome() {
  const [runs, setRuns] = useState(0);

  useEffect(() => {
    setRuns((prev) => prev + 1);
  }, []);
  // 🔹 pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState<SortDir>("ASC");

  const { data, isLoading, isFetching } = useQuestions(true, runs, {
    page,
    limit,
    order,
    activeOnly: true, // optional
  });
  // const { data, isLoading } = useQuestions(true, runs);
  const createQ = useCreateQuestion();
  const delQ = useDeleteQuestion();
  const updQ = useUpdateQuestion();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminQuestion | null>(null);

  const form = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: toFormDefaults(),
    mode: "onTouched",
  });

  // open “Add” modal
  const onAdd = () => {
    setEditing(null);
    form.reset(toFormDefaults());
    setOpen(true);
  };

  // open “Edit” modal
  const onEdit = (q: AdminQuestion) => {
    setEditing(q);
    form.reset(toFormDefaults(q));
    setOpen(true);
  };

  // CREATE handler — keeps correct option as index (string "0..3")

  const submitNew = (v: QuestionInput) => {
    const correctIndex =
      v.correctOptionId === "" ? -1 : Number(v.correctOptionId);

    if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      toast.error("Please choose the correct option (1-4).");
      return;
    }

    const payload: Omit<AdminQuestion, "id" | "createdAt" | "updatedAt"> = {
      text: v.text.trim(),
      options: v.options.map((o) => ({
        isCorrect: v.options.indexOf(o) === correctIndex,
        text: o.text.trim(),
      })),
    };

    createQ.mutate(payload, {
      onSuccess: () => {
        toast.success("Question created");
        setOpen(false);
        form.reset(toFormDefaults());
      },
      onError: () => toast.error("Failed to create"),
    });
  };

  // UPDATE handler — converts selected index back to the option ID
  const submitEdit = (v: QuestionInput) => {
    if (!editing) return;

    const correctIndex =
      v.correctOptionId === "" ? -1 : Number(v.correctOptionId);
    if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      toast.error("Please choose the correct option (1–4).");
      return;
    }

    const payload: UpdateQuestionInput = {
      text: v.text.trim(),
      options: v.options.map((o, i) => ({
        text: o.text.trim(),
        isCorrect: i === correctIndex,
      })),
    };

    updQ.mutate(
      { id: editing.id, payload },
      {
        onSuccess: () => {
          toast.success("Question updated");
          setEditing(null);
          setOpen(false);
        },
        onError: () => toast.error("Failed to update"),
      }
    );
  };

  // submit dispatcher
  const onSubmit = form.handleSubmit(editing ? submitEdit : submitNew);

  // Close modal resets the form
  useEffect(() => {
    if (!open) {
      setEditing(null);
      form.reset(toFormDefaults());
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // 🔹 handy pagination helpers
  const meta = data?.meta;
  const questions = data?.data ?? [];

  const canPrev = !!meta?.hasPreviousPage;
  const canNext = !!meta?.hasNextPage;

  const goFirst = () => setPage(1);
  const goPrev = () => canPrev && setPage((p) => Math.max(1, p - 1));
  const goNext = () => canNext && setPage((p) => p + 1);
  const goLast = () => meta && setPage(meta.totalPages);

  useEffect(() => {
    if (meta && questions.length === 0 && meta.currentPage > 1) {
      setPage(meta.currentPage - 1);
    }
  }, [questions.length, meta]);

  return {
    // data
    questions,
    meta,
    isLoading,
    isFetching,

    // crud
    createQ,
    delQ,
    updQ,

    // modal & form
    open,
    setOpen,
    editing,
    onAdd,
    onEdit,
    onSubmit,
    form,

    // pagination state & actions
    page,
    limit,
    order,
    setPage,
    setLimit,
    setOrder,
    goFirst,
    goPrev,
    goNext,
    goLast,
  };
}
