import { useState } from "react";
import Badge from "./Badge";

function Cell({ t }) {
  const [o, setO] = useState(false);
  if (!t) return "-";
  return (
    <div>
      <p className={o ? "" : "line-clamp-3"}>{t}</p>
      <button onClick={() => setO(!o)} className="text-red-700 underline text-sm hover:text-red-800">
        {o ? "Sembunyikan" : "Baca selengkapnya"}
      </button>
    </div>
  );
}

export default function TopicTable({ rows, start = 0 }) {
  if (!rows.length) return <p className="text-slate-500 text-center p-6">Tidak ada topik ditemukan.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] text-slate-800 text-sm">
        <thead>
          <tr className="bg-red-700 text-white text-left">
            <th className="p-3 rounded-tl-xl">No</th>
            <th className="p-3">Judul Riset</th>
            <th className="p-3">Latar Belakang</th>
            <th className="p-3">Masalah</th>
            <th className="p-3">Permasalahan Diselesaikan</th>
            <th className="p-3">Kode Dosen</th>
            <th className="p-3 rounded-tr-xl">Ketersediaan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || start + i} className={"border-t border-slate-200 align-top " + (i % 2 ? "bg-slate-50" : "bg-white")}>
              <td className="p-3 text-slate-500">{start + i + 1}</td>
              <td className="p-3 font-bold text-slate-900">{r.judul_riset}</td>
              <td className="p-3"><Cell t={r.latar_belakang} /></td>
              <td className="p-3"><Cell t={r.masalah} /></td>
              <td className="p-3"><Cell t={r.permasalahan_diselesaikan} /></td>
              <td className="p-3 font-mono text-sm">{r.kode_dosen || "-"}</td>
              <td className="p-3"><Badge v={r.ketersediaan} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
