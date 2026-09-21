# Task 2 Report — Supabase Client + Schema SQL

- **Status:** DONE
- **Date:** 2026-09-21
- **Plan:** `docs/superpowers/plans/2026-09-21-website-ide-riset.md` Task 2 (Step 1-2 verbatim, Step 3 manual-verify via file, Step 4 commit)
- **Spec:** `docs/superpowers/specs/2026-09-21-website-ide-riset-design.md` §4 (table 6 kolom + RLS public read / admin write + RPC replace_ideas, seed 5 rows)

## Commits
- `224a102` feat: supabase client schema rls rpc (4 files: src/lib/supabase.js, .env.example, supabase/schema.sql, supabase/seed.sql)

## Files (verbatim plan)
- `src/lib/supabase.js`: `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)` singleton.
- `.env.example`: placeholders only (`https://xyz.supabase.co`, `anon-key-here`). No `.env` asli dibuat; `.gitignore` sudah cover `.env`.
- `supabase/schema.sql`: table `research_ideas` 6 kolom + `id uuid pk gen_random_uuid()` + `created_at`; check `ketersediaan in ('Tersedia','Tidak Tersedia')`; RLS enable + policy `public read` select true + `admin write` all authenticated; `idx_judul`; RPC `replace_ideas(jsonb)` security definer (delete + insert via `jsonb_populate_recordset`).
- `supabase/seed.sql`: 5 rows (NTN/DPS-Tidak Tersedia, Fuel Tank IoT/ERS, Ecola/ERS, Deteksi Pelanggaran AI/DHA, Banjir IoT LoRa/IHS-Tidak Tersedia).

## Test summary
- `node --check src/lib/supabase.js` + `createClient type=function`: PASS (SYNTAX_OK, supabase-js 2 resolve ok; full import tidak dieksekusi karena `import.meta.env` hanya ada di Vite, no live connection per instruksi).

## Dashboard paste (Step 3, tanpa koneksi live)
1. Supabase Dashboard → SQL Editor → New query → paste isi `supabase/schema.sql` → Run (buat table + RLS + index + RPC).
2. New query → paste `supabase/seed.sql` → Run → Table Editor `research_ideas` cek 5 rows muncul.
3. Lokal: `cp .env.example .env` lalu isi URL + anon key asli (jangan commit).

## Notes / deviations
- Nihil. Step 1-2 verbatim plan. `scripts/check-supabase.mjs` (plan Files/Test) tidak dibuat — verifikasi via `node --check` + resolve check + grep SQL per instruksi user.
- Seed row count via grep: 5 tuple lines (`^('`), cocok expected 5 rows.

## Concerns
- RPC `security definer` tanpa grant eksplisit: anon `rpc replace_ideas` bisa dipanggil siapa saja kecuali di-lock via Dashboard (revoke anon, grant authenticated) — tindak lanjut Task 6 saat wiring Admin.
- `gen_random_uuid()` butuh extension `pgcrypto` aktif di proyek Supabase (default on di proyek baru; jika error, enable via Dashboard → Database → Extensions).

## Fix round 1/5 — lock replace_ideas RPC (2026-09-21)
- Critical: `set search_path=public` di fungsi + `revoke all ... from anon, public` + `grant execute ... to authenticated`.
- Important: guard `if auth.role() != 'authenticated' then raise exception 'not allowed'; end if;` dalam body.
- Minor: baris 1 `create extension if not exists "pgcrypto";` untuk `gen_random_uuid()`.
- Scope: hanya `supabase/schema.sql` diubah. JS tidak disentuh → `node --check` skip.
- Test: grep PASS (pgcrypto, search_path, revoke, grant, auth.role guard semua match).
- Concern lama soal RPC open: FIXED. Sisa: re-paste `schema.sql` di Dashboard proyek yang sudah running versi lama (revoke/grant hanya efek setelah re-run).
