export default function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Cari topik, deskripsi, atau nama dosen..."
      className="w-full rounded-full p-3 bg-white/30 text-white placeholder-white/70 outline-none border border-white/30 focus:border-white/60"
    />
  );
}
