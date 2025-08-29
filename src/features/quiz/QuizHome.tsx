import * as Dialog from "@radix-ui/react-dialog";
import {
  Plus,
  Pencil,
  Trash,
  X,
  ArrowUpDown,
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/Button";
import TextInput from "@/components/TextInput";
import { Controller } from "react-hook-form";
import { Select } from "@/components/Select"; // inside your form JSX
import useQuizHome from "./hook/useQuizHome";
import type { ID } from "@/types";
import PageLoader from "@/components/PageLoader";

export default function QuizHome() {
  const {
    createQ,
    delQ,
    updQ,
    editing,
    form,
    isLoading,
    isFetching,
    open,
    questions,
    meta,

    // pagination
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

    // modal
    onAdd,
    onEdit,
    onSubmit,
    setOpen,
  } = useQuizHome();

  function handleDelete(id: ID) {
    const confirmEnd = window.confirm(
      "Are you sure of this action?"
    );
    if (confirmEnd) {
      delQ.mutate(id, {
        onSuccess: () => {
          toast.success("Deleted");
        },
        onError: () => toast.error("Failed to delete"),
      });
    }
  }

  const startIndex = (page - 1) * limit + 1;
  const endIndex = meta
    ? Math.min(page * limit, meta.totalCount)
    : questions.length;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage Questions</h1>
        <div className="flex items-center gap-2">
          <Button
            className="btn-ghost flex items-center gap-1"
            onClick={() => setOrder(order === "ASC" ? "DESC" : "ASC")}
            title={`Toggle order (currently ${order})`}
          >
            <ArrowUpDown size={16} /> {order}
          </Button>
          <Button
            className="btn-primary flex items-center gap-1"
            onClick={onAdd}
          >
            <Plus size={16} /> Add Question
          </Button>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Question</th>
              <th className="p-3">Options</th>
              <th className="p-3">Correct</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={5}>
                  <PageLoader />
                </td>
              </tr>
            ) : questions?.length ? (
              questions.map((q, idx) => {
                const correctText =
                  q.options.find((o) => o.isCorrect)?.text ?? "-";
                return (
                  <tr key={q.id} className="border-t">
                    <td className="p-3">{startIndex + idx}</td>
                    <td className="p-3 font-medium">{q.text}</td>
                    <td className="p-3">
                      {q.options.map((o) => o.text).join(", ")}
                    </td>
                    <td className="p-3">{correctText}</td>
                    <td className="p-3 text-right space-x-2">
                      <Button className="btn-ghost" onClick={() => onEdit(q)}>
                        <Pencil size={14} />
                      </Button>
                      <Button
                        className="btn-ghost text-red-600"
                        onClick={() => handleDelete(q.id)}
                        disabled={delQ.isPending}
                      >
                        <Trash size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={5}>
                  No questions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-3 border-t bg-white">
          <div className="text-xs text-gray-600">
            {meta ? (
              <>
                Showing <strong>{startIndex}</strong>–
                <strong>{endIndex}</strong> of{" "}
                <strong>{meta.totalCount}</strong>
              </>
            ) : (
              <>—</>
            )}
            {isFetching && (
              <span className="ml-2 text-gray-400">(updating…)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Page size */}
            <label className="text-xs text-gray-600">Rows:</label>
            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // reset to first page when page size changes
              }}
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            {/* Pager */}
            <div className="flex items-center gap-1">
              <Button
                className="btn-ghost px-2"
                onClick={goFirst}
                disabled={!meta?.hasPreviousPage}
              >
                <ChevronsLeft size={16} />
              </Button>
              <Button
                className="btn-ghost px-2"
                onClick={goPrev}
                disabled={!meta?.hasPreviousPage}
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-xs px-2">
                Page <strong>{meta?.currentPage ?? 1}</strong> of{" "}
                <strong>{meta?.totalPages ?? 1}</strong>
              </span>
              <Button
                className="btn-ghost px-2"
                onClick={goNext}
                disabled={!meta?.hasNextPage}
              >
                <ChevronRight size={16} />
              </Button>
              <Button
                className="btn-ghost px-2"
                onClick={goLast}
                disabled={!meta?.hasNextPage}
              >
                <ChevronsRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Question</th>
              <th className="p-3">Options</th>
              <th className="p-3">Correct</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={5}>
                  Loading…
                </td>
              </tr>
            ) : questions && Array.isArray(questions) && questions?.length ? (
              questions?.map((q, idx) => {
                const correctText =
                  q.options.find((o) => o.isCorrect)?.text ?? "-";

                return (
                  <tr key={q.id} className="border-t">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3 font-medium">{q.text}</td>
                    <td className="p-3">
                      {q.options.map((o) => o.text).join(", ")}
                    </td>
                    <td className="p-3">{correctText}</td>
                    <td className="p-3 text-right space-x-2">
                      <Button className="btn-ghost" onClick={() => onEdit(q)}>
                        <Pencil size={14} />
                      </Button>
                      <Button
                        className="btn-ghost text-red-600"
                        onClick={() =>
                          delQ.mutate(q.id, {
                            onSuccess: () => toast.success("Deleted"),
                            onError: () => toast.error("Failed to delete"),
                          })
                        }
                      >
                        <Trash size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={5}>
                  No questions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}

      {/* Modal (Radix Dialog) */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/35 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(92vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95">
            <div className="flex items-start justify-between">
              <Dialog.Title className="text-lg font-semibold">
                {editing ? "Edit Question" : "Add New Question"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="btn-ghost p-1 rounded-md hover:bg-gray-100">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              {/* Question */}
              <TextInput
                label="Question"
                multiline
                rows={5}
                {...form.register("text")}
                placeholder="Type the question…"
                error={form.formState.errors?.text}
              />
              {/* Options (1..4) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <TextInput
                    key={i}
                    id={i.toString()}
                    label={`Option ${i + 1}`}
                    {...form.register(`options.${i}.text` as const)}
                    placeholder={`Enter option ${i + 1}`}
                  />
                ))}
              </div>
              {/* Correct option — store INDEX "0..3" as string */}

              <Controller
                control={form.control}
                name="correctOptionId" // we store "0" | "1" | "2" | "3"
                render={({ field, fieldState }) => (
                  <Select
                    label="Correct Option"
                    placeholder="Select (1–4)"
                    value={field.value}
                    onValueChange={field.onChange}
                    error={fieldState.error}
                    options={[
                      { label: "1", value: "0" },
                      { label: "2", value: "1" },
                      { label: "3", value: "2" },
                      { label: "4", value: "3" },
                    ]}
                  />
                )}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button
                  className="btn btn-primary"
                  disabled={createQ.isPending || updQ.isPending}
                  type="submit"
                >
                  {editing ? "Save changes" : "Create question"}
                </Button>
                <Dialog.Close asChild>
                  <button className="btn btn-ghost" type="button">
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
