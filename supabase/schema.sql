-- Skema research_ideas — HARDENED (audit 2026-09-23).
--
-- WAJIB sebelum Run di Supabase SQL Editor (dashboard, tak bisa dari repo):
-- 1. Authentication > Sign Up: DISABLE "Allow new users to sign up"
--    (tanpa ini, siapa saja daftar lalu hapus total via RPC).
-- 2. Authentication > Users: buat/buka akun admin, Edit > User Metadata, isi:
--      {"role": "admin"}
--    Hanya user ber-metadata ini yang bisa tulis/replace.
-- 3. Authentication > Captcha: ON (Turnstile) + pastikan Rate Limits ON.
-- 4. Pakai password hasil generator (min 16 char), simpan di password manager.
-- 5. Baru Run file ini, lalu Run seed.sql bila perlu data awal.

create extension if not exists "pgcrypto";

create table if not exists research_ideas (
  id uuid primary key default gen_random_uuid(),
  judul_riset text not null check (char_length(judul_riset) between 1 and 500),
  latar_belakang text default '' check (char_length(latar_belakang) <= 20000),
  masalah text default '' check (char_length(masalah) <= 20000),
  permasalahan_diselesaikan text default '' check (char_length(permasalahan_diselesaikan) <= 20000),
  kode_dosen text default '' check (char_length(kode_dosen) <= 20),
  ketersediaan text default 'Tersedia' check (ketersediaan in ('Tersedia','Tidak Tersedia','Penuh')),
  created_at timestamptz default now()
);
alter table research_ideas enable row level security;

-- Gerbang tunggal peran admin: baca dari JWT user_metadata.
create or replace function is_admin() returns boolean language sql stable set search_path = public as $$
  select coalesce((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin';
$$;

drop policy if exists "public read" on research_ideas;
create policy "public read" on research_ideas for select using (true);

-- Tulis HANYA admin. User login biasa (tanpa role) = read-only.
drop policy if exists "admin write" on research_ideas;
create policy "admin write" on research_ideas for all
  using (is_admin()) with check (is_admin());

create index if not exists idx_judul on research_ideas (judul_riset);

-- Replace-total: admin saja + validasi bentuk & ukuran (tutup DB-bloat/DoS).
create or replace function replace_ideas(payload jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare
  n int;
begin
  if not is_admin() then raise exception 'not allowed'; end if;
  if jsonb_typeof(payload) != 'array' then raise exception 'payload harus array'; end if;
  n := jsonb_array_length(payload);
  if n < 1 or n > 2000 then raise exception 'jumlah baris 1-2000, dapat %', n; end if;
  delete from research_ideas;
  insert into research_ideas
    (judul_riset, latar_belakang, masalah, permasalahan_diselesaikan, kode_dosen, ketersediaan)
  select p.judul_riset, p.latar_belakang, p.masalah,
         p.permasalahan_diselesaikan, p.kode_dosen, p.ketersediaan
  from jsonb_populate_recordset(null::research_ideas, payload) as p;
end $$;

revoke all on function replace_ideas(jsonb) from anon, public;
grant execute on function replace_ideas(jsonb) to authenticated;
-- is_admin() hanya baca JWT pemanggil: aman dieksekusi semua peran
-- (policy "admin write" ikut dievaluasi saat public read, jadi anon butuh akses ini).
grant execute on function is_admin() to anon, authenticated, public;
