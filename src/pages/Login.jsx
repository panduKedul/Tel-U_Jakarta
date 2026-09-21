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
        className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 w-full max-w-sm border border-white/30"
      >
        <h2 className="text-white text-2xl font-bold text-center">Login Admin</h2>
        <input
          value={u}
          onChange={(ev) => setU(ev.target.value)}
          placeholder="Username (prodis1tt)"
          className="w-full mt-4 rounded-xl p-3"
        />
        <input
          type="password"
          value={p}
          onChange={(ev) => setP(ev.target.value)}
          placeholder="Password"
          className="w-full mt-3 rounded-xl p-3"
        />
        {e && <p className="text-red-300 mt-2">{e}</p>}
        <button className="w-full mt-4 bg-blue-600 text-white rounded-xl py-3 font-bold">
          Masuk
        </button>
        <Link to="/topik" className="block text-center text-white mt-3 underline">
          Lihat Topik
        </Link>
      </form>
    </Layout>
  );
}
