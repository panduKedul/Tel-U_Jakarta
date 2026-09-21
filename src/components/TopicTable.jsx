import { useState } from "react";
import Badge from "./Badge";

function Cell({ t }) {
  const [o, setO] = useState(false);
  if (!t) return "-";
  return (
    <div>
      <p className={o ? "" : "line-clamp-3"}>{t}</p>
      <button onClick={() => setO(!o)} className="underline text-sm opacity-80 hover:opacity-100">
        {o ? "Sembunyikan" : "Baca selengkapnya"}
      </button>
    </div>
  );
}

export default function TopicTable({ rows, start = 0 }) {
  if (!rows.length) return <p className="text-white text-center p-6">Tidak ada topik ditemukan.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] text-white text-sm">
        <thead>
          <tr className="bg-blue-700/80 text-left">
            <th className="p-3">No</th>
            <th className="p-3">Judul Riset</th>
            <th className="p-3">Latar Belakang</th>
            <th className="p-3">Masalah</th>
            <th className="p-3">Permasalahan Diselesaikan</th>
            <th className="p-3">Kode Dosen</th>
            <th className="p-3">Ketersediaan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || start + i} className="border-t border-white/20 align-top">
              <td className="p-3">{start + i + 1}</td>
              <td className="p-3 font-bold">{r.judul_riset}</td>
              <td className="p-3"><Cell t={r.latar_belakang} /></td>
              <td className="p-3"><Cell t={r.masalah} /></td>
              <td className="p-3"><Cell t={r.permasalahan_diselesaikan} /></td>
              <td className="p-3">{r.kode_dosen || "-"}</td>
              <td className="p-3"><Badge v={r.ketersediaan} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
