# Website Ide Riset — Progress Log

> Update: 2026-09-21. File ini sumber lanjutan progress. Baca dulu tiap lanjut kerja.

## Status
Web jadi lokal, Supabase project ada tapi schema BELUM di-Run, BELUM deploy Netlify.

## Link
- GitHub: https://github.com/panduKedul/Tel-U_Jakarta.git (branch `master`, push ok)
- Supabase project ref: `owxptmkxsubgpdozufrh` (https://owxptmkxsubgpdozufrh.supabase.co)
- Netlify: BELUM import (netlify.toml sudah di repo: build `npm run build`, publish `dist`, SPA redirect ok)
- Preview lokal: `http://localhost:5175/` (dev server detached, `node vite --port 5175`)

## Stack
Vite 5 + React 18 + Tailwind 3 + react-router 6 + supabase-js 2 + xlsx. Tema merah-putih + aksen slate (restyle 2390ee4, bukan tiruan contoh).

## Auth
1 admin, no signup. Username `prodis1tt` → map `prodis1tt@admin.local`. Password temp `prodis1tt` (pernah tertulis di chat → WAJIB ganti kuat after deploy). Secret hanya di `.env` lokal (gitignored) — JANGAN commit.

## Done
- [x] Scaffold, Supabase client + schema.sql + seed.sql + RLS + RPC `replace_ideas` locked (revoke anon, guard auth, pgcrypto)
- [x] Excel parse/validate/normalize + auth helper + test script PASS
- [x] Routes `/ /topik /login /admin`, Beranda + tabel 6 kolom + search + pagination 20 + badge + upload replace + modal confirm
- [x] Restyle merah-putih, footer hanya Telkom University Jakarta, hapus bg foto
- [x] Build PASS (89 modules), netlify.toml, push GitHub 12 commit

## Pending (urut)
1. [ ] Supabase SQL Editor: Run `supabase/schema.sql` lalu `supabase/seed.sql` → cek Table Editor 5 rows (terakhir cek: 404 table missing)
2. [ ] Auth → Users → Add user `prodis1tt@admin.local` / temp, Auto Confirm ON → ganti password kuat
3. [ ] Tes lokal: `npm run dev -- --port 5175` → `/topik` 5 rows → login → upload Excel replace
4. [ ] Netlify import repo → env `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` → deploy → trigger redeploy
5. [ ] Rotate password admin (temp bocor di chat)

## Resume dev
```
cd "E:\AI Agent\website_ide_riset"
npm run dev -- --port 5175   # 5173 dipakai project lain
```
`.env` sudah ada lokal. `git log --oneline` = 12 commit (terakhir 2390ee4 restyle).

## Rulings penting
- Upload Excel = replace total via RPC transaction (data lama aman bila gagal).
- RLS: select public, write authenticated only; RPC revoke anon/public.
- 6 kolom penuh + No (bukan 4 kolom contoh). Filter 5 field (tanpa ketersediaan).
- `.superpowers/` = scratch, tidak di-push. `contoh/` + `docs/` ikut repo.
