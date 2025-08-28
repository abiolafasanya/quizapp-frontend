import type { Question, ID } from "@/types";

export default function QuizQuestion({
  q,
  selected,
  onSelect,
}: {
  q: Question;
  selected: ID | null;
  onSelect: (optionId: ID) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{q.text}</h2>
      <div className="space-y-2">
        {q.options.map((o) => (
          <label
            key={o.id}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name={q.id}
              checked={selected === o.id}
              onChange={() => onSelect(o.id)}
              className="h-4 w-4 text-primary-600"
            />
            <span>{o.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
