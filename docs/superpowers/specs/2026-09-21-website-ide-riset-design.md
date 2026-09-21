# Design: Website Ide Riset — 2026-09-21

## 1. Ringkas
Web tampil daftar ide riset tiru folder `contoh/`. Viewer bebas lihat + search. Admin tunggal upload Excel replace total. Stack: Vite React + Tailwind + Supabase (Postgres + Auth). Deploy frontend Vercel.

Referensi UI:
- `contoh/Beranda.png` → route `/` Welcome card glass, tombol Login + Lihat Topik, bg gedung + bunga, footer Powered by.
- `contoh/Screenshot 2026-09-21 080800.png` + `081029.png` → route `/topik` tabel + search + pagination 20 + badge ketersediaan + Kembali.

## 2. Scope
In:
- Beranda, list topik 6 kolom penuh, search, pagination, login admin, dashboard upload Excel, proteksi route, RLS.
Out (YAGNI):
- Signup, multi-admin, edit cell inline, export PDF, notif email, role dosen/mhs.

## 3. Arsitek
```
[Vite React + Tailwind] --supabase-js--> [Supabase: Auth + Postgres + RLS]
        |                                        |
     Vercel                                 Dashboard seed 1 admin
```
No custom backend. Semua query via supabase-js. Excel parse di client via `xlsx`.

## 4. Data model
Table `research_ideas`:
- `id uuid pk default gen_random_uuid()`
- `judul_riset text not null`
- `latar_belakang text`
- `masalah text` (= Masalah/Problem)
- `permasalahan_diselesaikan text`
- `kode_dosen text`
- `ketersediaan text check (Tersedia, Tidak Tersedia)`
- `created_at timestamptz default now()`

Index: `idx_judul (judul_riset)`, full-text sederhana via `ilike` client-side filter (data <2000 rows, filter client ok).

RLS:
```sql
alter table research_ideas enable row level security;
create policy "public read" on research_ideas for select using (true);
create policy "admin write" on research_ideas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
```
Hanya 1 user authenticated = admin. No anon write.

## 5. Auth
- Supabase Email Auth. Username request `prodis1tt` map jadi email `prodis1tt@admin.local` (Supabase butuh format email).
- Password awal `prodis1tt` → wajib ganti via dashboard pasca-deploy, simpan di env, JANGAN commit plaintext.
- Routes: `/login` (email+password), `/admin` guard `session != null`, `/` dan `/topik` public.
- Logout clear session + redirect `/`.

## 6. Flow Excel replace
1. Admin `/admin` → input file `.xlsx` (1 sheet pertama).
2. Header wajib pas urutan: `Judul Riset | Latar Belakang | Masalah/Problem | Permasalahan yang diselesaikan | Kode Dosen | Ketersediaan`. Case-insensitive trim match, tolak jika miss.
3. Parse → preview 5 baris + hitung total + list error (baris kosong skip, ketersediaan normalisasi: "Tersedia" else "Tidak Tersedia").
4. Klik Confirm → RPC transaction: `delete from research_ideas` lalu bulk `insert`. Jika insert gagal → rollback, data lama aman, toast error exact.
5. Sukses → refetch `/topik`, toast jumlah rows baru.
Cap 2000 rows. Lib: `xlsx`.

Contoh RPC:
```sql
create or replace function replace_ideas(payload jsonb) returns void language plpgsql as $$
begin delete from research_ideas; insert into research_ideas (judul_riset,latar_belakang,masalah,permasalahan_diselesaikan,kode_dosen,ketersediaan) select * from jsonb_populate_recordset(null::research_ideas,payload); end $$;
```

## 7. UI detail
- `/`: full-bg image (reuse gedung contoh atau gradient fallback), glass card center: Welcome, logo, "PTA/TA Management System" → ganti "Sistem Ide Riset", tombol biru Login, tombol abu Lihat Topik.
- `/topik`: header logo + "Topik Tugas Akhir", search placeholder "Cari topik, deskripsi, atau nama dosen...", tabel kolom: No | Judul Riset | Latar Belakang | Masalah | Permasalahan Diselesaikan | Kode Dosen | Ketersediaan. Cell panjang line-clamp-3 + toggle Baca selengkapnya/Sembunyikan. Badge: Tersedia hijau, Tidak Tersedia merah. Footer: Tampilkan 20 dropdown (10/20/50), pagination 1..N, Kembali.
- Mobile: tabel scroll-x, min-width 1100px.
- `/admin`: status login, drag-drop upload, preview table, tombol Replace, danger confirm modal ("Hapus X rows lama?").

## 8. Error handling
- Excel header salah → list kolom miss, batal upload.
- Supabase down → banner retry.
- Login salah → pesan exact, no stack leak.
- Insert parsial gagal → tidak hapus lama (transaction).

## 9. Testing
- Unit: parse + normalisasi ketersediaan + header validator.
- Manual: login benar/salah, upload valid/invalid, search 6 kolom, pagination 20, RLS anon write ditolak (curl 403).
- Seed 5 rows dummy untuk dev.

## 10. Self-review
- No TBD. Scope 1 spec = 1 plan. Kolom 6 fix sesuai vote. Upload replace sesuai request update-hapus-lama. Backend Supabase sesuai vote. Kredensial plaintext tidak disimpan di repo (env only). Kontradiksi contoh 4 kolom vs request 6 kolom resolved: pakai 6 kolom penuh.

## 11. Next
Tunggu user review file ini → invoke writing-plans → eksekusi Vite scaffold + Supabase setup + UI tiru contoh.
