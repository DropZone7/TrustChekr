"use client";

export default function TextSizeControl() {
  return (
    <div className="flex gap-2 items-center">
      <span>Text size:</span>
      <button
        className="px-2 py-1 rounded border border-[var(--tc-border)] hover:bg-[var(--tc-primary-soft)] cursor-pointer"
        onClick={() => (document.documentElement.className = "")}
      >A</button>
      <button
        className="px-2 py-1 rounded border border-[var(--tc-border)] hover:bg-[var(--tc-primary-soft)] font-semibold cursor-pointer"
        onClick={() => (document.documentElement.className = "text-lg")}
      >A+</button>
      <button
        className="px-2 py-1 rounded border border-[var(--tc-border)] hover:bg-[var(--tc-primary-soft)] font-bold cursor-pointer"
        onClick={() => (document.documentElement.className = "text-xl")}
      >A++</button>
    </div>
  );
}
