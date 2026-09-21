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
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url(/bg-kampus.jpg)" }}>
      <div className="min-h-screen bg-slate-800/60 p-4">
        <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/10 rounded-3xl p-4 md:p-6 border border-white/20">
          <h1 className="text-white text-center text-xl font-bold">Topik Tugas Akhir</h1>
          <div className="mt-4">
            <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} />
          </div>
          {err && <p className="text-red-300 mt-3">Gagal muat: {err} <button onClick={() => window.location.reload()} className="underline">Retry</button></p>}
          {loading && <p className="text-white mt-3">Memuat…</p>}
          {!loading && (
            <div className="mt-4 backdrop-blur bg-white/10 rounded-2xl p-2 border border-white/10">
              <TopicTable rows={rows} start={start} />
            </div>
          )}
          <div className="flex flex-wrap justify-between items-center mt-3 gap-3 text-white">
            <label className="flex items-center gap-2 text-sm">
              Tampilkan
              <select value={per} onChange={(e) => { setPer(Number(e.target.value)); setPage(1); }} className="bg-white/20 rounded-full px-3 py-1 outline-none [&>option]:text-black">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
            <Pagination page={Math.min(page, pages)} pages={pages} onChange={setPage} />
          </div>
          <div className="flex justify-center mt-4">
            <Link to="/" className="bg-white/20 rounded-full px-5 py-2 text-white font-bold">← Kembali</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
