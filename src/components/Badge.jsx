export default function Badge({ v }) {
  const ok = v === "Tersedia";
  return <span className={ok ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{v}</span>;
}
