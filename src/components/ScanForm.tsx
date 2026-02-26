"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";

const scanTypes = [
  { id: "website", emoji: "🌐", label: "Check a website", placeholder: "Paste the website address here (e.g. www.example.com)" },
  { id: "message", emoji: "💬", label: "Check a message", placeholder: "Paste the suspicious message here" },
  { id: "other", emoji: "📱", label: "Phone, email, or other", placeholder: "Paste a phone number, email address, crypto address, or username" },
  { id: "romance", emoji: "💌", label: "Check a relationship", placeholder: "", isLink: true, href: "/romance" },
  { id: "file", emoji: "📎", label: "Upload a file", placeholder: "" },
];

export default function ScanForm({ onScan }: { onScan: (type: string, input: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const activeType = scanTypes.find((t) => t.id === selected);

  const handleTileClick = (type: typeof scanTypes[0]) => {
    if (type.isLink && type.href) {
      window.location.href = type.href;
      return;
    }
    setSelected(type.id);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Scan type tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {scanTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTileClick(t)}
            className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all cursor-pointer"
            style={{
              borderColor: selected === t.id ? "var(--tc-primary)" : "var(--tc-border)",
              background: selected === t.id ? "var(--tc-primary-soft)" : "var(--tc-surface)",
            }}
          >
            <span className="text-3xl">{t.emoji}</span>
            <span className="font-semibold text-sm text-center" style={{ color: "var(--tc-text-main)" }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Input area */}
      {activeType && activeType.id !== "file" && activeType.id !== "romance" && (
        <div className="flex flex-col gap-3 mt-2">
          <label className="font-medium" style={{ color: "var(--tc-text-main)" }}>
            Step 1 of 2: Paste what you want to check
          </label>

          {activeType.id === "message" ? (
            <textarea
              className="w-full min-h-[120px] p-4 rounded-xl border-2 text-base resize-y"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
              placeholder={activeType.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          ) : (
            <input
              type="text"
              className="w-full p-4 rounded-xl border-2 text-base"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
              placeholder={activeType.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && input.trim() && onScan(activeType.id, input.trim())}
            />
          )}

          <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
            🔒 We don't store what you paste. Your check stays private.
          </p>

          <button
            onClick={() => input.trim() && onScan(activeType.id, input.trim())}
            disabled={!input.trim()}
            className="w-full py-4 rounded-xl text-lg font-semibold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: input.trim() ? "var(--tc-primary)" : "var(--tc-border)" }}
          >
            Check this for me
          </button>
        </div>
      )}

      {/* Drop zone */}
      {selected === "file" && (
        <div className="flex flex-col gap-3 mt-2">
          <label className="font-medium" style={{ color: "var(--tc-text-main)" }}>
            Upload screenshots, chat exports, or documents to check
          </label>
          <FileUpload onFilesReady={() => {}} />
          <div className="p-4 rounded-xl text-center" style={{ background: "var(--tc-primary-soft)" }}>
            <p className="text-sm" style={{ color: "var(--tc-primary)" }}>
              📷 File scanning is coming soon. For now, try pasting the text from your screenshots or messages using the options above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
