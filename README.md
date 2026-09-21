# Website Ide Riset

Vite React + Tailwind + Supabase. Public viewer for research topics (6 columns),
1 admin uploads Excel (replace total). UI mirrors `contoh/Beranda.png`.

## Prasyarat

- Node 24, npm
- Akun Supabase (free)

## Setup

```bash
cp .env.example .env
# isi .env:
# VITE_SUPABASE_URL=https://xyz.supabase.co
# VITE_SUPABASE_ANON_KEY=anon-key-here
npm install
```

## Database (Supabase Dashboard)

1. SQL Editor -> paste `supabase/schema.sql` -> Run (table + RLS + RPC `replace_ideas`).
2. SQL Editor -> paste `supabase/seed.sql` -> Run (5 rows dummy).
3. Table Editor -> cek 5 rows muncul di `research_ideas`.

## Buat user admin

Authentication -> Add user -> Create new user:

- Email: `prodis1tt@admin.local` (login pakai username `prodis1tt`, di-map ke email ini)
- Password: <rahasia, jangan commit>
- Auto Confirm User: ON

## Jalan lokal

```bash
npm run dev
# buka http://localhost:5173
# / = Beranda, /topik = daftar, /login = admin, /admin = upload Excel
```

## Format Excel upload

Header wajib (urutan bebas, case-insensitive):

`Judul Riset | Latar Belakang | Masalah/Problem | Permasalahan yang diselesaikan | Kode Dosen | Ketersediaan`

- Maks 2000 baris (lebihnya dipotong, ada peringatan).
- `Ketersediaan`: `Tersedia` tepat (case-insensitive) -> `Tersedia`, sisanya -> `Tidak Tersedia`.
- Replace total: hapus semua lama, ganti baru (konfirmasi dulu di dashboard).

## Build + deploy Vercel

```bash
npm run build
```

Vercel: import repo -> Framework Vite -> env `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY` -> Deploy. `public/bg-kampus.jpg` ikut ter-bundle.

## Struktur

- `src/pages/Home.jsx` (Beranda + logo + footer Powered-by), `Topics.jsx`,
  `Login.jsx`, `Admin.jsx`
- `src/components/Layout.jsx` (bg `/bg-kampus.jpg`), `TopicTable.jsx`,
  `SearchBar.jsx`, `Pagination.jsx`, `Badge.jsx`
- `src/lib/supabase.js`, `excel.js`, `auth.js`
- `supabase/schema.sql`, `seed.sql`
