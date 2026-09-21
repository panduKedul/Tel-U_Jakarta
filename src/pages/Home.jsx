import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="bg-white rounded-3xl p-10 w-full max-w-md text-center border border-slate-200 shadow-2xl">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-700 flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 19h6M10 22h4" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-5">Sistem Ide Riset</h1>
        <p className="text-slate-500 text-sm mt-1">Telkom University Jakarta</p>
        <div className="h-1 w-16 bg-red-700 rounded-full mx-auto mt-4" />
        <Link
          to="/login"
          className="block mt-6 bg-red-700 hover:bg-red-800 transition text-white rounded-xl py-3 font-bold"
        >
          Login Admin
        </Link>
        <Link
          to="/topik"
          className="block mt-3 border-2 border-slate-300 hover:border-red-700 hover:text-red-700 transition text-slate-700 rounded-xl py-3 font-bold"
        >
          Lihat Topik
        </Link>
      </div>
    </Layout>
  );
}
