import { useEffect, useState } from "react";

export default function Timer({ startTs }: { startTs: number | null }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startTs) return;
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startTs) / 1000)),
      250
    );
    return () => clearInterval(id);
  }, [startTs]);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return (
    <div className="text-sm font-semibold text-accent-600">
      {mm}:{ss}
    </div>
  );
}
