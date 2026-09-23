import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUsername } from "../lib/auth";
import { checkLoginAllowed, recordLoginFailure, recordLoginSuccess, formatWait } from "../lib/rateLimit";
import Layout from "../components/Layout";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [e, setE] = useState("");
  const [busy, setBusy] = useState(false);
  const [locked, setLocked] = useState(0);
  const nav = useNavigate();

  // Hitung mundur lockout biar tombol aktif lagi pas waktu habis
  useEffect(() => {
    if (locked <= 0) return;
    const t = setTimeout(() => setLocked((v) => Math.max(0, v - 1000)), 1000);
    return () => clearTimeout(t);
  }, [locked]);

  async function onSubmit(ev) {
    ev.preventDefault();
    if (busy) return; // cegah double-submit / spam klik
    const gate = checkLoginAllowed(u);
    if (!gate.allowed) {
      setLocked(gate.retryAfterMs);
      setE(`Terkunci sementara. Coba lagi dalam ${formatWait(gate.retryAfterMs)}.`);
      return;
    }
    setBusy(true);
    setE("");
    const { error } = await loginUsername(u, p);
    setBusy(false);
    if (error) {
      const r = recordLoginFailure(u);
      if (r.lockMs > 0) {
        setLocked(r.lockMs);
        setE(`Terlalu banyak gagal. Terkunci ${formatWait(r.lockMs)}.`);
      } else {
        setE(error.message);
      }
    } else {
      recordLoginSuccess(u);
      nav("/admin");
    }
  }

  return (
    <Layout>
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-3xl p-8 w-full max-w-sm border border-slate-200 shadow-2xl"
      >
        <div className="mx-auto w-12 h-12 rounded-xl bg-red-700 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-slate-900 text-2xl font-extrabold text-center mt-4">Login Admin</h2>
        <input
          value={u}
          onChange={(ev) => setU(ev.target.value)}
          placeholder="Username"
          autoComplete="username"
          className="w-full mt-5 rounded-xl p-3 border border-slate-300 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 text-slate-800"
        />
        <input
          type="password"
          value={p}
          onChange={(ev) => setP(ev.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full mt-3 rounded-xl p-3 border border-slate-300 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 text-slate-800"
        />
        {e && <p className="text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mt-3 text-sm">{e}</p>}
        <button
          disabled={busy || locked > 0}
          className="w-full mt-4 bg-red-700 hover:bg-red-800 transition text-white rounded-xl py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Memeriksa..." : locked > 0 ? "Terkunci" : "Masuk"}
        </button>
        <Link to="/topik" className="block text-center text-slate-500 hover:text-red-700 mt-3 text-sm underline">
          Lihat Topik
        </Link>
      </form>
    </Layout>
  );
}
