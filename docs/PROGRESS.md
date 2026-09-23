# Website Ide Riset — Progress Log

> Update: 2026-09-23. File ini sumber lanjutan progress. Baca dulu tiap lanjut kerja.

## Status
LIVE https://telujakarta-listjudulriset.netlify.app — 12 data (8 TAV + 4 KLA).
PIVOT: database (Supabase) + login PENDING. Sumber data = `src/data/topics.json` manual.
SOP: user kirim data → append JSON → build → commit → push → Netlify auto redeploy.

## Link
- GitHub: https://github.com/panduKedul/Tel-U_Jakarta.git (branch `master`)
- Netlify: https://telujakarta-listjudulriset.netlify.app (connect GitHub, auto deploy push master)
- Supabase ref: `owxptmkxsubgpdozufrh` (PENDING, schema BELUM di-Run — terakhir cek 404 table missing)

## Stack
Vite 5 + React 18 + Tailwind 3 + react-router 6 + supabase-js 2 + xlsx (lib pending).
Tema merah-putih + slate, logo `public/logo-telkom.png`, footer `@2026 S1 Teknik Telekomunikasi` di /topik + /admin.

## Data (12 baris, `src/data/topics.json`)
- TAV (8, Tersedia): Image Compression Denoising, AI Image Compression IoT, Traffic Graph Theory, Point Cloud SR, Obstacle Detection Robot, Monitoring Pertanian, Denoising Comparison, Monitoring Lingkungan IoT.
- KLA (4): HydroFuture — Penuh, EcoSortX — Tersedia, GlucoWave — Penuh, Telemetri Air-to-Ground — Tersedia.
- Dihapus: MIMO-GFDM (AGG) atas permintaan user.
Format: `{judul, latar, masalah, target, kode_dosen, ketersediaan}`. Kosong → `-`.

## Done
- [x] Scaffold + Supabase client/schema/seed/RLS/RPC locked (pending pakai)
- [x] Excel/auth helper + test PASS (pending pakai)
- [x] Routes, tabel 8 kolom (Nomor, Tanggal, Judul Topik, Latar Belakang, Masalah, Target Solusi, Kode Dosen, Ketersediaan)
- [x] Search, pagination 10/20/50, sort tanggal/judul/kode/ketersediaan (klik header, asc→desc→reset)
- [x] Restyle merah-putih, logo Telkom, login hidden, full-bleed tabel 1600px
- [x] netlify.toml, supabase no-crash tanpa env, push GitHub, Netlify live 200
- [x] Footer `@2026 S1 Teknik Telekomunikasi` (/topik + /admin)
- [x] Security lapis 1: headers + CSP di netlify.toml
- [x] Security lapis 2: login rate-limit + lockout (`src/lib/rateLimit.js`, unit-test manual via node)
- [x] Audit 2026-09-23: schema hardened (role admin + validasi 1-2000 baris + length caps),
  username disamarkan, jejak kredensial di docs dibersihkan, CSP + object-src none
- [x] `npm test` (scripts/test-excel.mjs) terdaftar di package.json

## Pending
1. [ ] DATA: append via chat atau GitHub web edit (template di README)
2. [ ] (PENDING) Aktifkan Supabase: matikan public signup, buat user admin (role `admin` di user_metadata), Run schema+seed, isi Netlify env
3. [ ] (PENDING) Aktifkan login/admin-upload lagi bila perlu
4. [ ] Rotasi kredensial admin berkala (password generator, simpan di password manager)

## Resume dev
```
cd "E:\AI Agent\website_ide_riset"
node node_modules\vite\bin\vite.js --port 5175
```
`.env` lokal ada (gitignored). Background dev server mati antar sesi shell — jalanin manual.

## Rulings
- JSON sumber kebenaran; duplikat judul (case-insensitive) ditolak.
- Typo kecil user dibetulkan diam-diam + dilaporkan di chat.
- Upload Excel replace-total via RPC bila DB aktif lagi.
- `.superpowers/` scratch tak di-push. `contoh/` + `docs/` ikut repo.
