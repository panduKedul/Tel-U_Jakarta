# Website Ide Riset — Progress Log

> Update: 2026-09-21 malam. File ini sumber lanjutan progress. Baca dulu tiap lanjut kerja.

## Status
LIVE https://telujakarta-listjudulriset.netlify.app — 3 data, sort + full-bleed tabel.
PIVOT: database (Supabase) + login PENDING. Sumber data = `src/data/topics.json` manual.
SOP: user kirim data → append JSON → build → commit → push → Netlify auto redeploy.

## Link
- GitHub: https://github.com/panduKedul/Tel-U_Jakarta.git (branch `master`)
- Netlify: https://telujakarta-listjudulriset.netlify.app (connect GitHub, auto deploy push master)
- Supabase ref: `owxptmkxsubgpdozufrh` (PENDING, schema BELUM di-Run — terakhir cek 404 table missing)

## Stack
Vite 5 + React 18 + Tailwind 3 + react-router 6 + supabase-js 2 + xlsx (lib pending).
Tema merah-putih + slate, logo `public/logo-telkom.png`, footer hanya Telkom University Jakarta.

## Data (3 baris)
1. MIMO-GFDM Beyond 5G — AGG — Tersedia (masalah + target 6 poin terisi)
2. Image Compression with Automatic Denoising — TAV — Tersedia
3. AI-Based Image Compression Untuk IoT — TAV — Tersedia
Format: `{judul, latar, masalah, target, kode_dosen, ketersediaan}`. Kosong → `-`.

## Done
- [x] Scaffold + Supabase client/schema/seed/RLS/RPC locked (pending pakai)
- [x] Excel/auth helper + test PASS (pending pakai)
- [x] Routes, tabel 7 kolom (Nomor, Judul Topik, Latar Belakang, Masalah, Target Solusi, Kode Dosen, Ketersediaan)
- [x] Search, pagination 10/20/50, sort judul/kode/ketersediaan (klik header, asc→desc→reset)
- [x] Restyle merah-putih, logo Telkom, login hidden, full-bleed tabel 1600px
- [x] netlify.toml, supabase no-crash tanpa env, push GitHub, Netlify live 200

## Pending
1. [ ] DATA: append via chat atau GitHub web edit (template di README)
2. [ ] (PENDING) Aktifkan Supabase: Run schema+seed, buat user `prodis1tt@admin.local`, isi Netlify env
3. [ ] (PENDING) Aktifkan login/admin-upload lagi bila perlu
4. [ ] Rotate password admin temp (pernah tertulis di chat)

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
