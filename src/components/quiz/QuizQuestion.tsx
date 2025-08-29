import { useMemo } from "react";
import type { PublicQuestion as Question, ID } from "@/types";

export default function QuizQuestion({
  q,
  selected,
  onSelect,
  disabled = false,
}: {
  q: Question;
  selected: ID | null;
  onSelect: (optionId: ID) => void;
  disabled?: boolean;
}) {
  // Radio names must be strings; keep it stable per-question
  const groupName = useMemo(() => `q-${String(q.id)}`, [q.id]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{q.text}</h2>

      <div className="space-y-2">
        {q.options.map((o) => {
          const inputId = `${groupName}-opt-${String(o.id)}`;
          const isSelected = selected === o.id;

          return (
            <div
              key={o.id} // ✅ stable key
              className={[
                "flex items-center gap-3 p-3 border rounded-lg cursor-pointer",
                isSelected
                  ? "border-primary-500 bg-primary-50"
                  : "hover:bg-gray-50",
                disabled ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
              onClick={() => !disabled && onSelect(o.id as ID)} // ✅ stable reference
              tabIndex={0}
              role="radio"
              aria-checked={isSelected}
            >
              <input
                id={inputId}
                type="radio"
                name={groupName} // ✅ string
                value={String(o.id)}
                checked={isSelected}
                onChange={() => onSelect(o.id as ID)} // keeps controlled input happy
                disabled={disabled}
                className="h-4 w-4 text-primary-600"
              />
              <label htmlFor={inputId} className="select-none">
                {o.text}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
