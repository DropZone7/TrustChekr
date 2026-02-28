"use client";

import { useState } from "react";

export default function HighContrastToggle() {
  const [high, setHigh] = useState(false);

  const toggle = () => {
    setHigh(!high);
    if (!high) {
      document.documentElement.style.setProperty("--tc-bg", "#000000");
      document.documentElement.style.setProperty("--tc-surface", "#1a1a1a");
      document.documentElement.style.setProperty("--tc-text-main", "#ffffff");
      document.documentElement.style.setProperty("--tc-text-muted", "#cccccc");
      document.documentElement.style.setProperty("--tc-border", "#444444");
      document.documentElement.style.setProperty("--tc-primary-soft", "#1a3a5c");
    } else {
      document.documentElement.style.setProperty("--tc-bg", "#fafafa");
      document.documentElement.style.setProperty("--tc-surface", "#ffffff");
      document.documentElement.style.setProperty("--tc-text-main", "#1c1c1e");
      document.documentElement.style.setProperty("--tc-text-muted", "#5d6d7e");
      document.documentElement.style.setProperty("--tc-border", "#d5d8dc");
      document.documentElement.style.setProperty("--tc-primary-soft", "#fde8e8");
    }
  };

  return (
    <button
      onClick={toggle}
      className="px-2 py-1 rounded border text-sm cursor-pointer"
      style={{ borderColor: "var(--tc-border)", color: "var(--tc-text-muted)" }}
      title={high ? "Switch to normal contrast" : "Switch to high contrast"}
    >
      {high ? "☀️" : "🌙"}
    </button>
  );
}
