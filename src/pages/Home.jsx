import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="bg-white rounded-3xl p-10 w-full max-w-md text-center border border-slate-200 shadow-2xl">
        <img src="/logo-telkom.png" alt="Telkom University" className="mx-auto w-20 h-20 rounded-2xl object-contain bg-white" />
        <h1 className="text-3xl font-extrabold text-slate-900 mt-5">Sistem Ide Riset</h1>
        <p className="text-slate-500 text-sm mt-1">Telkom University Jakarta</p>
        <div className="h-1 w-16 bg-red-700 rounded-full mx-auto mt-4" />
        {/* Login pending: tombol disembunyikan, route /login tetap ada */}
        <Link
          to="/topik"
          className="block mt-6 bg-red-700 hover:bg-red-800 transition text-white rounded-xl py-3 font-bold"
        >
          Lihat Topik
        </Link>
      </div>
    </Layout>
  );
}
