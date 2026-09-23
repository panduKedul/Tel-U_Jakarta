# Website Ide Riset — Telkom University Jakarta

Live: https://telujakarta-listjudulriset.netlify.app

Vite React + Tailwind. Daftar topik tugas akhir 8 kolom, data dari JSON lokal.
Tema merah-putih + aksen slate. Login + database (Supabase) PENDING.

## Tambah data (tanpa terminal)

1. GitHub repo → `src/data/topics.json` → Edit (pensil).
2. Tambah objek sebelum `]` penutup (koma setelah objek sebelumnya):

```json
,
{
  "judul": "...",
  "latar": "...",
  "masalah": "... (boleh kosong, tampil -)",
  "target": "... (\n untuk baris baru)",
  "kode_dosen": "...",
  "ketersediaan": "Tersedia",
  "tanggal": "September 2026"
}
```

3. Commit changes → Netlify auto redeploy ±1 menit → cek `/topik`.
4. Build gagal = JSON typo (koma/kutip) → benerin, commit lagi.

Atau paste data ke chat, maintainer yang append + push.

## Fitur `/topik`

- Search semua kolom teks, pagination 10/20/50.
- Sort: klik header Tanggal / Judul Topik / Kode Dosen / Ketersediaan (asc → desc → reset).
- Cell panjang: line-clamp + Baca selengkapnya. Badge Tersedia hijau / selain itu (Penuh, Tidak Tersedia) merah.
- Tabel full-bleed (min 1600px), scroll horizontal di layar kecil.
- Footer `@2026 S1 Teknik Telekomunikasi - Telkom University Jakarta` di `/topik` + `/admin`.
- Proteksi: security headers + CSP (edge), login rate-limit + lockout brute-force.

## Jalan lokal

```bash
cd "E:\AI Agent\website_ide_riset"
npm install
node node_modules\vite\bin\vite.js --port 5175   # 5173 dipakai project lain
# /=Beranda, /topik=daftar (/login + /admin ada tapi pending/disembunyikan)
```

## Deploy Netlify

Import repo GitHub → preset dari `netlify.toml` (build `npm run build`,
publish `dist`, SPA redirect `/*` → `/index.html`). Auto deploy tiap push `master`.

## Struktur

- `src/data/topics.json` — DATA (sumber kebenaran saat ini)
- `src/pages/Home.jsx`, `Topics.jsx` (+ `Login.jsx` rate-limit, `Admin.jsx` pending DB)
- `src/components/TopicTable.jsx`, `SearchBar.jsx`, `Pagination.jsx`, `Badge.jsx`, `Layout.jsx`, `Footer.jsx`
- `src/lib/` — `supabase.js` (pending, no-crash tanpa env), `excel.js`, `auth.js` (pending), `rateLimit.js` (lockout login)
- `scripts/test-excel.mjs` — test via `npm test`
- `supabase/` — `schema.sql`, `seed.sql` (pending, belum di-Run)
- `public/logo-telkom.png` — logo (sumber `contoh/aset/`)
- `docs/PROGRESS.md` — log progress lanjutan
