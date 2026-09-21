# Task 4 Report — Routing + Beranda + Layout

Status: DONE.

Files:
- `src/components/Layout.jsx` — bg `/bg-kampus.jpg` + overlay + center (exact plan).
- `src/pages/Home.jsx` — glass card Welcome + Sistem Ide Riset + Login/Login-topik links (exact plan).
- `src/main.jsx` — BrowserRouter routes `/ /topik /login /admin` (exact plan).
- `src/pages/Topics.jsx`, `Login.jsx`, `Admin.jsx` — stub minimal (Task 5-6 timpa).
- `index.html` — title `Sistem Ide Riset`, lang `id`.

Tests:
- `npm run build` PASS (38 modules, dist ok, 2.94s).
- `npx vite --port 5175` PASS — shell `lang=id`, title `Sistem Ide Riset`.
- dist bundle cek: Welcome=True, Lihat Topik=True, routes /topik /login /admin=True.
- curl hanya lihat shell (SPA client-render); Welcome di JS bundle terbukti.

Commit: `feat: routing beranda glass` (berikutnya).

Concerns:
- Port 5173 dipakai proses lain (serve project `porto`, title porto) — bukan repo ini. Verifikasi pakai 5175.
- `public/bg-kampus.jpg` belum ada (Task 7) — bg fallback hitam/overlay, no break.
- Stubs Topics/Login/Admin wajib ditimpa Task 5-6.
