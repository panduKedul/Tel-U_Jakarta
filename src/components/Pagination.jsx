function pageList(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, 2, page - 1, page, page + 1, pages - 1, pages]);
  return [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
}

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null; // 0 hasil / muat 1 halaman: pager tak berguna
  const list = pageList(page, pages);
  const btn = (active) =>
    "w-8 h-8 rounded-lg text-sm " +
    (active
      ? "bg-red-700 text-white font-bold"
      : "bg-white text-slate-700 border border-slate-300 hover:border-red-600 hover:text-red-700");
  let prev = 0;
  return (
    <div className="flex gap-2 items-center">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg bg-white text-slate-700 border border-slate-300 disabled:opacity-40" aria-label="prev">‹</button>
      {list.map((n) => {
        const gap = prev && n - prev > 1;
        prev = n;
        return (
          <span key={n} className="flex gap-2 items-center">
            {gap && <span className="text-slate-400">…</span>}
            <button onClick={() => onChange(n)} className={btn(page === n)}>{n}</button>
          </span>
        );
      })}
      <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages} className="w-8 h-8 rounded-lg bg-white text-slate-700 border border-slate-300 disabled:opacity-40" aria-label="next">›</button>
    </div>
  );
}
