import { useState } from "react";
import Badge from "./Badge";

function Cell({ t }) {
  const [o, setO] = useState(false);
  if (!t) return <span className="text-slate-400">-</span>;
  return (
    <div>
      <p className={"whitespace-pre-line " + (o ? "" : "line-clamp-3")}>{t}</p>
      <button onClick={() => setO(!o)} className="text-red-700 underline text-sm hover:text-red-800">
        {o ? "Sembunyikan" : "Baca selengkapnya"}
      </button>
    </div>
  );
}

export default function TopicTable({ rows, start = 0, sortKey, sortDir, onSort }) {
  if (!rows.length) return <p className="text-slate-500 text-center p-6">Tidak ada topik ditemukan.</p>;
  const arrow = (key) => {
    if (sortKey !== key) return <span className="text-white/50"> ↕</span>;
    return sortDir === "asc" ? <span> ▲</span> : <span> ▼</span>;
  };
  const th = "p-3";
  const thSort = th + " cursor-pointer select-none hover:bg-red-800 whitespace-nowrap";
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1600px] text-slate-800 text-sm">
        <thead>
          <tr className="bg-red-700 text-white text-left">
            <th className="p-3 rounded-tl-xl">Nomor</th>
            <th className={thSort} onClick={() => onSort("judul")}>Judul Topik{arrow("judul")}</th>
            <th className={th}>Latar Belakang</th>
            <th className={th}>Masalah</th>
            <th className={th}>Target Solusi</th>
            <th className={thSort} onClick={() => onSort("kode_dosen")}>Kode Dosen{arrow("kode_dosen")}</th>
            <th className={thSort + " rounded-tr-xl"} onClick={() => onSort("ketersediaan")}>Ketersediaan{arrow("ketersediaan")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || start + i} className={"border-t border-slate-200 align-top " + (i % 2 ? "bg-slate-50" : "bg-white")}>
              <td className="p-3 text-slate-500">{start + i + 1}</td>
              <td className="p-3 font-bold text-slate-900">{r.judul}</td>
              <td className="p-3"><Cell t={r.latar} /></td>
              <td className="p-3"><Cell t={r.masalah} /></td>
              <td className="p-3"><Cell t={r.target} /></td>
              <td className="p-3 font-mono text-sm">{r.kode_dosen || "-"}</td>
              <td className="p-3"><Badge v={r.ketersediaan} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
