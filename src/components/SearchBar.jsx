export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari topik, deskripsi, atau nama dosen..."
        className="w-full rounded-xl pl-11 pr-4 py-3 bg-white text-slate-800 placeholder-slate-400 outline-none border border-slate-300 focus:border-red-600 focus:ring-2 focus:ring-red-100"
      />
    </div>
  );
}
