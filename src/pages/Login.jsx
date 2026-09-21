import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUsername } from "../lib/auth";
import Layout from "../components/Layout";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [e, setE] = useState("");
  const nav = useNavigate();

  return (
    <Layout>
      <form
        onSubmit={async (ev) => {
          ev.preventDefault();
          setE("");
          const { error } = await loginUsername(u, p);
          if (error) setE(error.message);
          else nav("/admin");
        }}
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
          placeholder="Username (prodis1tt)"
          className="w-full mt-5 rounded-xl p-3 border border-slate-300 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 text-slate-800"
        />
        <input
          type="password"
          value={p}
          onChange={(ev) => setP(ev.target.value)}
          placeholder="Password"
          className="w-full mt-3 rounded-xl p-3 border border-slate-300 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 text-slate-800"
        />
        {e && <p className="text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mt-3 text-sm">{e}</p>}
        <button className="w-full mt-4 bg-red-700 hover:bg-red-800 transition text-white rounded-xl py-3 font-bold">
          Masuk
        </button>
        <Link to="/topik" className="block text-center text-slate-500 hover:text-red-700 mt-3 text-sm underline">
          Lihat Topik
        </Link>
      </form>
    </Layout>
  );
}
