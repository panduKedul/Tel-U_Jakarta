# Task 5 Report — Topik 6 Kolom + Search + Pagination

Status: DONE.

Files:
- `src/components/Badge.jsx` — hijau Tersedia / merah Tidak (exact plan).
- `src/components/SearchBar.jsx` — controlled input, placeholder "Cari topik, deskripsi, atau nama dosen..." (plan file-list minta, code exact tak ada → buat wrapper).
- `src/components/TopicTable.jsx` — No + 6 kolom + Cell expand line-clamp-3 (exact plan + `start` prop agar No lanjut antar halaman).
- `src/components/Pagination.jsx` — prev/next + window ellipsis bila pages>7 (plan file-list minta → buat; Topics plan inline diganti komponen).
- `src/pages/Topics.jsx` — fetch supabase `research_ideas` order created_at, filter client 5 field (judul/latar/masalah/selesai/kode), per default 20 + dropdown 10/20/50 (spec §7), Kembali → `/`, error+retry, loading, empty state. Export `filterTopics`/`paginate` untuk test.

Tests:
- `npm run build` PASS (86 modules, dist ok, 4.62s).
- Logic node mirror PASS: filter "iot"→2 rows, page 20 slice benar, empty-q→all, empty list→pages 1/rows 0.
- Dist bundle cek: 7 header + Cari topik + Kembali + Baca selengkapnya = True semua.

Commit: `feat: topik 6 kolom search pagination` (berikutnya).

Concerns:
- Contoh png layout 4-kolom (Topik/Deskripsi/Pembimbing) vs Global 6-kolom — ikut Global/plan (6 kolom), resolved per spec §10.
- `start` prop deviasi kecil dari plan (No `i+1` reset per page → No global benar).
- Pagination plan inline `Array.from all` diganti window ellipsis — aman untuk N besar, behavior sama untuk N kecil.
- Dropdown per-page tambahan dari spec §7 (plan Topics fix 20) — default tetap 20.
- Live Supabase fetch belum cek (butuh .env + seed); verifikasi via bundle + logic unit.
