import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getSession, logout } from "../lib/auth";
import { parseExcel } from "../lib/excel";

export default function Admin() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");
  const [cnt, setCnt] = useState(0);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      if (!s) nav("/login");
      else {
        supabase
          .from("research_ideas")
          .select("*", { count: "exact", head: true })
          .then(({ count }) => setCnt(count || 0));
        setChecking(false);
      }
    });
  }, [nav]);

  async function onFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    setMsg("");
    const { rows, errors, truncated } = await parseExcel(f);
    if (!rows.length) {
      setMsg(errors.join("; "));
      setRows([]);
    } else {
      setRows(rows);
      setMsg(`${rows.length} baris siap. Klik Replace.${truncated ? " (Hanya 2000 baris pertama dipakai.)" : ""}`);
    }
  }

  async function doReplace() {
    setBusy(true);
    const { error } = await supabase.rpc("replace_ideas", { payload: rows });
    setBusy(false);
    setShowConfirm(false);
    if (error) setMsg(error.message);
    else {
      setMsg("Sukses replace.");
      setRows([]);
      setFileName("");
      supabase
        .from("research_ideas")
        .select("*", { count: "exact", head: true })
        .then(({ count }) => setCnt(count || 0));
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 max-w-4xl mx-auto">
        <p>Cek sesi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold">Dashboard Admin — {cnt} rows aktif</h1>
      <Link to="/topik" className="block mt-1 underline text-sm">
        Lihat Topik
      </Link>
      <input
        type="file"
        accept=".xlsx"
        onChange={onFile}
        className="mt-4"
      />
      {fileName && <p className="mt-1 text-sm text-white/70">{fileName}</p>}
      {msg && <p className="mt-2">{msg}</p>}
      {rows.length > 0 && (
        <div className="mt-4">
          <p className="font-bold">Preview 5 baris pertama:</p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full min-w-[800px] text-sm border border-white/20">
              <thead>
                <tr className="bg-blue-700/80 text-left">
                  <th className="p-2">Judul Riset</th>
                  <th className="p-2">Kode Dosen</th>
                  <th className="p-2">Ketersediaan</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((r, i) => (
                  <tr key={i} className="border-t border-white/20">
                    <td className="p-2">{r.judul_riset}</td>
                    <td className="p-2">{r.kode_dosen}</td>
                    <td className="p-2">{r.ketersediaan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="mt-3 bg-red-600 rounded-xl px-5 py-2 font-bold"
          >
            Replace Total
          </button>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-white/20">
            <p className="font-bold">
              Hapus {cnt} lama, ganti {rows.length} baru?
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-white/20 rounded-xl py-2"
              >
                Batal
              </button>
              <button
                onClick={doReplace}
                disabled={busy}
                className="flex-1 bg-red-600 rounded-xl py-2 font-bold"
              >
                {busy ? "..." : "Ya, Replace"}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={async () => {
          await logout();
          nav("/");
        }}
        className="block mt-6 underline"
      >
        Logout
      </button>
    </div>
  );
}
