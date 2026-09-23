# Website Ide Riset — Progress Log

> Update: 2026-09-23 sore. File ini sumber lanjutan progress. Baca dulu tiap lanjut kerja.

## Status
LIVE https://telujakarta-listjudulriset.netlify.app — 12 data (8 TAV + 4 KLA).
PIVOT: database (Supabase) + login PENDING. Sumber data = `src/data/topics.json` manual.
SOP: edit spreadsheet kurator → web update otomatis (fetch gviz tiap buka /topik).
`src/data/topics.json` = fallback offline. SOP lama (append JSON via chat) pensiun.

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
Format: `{judul, latar, masalah, target, kode_dosen, ketersediaan, tanggal}`. Kosong → `-`.
`tanggal` = bulan + tahun input (mis. `September 2026`).

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
- [x] Pager sembunyi bila hasil <= 1 halaman (tak berguna ditampilkan)
- [x] Fix `/admin` gantung "Cek sesi..." bila backend tak tersambung → redirect `/login`
- [x] Audit ronde 2 (attacker-side): bundle live cuma berisi placeholder Supabase
  (= DB attack surface mati/fail-closed), header edge terkonfirmasi live,
  nol `innerHTML`/`eval`/link-keluar. Sisa risiko real: takeover akun GitHub/Netlify
  → anjuran 2FA + branch protection + deploy notification (di luar repo)
- [x] Footer beranda jadi link: Telkom University Jakarta → bte-jkt Tel-U,
  Developed by Muhammad Pandu Wirakusuma → resume-pandu (tab baru, rel noopener)
- [x] Audit ronde 3: 6 serangan gagal (curi kunci bundle, intip /.env-/.git-/netlify.toml-,
  XSS search, link luar, open redirect, bypass pager). Catatan: trust pihak ke-3
  (2 situs luar) + nama pribadi publik. Risiko utama tetap takeover akun GitHub/Netlify.
- [x] Sheet-sync live: /topik fetch gviz spreadsheet gabungan (`src/lib/sheets.js`,
  parser teruji 12 baris data asli), JSON fallback, label sumber, CSP +docs.google.com.
  Aturan sheet: kolom per indeks (1=Dosen 2=Judul 3=Latar 4=Masalah 5=Tujuan 6=Tanggal 7=Status),
  baris tanpa judul di-skip. Ganti header kol-6 jadi "Tanggal" bila sempat.

## Pending
1. [ ] DATA: append via chat atau GitHub web edit (template di README)
2. [ ] (PENDING) Aktifkan Supabase: matikan public signup, buat user admin (role `admin` di user_metadata),
  nyalakan CAPTCHA + rate limit, Run schema+seed (versi hardened), isi Netlify env.
  Setelah tersambung → minta audit ronde 3 (uji signup liar + RPC).
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
- `.superpowers/` gitignored (sebagian laporan lama sempat ke-commit sebelum ignore). `contoh/` + `docs/` ikut repo.
