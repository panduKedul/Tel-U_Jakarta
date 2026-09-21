import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-10 w-full max-w-md text-center border border-white/30">
        <h1 className="text-4xl font-bold text-white">Welcome</h1>
        <div className="mx-auto mt-5 w-16 h-16 rounded-full bg-blue-600/80 border-2 border-white/60 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 20V9l8-5 8 5v11" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-white mt-4 font-semibold">PTA/TA Management System</p>
        <p className="text-white/80 text-sm mt-1">Sistem Ide Riset</p>
        <Link
          to="/login"
          className="block mt-6 bg-blue-600 text-white rounded-xl py-3 font-bold"
        >
          Login
        </Link>
        <Link
          to="/topik"
          className="block mt-3 bg-white/30 text-white rounded-xl py-3 font-bold"
        >
          Lihat Topik
        </Link>
      </div>
    </Layout>
  );
}
