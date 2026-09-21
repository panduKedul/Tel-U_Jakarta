export default function Badge({ v }) {
  const ok = v === "Tersedia";
  return (
    <span
      className={
        "inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap " +
        (ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")
      }
    >
      {v}
    </span>
  );
}
