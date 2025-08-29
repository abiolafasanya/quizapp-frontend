import { useEffect, useState } from "react";
import { useStartQuiz, useSubmitQuiz } from "@/features/quiz/hook/useQuiz";
import { useQuizStore } from "@/store/quizStore";
import Timer from "@/components/quiz/Timer";
import { Button } from "@/components/Button";
import { cn } from "@/libs/utils";
import type { QuizSubmitPayload, PublicOption } from "@/types";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  Play,
} from "lucide-react";
import PageLoader from "@/components/PageLoader";

const optionKey = (opt: PublicOption, i: number): string => String(opt.id ?? i);
const letters = ["A", "B", "C", "D", "E", "F"];

export default function QuizAndResults() {
  const [runId, setRunId] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const { data, isLoading } = useStartQuiz(enabled, runId);

  const {
    questions,
    index,
    answers,
    setQuestions,
    next,
    prev,
    answer,
    startTs,
    reset,
  } = useQuizStore();

  const [result, setResult] = useState<{
    total: number;
    correct: number;
    timeTaken: number;
  } | null>(null);

  // load questions into store (do NOT auto-start)
  useEffect(() => {
    if (data) setQuestions(data);
  }, [data, setQuestions]);

  const submitQuiz = useSubmitQuiz();

  const total = questions.length;
  const current = questions[index];

  const hasStarted = !!startTs && !result; // only shows quiz UI after start
  const qId = current ? String(current.id) : "";
  const selected = current ? answers[qId] ?? null : null;

  const getElapsedSec = () =>
    startTs ? Math.floor((Date.now() - startTs) / 1000) : 0;

  const fmtTime = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  function begin() {
    setEnabled(true); // enable the query
    useQuizStore.getState().begin();
    setResult(null);
  }

  async function handleRetake() {
    reset(); // should clear startTs to null in your store
    setResult(null); // back to start screen
    setRunId((n) => n + 1); // fetch a fresh set if backend rotates questions
  }

  function handleEndNow() {
    if (!hasStarted) return;
    const confirmEnd = window.confirm(
      "End the quiz now and submit your answers?"
    );
    if (confirmEnd) {
      handleSubmit();
    }
  }

  const handleSubmit = () => {
    const mapped = Object.entries(answers).map(([questionId, storedKey]) => {
      const q = questions.find((qq) => String(qq.id) === questionId);
      const opt = q?.options.find((o, i) => String(o.id ?? i) === storedKey);
      if (!opt || opt.id === undefined)
        throw new Error(`Option id missing for question ${questionId}`);
      return { questionId, optionId: String(opt.id) };
    });

    const payload: QuizSubmitPayload = {
      answers: mapped,
      timeTakenSec: getElapsedSec(), // snapshot now
    };

    submitQuiz.mutate(payload, {
      onSuccess: (d) => {
        setResult({
          total: d.totalQuestions,
          correct: d.correctCount,
          timeTaken: d.timeTakenSec ?? getElapsedSec(),
        });
        // Optionally freeze timer:
        // useQuizStore.setState({ startTs: null });
      },
    });
  };

  if (isLoading)
    return (
      <div>
        <PageLoader />
      </div>
    );
  if (!total)
    return (
      <div>
        No Quiz available. <Button onClick={begin}>Start Quiz</Button>
      </div>
    );

  const progressPct = Math.round(((result ? total : index + 1) / total) * 100);

  return (
    <div className="space-y-6">
      {/* Header with progress & timer */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              {result ? (
                <>
                  Question <span className="font-semibold">{total}</span> of{" "}
                  {total}
                </>
              ) : hasStarted ? (
                <>
                  Question <span className="font-semibold">{index + 1}</span> of{" "}
                  {total}
                </>
              ) : (
                <>Ready</>
              )}
            </span>
            <span className="sr-only">{progressPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${hasStarted || result ? progressPct : 0}%` }}
            />
          </div>
        </div>

        {/* Timer pill */}
        <div className="shrink-0">
          {result ? (
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-indigo-700 shadow-sm">
              <Clock size={18} />
              <span className="text-lg font-semibold tabular-nums">
                {fmtTime(result.timeTaken)}
              </span>
            </div>
          ) : hasStarted ? (
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-indigo-700 shadow-sm">
              <Clock size={18} />
              <span className="text-lg font-semibold tabular-nums">
                <Timer startTs={startTs} />
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-gray-600 shadow-sm">
              <Clock size={18} />
              <span className="text-lg font-semibold tabular-nums">00:00</span>
            </div>
          )}
        </div>
      </div>

      {/* Start screen */}
      {!result && !hasStarted && (
        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <h2 className="text-3xl font-bold">Ready to start?</h2>
          <p className="mt-3 text-gray-600">
            You’ll have one continuous timer. Click{" "}
            <span className="font-medium">Start Quiz</span> to reveal the first
            question and begin timing.
          </p>
          <div className="mt-6">
            <Button
              className="btn btn-primary inline-flex items-center gap-2"
              onClick={begin}
            >
              <Play size={16} /> Start Quiz
            </Button>
          </div>
        </div>
      )}

      {/* Quiz body */}
      {!result && hasStarted && current && (
        <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-5 text-2xl font-semibold leading-snug">
            {current.text}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {current.options.map((opt: PublicOption, i: number) => {
              const key = optionKey(opt, i);
              const isSelected = selected === key;

              return (
                <label
                  key={key}
                  htmlFor={`${qId}-${key}`}
                  className={cn(
                    "group relative flex w-full cursor-pointer items-center gap-4 rounded-xl border p-4 transition",
                    "focus-within:ring-2 focus-within:ring-indigo-500",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-200 shadow-sm"
                      : "hover:border-indigo-400 hover:bg-indigo-50"
                  )}
                >
                  <input
                    id={`${qId}-${key}`}
                    type="radio"
                    name={qId}
                    checked={isSelected}
                    onChange={() => answer(qId, key)}
                    className="sr-only"
                  />

                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
                      isSelected
                        ? "border-indigo-600 bg-white text-indigo-700"
                        : "border-gray-300 bg-gray-50 text-gray-600 group-hover:border-indigo-400"
                    )}
                  >
                    {letters[i] ?? String(i + 1)}
                  </div>

                  <span className="text-base font-medium text-gray-900">
                    {opt.text}
                  </span>

                  {isSelected && (
                    <CheckCircle2
                      size={20}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600"
                      aria-hidden
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Result screen */}
      {result && (
        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <h2 className="text-3xl font-bold">Results</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label="Total" value={result.total} />
            <Stat
              label="Correct"
              value={result.correct}
              className="text-green-600"
            />
            <Stat label="Time" value={fmtTime(result.timeTaken)} />
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Button className="btn-primary" onClick={handleRetake}>
              Retake
            </Button>
            <a className="btn-ghost px-4 py-2 rounded-lg" href="/">
              Back to Home
            </a>
          </div>
        </div>
      )}

      {/* Footer nav (only while taking quiz) */}
      {!result && hasStarted && (
        <div className="flex items-center justify-between">
          <Button
            className="btn-ghost inline-flex items-center gap-2"
            onClick={prev}
            disabled={index === 0}
          >
            <ArrowLeft size={16} /> Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleEndNow}
              disabled={submitQuiz.isPending}
              title="End quiz and submit now"
            >
              End Quiz
            </Button>

            {index < total - 1 ? (
              <Button
                className="btn btn-primary inline-flex items-center gap-2"
                onClick={next}
              >
                Next <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                className="btn btn-primary inline-flex items-center gap-2"
                onClick={handleSubmit}
                disabled={submitQuiz.isPending}
              >
                {submitQuiz.isPending ? (
                  "Submitting…"
                ) : (
                  <>
                    <span>Submit</span> <Send size={16} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="rounded-xl border p-5">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className={cn("mt-1 text-3xl font-semibold", className)}>
        {value}
      </div>
    </div>
  );
}
