import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getSession, logout } from "../lib/auth";
import { parseExcel } from "../lib/excel";
import Footer from "../components/Footer";

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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Cek sesi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-red-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-stripes" />
        <div className="relative max-w-4xl mx-auto px-4 py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-white text-xl font-extrabold">Dashboard Admin</h1>
            <p className="text-red-200 text-sm">{cnt} rows aktif</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              nav("/");
            }}
            className="bg-white/15 hover:bg-white/25 transition text-white rounded-xl px-4 py-2 text-sm font-bold"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <Link to="/topik" className="text-red-700 underline text-sm font-bold">
            Lihat Topik
          </Link>
          <label className="block mt-4 border-2 border-dashed border-slate-300 hover:border-red-600 transition rounded-xl p-6 text-center cursor-pointer">
            <span className="text-slate-700 font-bold">Pilih file Excel (.xlsx)</span>
            <span className="block text-slate-400 text-sm mt-1">{fileName || "Upload ganti seluruh data lama"}</span>
            <input
              type="file"
              accept=".xlsx"
              onChange={onFile}
              className="hidden"
            />
          </label>
          {msg && <p className="mt-3 text-sm text-slate-700 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2">{msg}</p>}
          {rows.length > 0 && (
            <div className="mt-4">
              <p className="font-bold text-slate-900">Preview 5 baris pertama:</p>
              <div className="overflow-x-auto mt-2 border border-slate-200 rounded-xl">
                <table className="w-full min-w-[800px] text-sm text-slate-800">
                  <thead>
                    <tr className="bg-red-700 text-white text-left">
                      <th className="p-2">Judul Riset</th>
                      <th className="p-2">Kode Dosen</th>
                      <th className="p-2">Ketersediaan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 5).map((r, i) => (
                      <tr key={i} className={"border-t border-slate-200 " + (i % 2 ? "bg-slate-50" : "bg-white")}>
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
                className="mt-3 bg-red-700 hover:bg-red-800 transition rounded-xl px-5 py-2 font-bold text-white"
              >
                Replace Total
              </button>
            </div>
          )}
        </div>
        <Footer />
      </main>
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <p className="font-bold text-slate-900">
              Hapus {cnt} lama, ganti {rows.length} baru?
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-slate-300 rounded-xl py-2 text-slate-700 font-bold"
              >
                Batal
              </button>
              <button
                onClick={doReplace}
                disabled={busy}
                className="flex-1 bg-red-700 rounded-xl py-2 font-bold text-white"
              >
                {busy ? "..." : "Ya, Replace"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
