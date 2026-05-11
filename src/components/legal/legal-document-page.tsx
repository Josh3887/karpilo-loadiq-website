type LegalDocumentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  content: string;
  tone?: "red" | "sky";
};

function renderBlock(block: string) {
  const lines = block.split("\n");
  const listItems = lines
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => line.trim().slice(2));

  if (listItems.length === lines.length) {
    return (
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {listItems.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="mt-5 whitespace-pre-line leading-8 text-slate-300">
      {block}
    </p>
  );
}

export default function LegalDocumentPage({
  eyebrow,
  title,
  description,
  content,
  tone = "sky",
}: LegalDocumentPageProps) {
  const accent =
    tone === "red"
      ? "border-red-500/30 bg-red-500/10 text-red-200"
      : "border-sky-300/30 bg-sky-400/10 text-sky-200";
  const cardGlow =
    tone === "red"
      ? "shadow-[0_0_34px_rgba(239,68,68,0.08)]"
      : "shadow-[0_0_34px_rgba(56,189,248,0.08)]";
  const blocks = content
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(239,68,68,0.12),transparent_26%),linear-gradient(to_bottom,#020617,#020617)]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="mb-14">
          <div
            className={`inline-flex rounded-full border px-5 py-2 text-xs font-black uppercase tracking-[0.22em] ${accent}`}
          >
            {eyebrow}
          </div>

          <h1 className="mt-8 text-5xl font-black tracking-[-0.06em] sm:text-6xl">
            {title}
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            {description}
          </p>
        </div>

        <div className={`rounded-[2rem] border border-white/10 bg-[#0B1120]/80 p-8 ${cardGlow}`}>
          {blocks.map((block) => (
            <div key={block}>{renderBlock(block)}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
