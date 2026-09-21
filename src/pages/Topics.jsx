import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import TopicTable from "../components/TopicTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";

export function filterTopics(all, q) {
  const needle = String(q || "").toLowerCase();
  if (!needle) return all;
  return all.filter((r) =>
    [r.judul_riset, r.latar_belakang, r.masalah, r.permasalahan_diselesaikan, r.kode_dosen]
      .join(" ")
      .toLowerCase()
      .includes(needle)
  );
}

export function paginate(list, page, per) {
  const pages = Math.max(1, Math.ceil(list.length / per));
  const safe = Math.min(Math.max(1, page), pages);
  return { pages, page: safe, rows: list.slice((safe - 1) * per, safe * per) };
}

export default function Topics() {
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(20);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("research_ideas")
      .select("*")
      .order("created_at")
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setAll(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => filterTopics(all, q), [all, q]);
  const { pages, rows } = paginate(filtered, page, per);
  const start = (Math.min(page, pages) - 1) * per;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-red-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-stripes" />
        <div className="relative max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <Link to="/" className="w-10 h-10 shrink-0 rounded-xl bg-white/15 hover:bg-white/25 transition text-white flex items-center justify-center text-xl font-bold" aria-label="Kembali">←</Link>
          <div>
            <h1 className="text-white text-xl font-extrabold">Topik Tugas Akhir</h1>
            <p className="text-red-200 text-sm">Telkom University Jakarta</p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} />
        {err && <p className="text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">Gagal muat: {err} <button onClick={() => window.location.reload()} className="underline font-bold">Retry</button></p>}
        {loading && <p className="text-slate-500 mt-4">Memuat…</p>}
        {!loading && (
          <div className="mt-4 bg-white rounded-2xl p-2 border border-slate-200 shadow-sm">
            <TopicTable rows={rows} start={start} />
          </div>
        )}
        <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Tampilkan
            <select value={per} onChange={(e) => { setPer(Number(e.target.value)); setPage(1); }} className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-red-600 text-slate-800">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
          <Pagination page={Math.min(page, pages)} pages={pages} onChange={setPage} />
        </div>
      </main>
    </div>
  );
}
