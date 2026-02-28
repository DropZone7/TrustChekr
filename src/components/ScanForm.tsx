"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { useBotDetection } from "@/hooks/useBotDetection";

const scanTypes = [
  { id: "website", label: "Website", placeholder: "Paste the URL (e.g. www.example.com)" },
  { id: "message", label: "Message", placeholder: "Paste the suspicious text message or email" },
  { id: "other", label: "Phone / Email / Crypto", placeholder: "Paste a phone number, email, crypto address, or username" },
  { id: "romance", label: "Relationship", placeholder: "", isLink: true, href: "/romance" },
  { id: "file", label: "Upload", placeholder: "" },
];

export default function ScanForm({ onScan }: { onScan: (type: string, input: string, botProfile?: any) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const { onKeyDown: botKeyDown, onMouseMove: botMouseMove, getProfile } = useBotDetection();

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
    <div className="flex flex-col gap-4" onMouseMove={botMouseMove as any}>
      {/* Scan type selector — pill buttons, not emoji cards */}
      <div className="flex flex-wrap gap-2">
        {scanTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTileClick(t)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
            style={{
              border: `2px solid ${selected === t.id ? "var(--tc-primary)" : "var(--tc-border)"}`,
              background: selected === t.id ? "var(--tc-primary)" : "var(--tc-surface)",
              color: selected === t.id ? "white" : "var(--tc-text-main)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      {activeType && activeType.id !== "file" && activeType.id !== "romance" && (
        <div className="flex flex-col gap-3">
          {activeType.id === "message" ? (
            <textarea
              className="w-full min-h-[120px] p-4 rounded-lg border text-base resize-y"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
              placeholder={activeType.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={botKeyDown as any}
              autoFocus
            />
          ) : (
            <input
              type="text"
              className="w-full p-4 rounded-lg border text-base"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)", color: "var(--tc-text-main)" }}
              placeholder={activeType.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { botKeyDown(); if (e.key === "Enter" && input.trim()) onScan(activeType.id, input.trim(), getProfile()); }}
              autoFocus
            />
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: "var(--tc-text-muted)" }}>
              We don't store what you paste.
            </p>
            <button
              onClick={() => input.trim() && onScan(activeType.id, input.trim(), getProfile())}
              disabled={!input.trim()}
              className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: input.trim() ? "var(--tc-primary)" : "var(--tc-border)" }}
            >
              Check this
            </button>
          </div>
        </div>
      )}

      {/* File upload */}
      {selected === "file" && (
        <div className="flex flex-col gap-3">
          <FileUpload onFilesReady={() => {}} />
          <p className="text-sm p-3 rounded-lg" style={{ background: "var(--tc-surface)", border: "1px solid var(--tc-border)", color: "var(--tc-text-muted)" }}>
            File scanning coming soon. For now, paste the text from your screenshots using the Message option.
          </p>
        </div>
      )}
    </div>
  );
}
