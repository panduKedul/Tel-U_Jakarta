import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TopicTable from "../components/TopicTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import topics from "../data/topics.json";

export function filterTopics(all, q) {
  const needle = String(q || "").toLowerCase();
  if (!needle) return all;
  return all.filter((r) =>
    [r.judul, r.latar, r.masalah, r.target, r.kode_dosen]
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
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(20);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => filterTopics(topics, q), [q]);
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = String(a[sortKey] || "");
      const vb = String(b[sortKey] || "");
      const cmp = va.localeCompare(vb, "id");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);
  const { pages, rows } = paginate(sorted, page, per);
  const start = (Math.min(page, pages) - 1) * per;

  function onSort(key) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-red-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-stripes" />
        <div className="relative w-full px-6 py-6 flex items-center gap-4">
          <Link to="/" className="w-10 h-10 shrink-0 rounded-xl bg-white/15 hover:bg-white/25 transition text-white flex items-center justify-center text-xl font-bold" aria-label="Kembali">←</Link>
          <img src="/logo-telkom.png" alt="Telkom University" className="w-11 h-11 rounded-xl bg-white p-1 shrink-0" />
          <div>
            <h1 className="text-white text-xl font-extrabold">Topik Tugas Akhir</h1>
            <p className="text-red-200 text-sm">Telkom University Jakarta</p>
          </div>
        </div>
      </header>
      <main className="w-full px-6 py-6">
        <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} />
        <div className="mt-4 bg-white rounded-2xl p-2 border border-slate-200 shadow-sm">
          <TopicTable rows={rows} start={start} sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        </div>
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
        <Footer />
      </main>
    </div>
  );
}
