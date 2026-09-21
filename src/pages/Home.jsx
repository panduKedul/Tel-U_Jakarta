import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-10 w-full max-w-md text-center border border-white/30">
        <h1 className="text-4xl font-bold text-white">Welcome</h1>
        <p className="text-white mt-4 font-semibold">Sistem Ide Riset</p>
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
