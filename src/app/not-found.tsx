export default function NotFound() {
  return (
    <div className="text-center flex flex-col items-center gap-4 py-16">
      <span className="text-5xl">🔍</span>
      <h1 className="text-2xl font-bold" style={{ color: "var(--tc-primary)" }}>
        Page not found
      </h1>
      <p style={{ color: "var(--tc-text-muted)" }}>
        We couldn't find what you were looking for. No worries — let's get you back on track.
      </p>
      <a
        href="/"
        className="mt-2 px-6 py-3 rounded-xl font-semibold text-white inline-block"
        style={{ background: "var(--tc-primary)" }}
      >
        Go to the home page
      </a>
    </div>
  );
}
