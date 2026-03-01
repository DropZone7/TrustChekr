"use client";

import { useState, useRef, useCallback } from "react";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: "queued" | "scanning" | "complete" | "error";
  preview?: string;
}

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
  "text/plain", "text/csv",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

export default function FileUpload({ onFilesReady }: { onFilesReady: (files: UploadedFile[]) => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((incoming: FileList | File[]) => {
    setError(null);
    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(incoming)) {
      if (files.length + newFiles.length >= MAX_FILES) {
        setError(`You can upload up to ${MAX_FILES} files at a time.`);
        break;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`"${file.name}" is not a supported file type. Try images, PDFs, or text files.`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError(`"${file.name}" is too large. Maximum file size is 10 MB.`);
        continue;
      }
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        status: "queued",
      });
    }

    if (newFiles.length > 0) {
      const updated = [...files, ...newFiles];
      setFiles(updated);
      onFilesReady(updated);
    }
  }, [files, onFilesReady]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesReady(updated);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Drop area */}
      <div
        className="relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
        style={{
          borderColor: dragOver ? "var(--tc-primary)" : "var(--tc-border)",
          background: dragOver ? "var(--tc-primary-soft)" : "var(--tc-surface)",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">{dragOver ? "" : ""}</span>
          <p className="font-semibold" style={{ color: "var(--tc-text-main)" }}>
            {dragOver ? "Drop files here" : "Drag files here to check them for scams"}
          </p>
          <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
            or click to choose files
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--tc-text-muted)" }}>
            Images, PDFs, or text files · Up to 10 MB each · Maximum {MAX_FILES} files
          </p>
        </div>
      </div>

      {/* Privacy note */}
      <p className="text-xs" style={{ color: "var(--tc-text-muted)" }}>
         Your files are analyzed locally and never stored on our servers.
        Please avoid uploading documents with passwords, banking details, or government IDs.
      </p>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg border" style={{ borderColor: "var(--tc-warning)", background: "var(--tc-surface)" }}>
          <p className="text-sm" style={{ color: "var(--tc-warning)" }}>{error}</p>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg">
                  {file.type.startsWith("image/") ? "" : file.type === "application/pdf" ? "" : ""}
                </span>
                <div className="min-w-0">
                  <p className="font-medium truncate" style={{ color: "var(--tc-text-main)" }}>
                    {file.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--tc-text-muted)" }}>
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full" style={{
                  background: file.status === "complete" ? "#eafaf1" : file.status === "error" ? "#fdedec" : "var(--tc-primary-soft)",
                  color: file.status === "complete" ? "var(--tc-safe)" : file.status === "error" ? "var(--tc-danger)" : "var(--tc-primary)",
                }}>
                  {file.status === "queued" ? "Ready" : file.status === "scanning" ? "Scanning…" : file.status === "complete" ? "Done" : "Failed"}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="text-lg cursor-pointer hover:opacity-60"
                  title="Remove file"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
