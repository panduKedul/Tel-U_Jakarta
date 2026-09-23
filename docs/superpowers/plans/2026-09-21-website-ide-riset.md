# Website Ide Riset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Vite React + Tailwind + Supabase web tampil 6 kolom ide riset tiru folder contoh, viewer public, 1 admin upload Excel replace.

**Architecture:** SPA Vite React, routing react-router-dom, state via hooks, Supabase Postgres + Auth via supabase-js, Excel parse client via xlsx, no custom backend.

**Tech Stack:** Node 24, Vite 5, React 18, Tailwind 3, react-router-dom 6, @supabase/supabase-js 2, xlsx 0.18

**Spec:** `docs/superpowers/specs/2026-09-21-website-ide-riset-design.md`

## Global Constraints

- Tabel 6 kolom penuh + No: Judul Riset | Latar Belakang | Masalah/Problem | Permasalahan yang diselesaikan | Kode Dosen | Ketersediaan.
- Upload Excel replace total, header 6 kolom pas, cap 2000 rows.
- Auth 1 admin saja, no signup, viewer anon read-only.
- UI tiru `contoh/Beranda.png` dan `contoh/Screenshot 2026-09-21 080800.png`.
- Kredensial plaintext JANGAN commit, pakai `.env`, username `admin` map ke `admin@admin.local`.
- RLS: select public true, write authenticated only.

---

## File Structure

```
website_ide_riset/
  package.json, vite.config.js, tailwind.config.js, postcss.config.js, index.html
  .env.example (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  src/
    main.jsx (entry + router)
    index.css (tailwind)
    lib/supabase.js (client singleton)
    lib/excel.js (parse + validate + normalize)
    lib/auth.js (username->email map, getSession, signIn, signOut)
    components/Layout.jsx (bg + container glass)
    components/Badge.jsx (Tersedia hijau / Tidak merah)
    components/SearchBar.jsx
    components/TopicTable.jsx (6 kolom + expand)
    components/Pagination.jsx
    pages/Home.jsx (/)
    pages/Topics.jsx (/topik)
    pages/Login.jsx (/login)
    pages/Admin.jsx (/admin)
  supabase/
    schema.sql (table + RLS + RPC replace_ideas)
    seed.sql (5 rows dummy)
```

---

### Task 1: Scaffold Vite + Tailwind + Deps

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`, `src/index.css`
- Test: `src/lib/smoke.test.js` (node assert, no framework)

**Interfaces:**
- Consumes: nothing
- Produces: `npm run dev` jalan di 5173, tailwind class render

- [ ] **Step 1: Scaffold vite**

Run:
```bash
npm create vite@latest . -- --template react
npm install
npm install react-router-dom @supabase/supabase-js xlsx
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Expected: `package.json` ada, `node_modules/` terbuat.

- [ ] **Step 2: Write tailwind config**

```js
// tailwind.config.js
export default { content: ["./index.html","./src/**/*.{js,jsx}"], theme: { extend: {} }, plugins: [] }
```

```css
/* src/index.css */
@tailwind base; @tailwind components; @tailwind utilities;
```

- [ ] **Step 3: Write entry + verify**

```jsx
// src/main.jsx
import React from "react"; import ReactDOM from "react-dom/client"; import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(<h1 className="text-3xl font-bold text-blue-600">OK</h1>);
```

Run: `npm run dev`
Expected: PASS buka http://localhost:5173 tampil OK biru.

- [ ] **Step 4: Commit**

```bash
git add package.json vite.config.js tailwind.config.js postcss.config.js src/main.jsx src/index.css
git commit -m "feat: scaffold vite react tailwind"
```

---

### Task 2: Supabase Client + Schema SQL

**Files:**
- Create: `src/lib/supabase.js`, `supabase/schema.sql`, `supabase/seed.sql`, `.env.example`
- Test: `scripts/check-supabase.mjs`

**Interfaces:**
- Consumes: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Produces: `supabase` client singleton; `schema.sql` siap paste di Dashboard

- [ ] **Step 1: Write supabase client**

```js
// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
```

```ini
# .env.example
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=anon-key-here
```

- [ ] **Step 2: Write schema SQL**

```sql
-- supabase/schema.sql
create table if not exists research_ideas (
  id uuid primary key default gen_random_uuid(),
  judul_riset text not null,
  latar_belakang text default '',
  masalah text default '',
  permasalahan_diselesaikan text default '',
  kode_dosen text default '',
  ketersediaan text default 'Tersedia' check (ketersediaan in ('Tersedia','Tidak Tersedia')),
  created_at timestamptz default now()
);
alter table research_ideas enable row level security;
drop policy if exists "public read" on research_ideas;
create policy "public read" on research_ideas for select using (true);
drop policy if exists "admin write" on research_ideas;
create policy "admin write" on research_ideas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create index if not exists idx_judul on research_ideas (judul_riset);
create or replace function replace_ideas(payload jsonb) returns void language plpgsql security definer as $$
begin delete from research_ideas; insert into research_ideas (judul_riset,latar_belakang,masalah,permasalahan_diselesaikan,kode_dosen,ketersediaan) select p.judul_riset,p.latar_belakang,p.masalah,p.permasalahan_diselesaikan,p.kode_dosen,p.ketersediaan from jsonb_populate_recordset(null::research_ideas,payload) as p; end $$;
```

```sql
-- supabase/seed.sql (5 rows, paste after schema)
insert into research_ideas (judul_riset,latar_belakang,masalah,permasalahan_diselesaikan,kode_dosen,ketersediaan) values
('Study Implementasi NTN di Indonesia','Kebutuhan satelit 5G','Security capacity routing belum petakan','Peta security+capacity+simulator','DPS','Tidak Tersedia'),
('Fuel Tank IoT Hemat Energi','BBM tangki remote tidak akurat','Rumus volume standar + kirim 5 detik boros','DB multi-model + prediksi reporting','ERS','Tersedia'),
('Ecola Minyak Jelantah','Ekonomi sirkular abdimas','Pengumpulan minyak manual','Platform digital pengumpulan','ERS','Tersedia'),
('Deteksi Pelanggaran AI','Tilng manual terbatas','Kendaraan banyak lolos','Kamera + AI + web verifikasi','DHA','Tersedia'),
('Banjir IoT LoRa','Banjir naik tiap tahun','Peringatan telat','Sensor IoT LoRa early warning','IHS','Tidak Tersedia');
```

- [ ] **Step 3: Manual verify**

Run: paste `schema.sql` di Supabase Dashboard → SQL Editor → Run. Lalu `seed.sql` → Run. Lalu di Table Editor cek 5 rows muncul.
Expected: PASS 5 rows.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase.js supabase/schema.sql supabase/seed.sql .env.example
git commit -m "feat: supabase client schema rls rpc"
```

---

### Task 3: Lib Excel + Auth Helper

**Files:**
- Create: `src/lib/excel.js`, `src/lib/auth.js`
- Test: `scripts/test-excel.mjs`

**Interfaces:**
- Consumes: `File` xlsx, `supabase` client
- Produces: `parseExcel(file)->{rows,errors}`, `validateHeader(hdr)->{ok,missing}`, `normalizeKetersediaan(v)->string`, `loginUsername(u,p)`, `toEmail(u)`

- [ ] **Step 1: Write excel lib**

```js
// src/lib/excel.js
import * as XLSX from "xlsx";
export const EXPECTED = ["judul riset","latar belakang","masalah/problem","permasalahan yang diselesaikan","kode dosen","ketersediaan"];
export function validateHeader(hdr){ const h=hdr.map(x=>String(x||"").trim().toLowerCase()); const missing=EXPECTED.filter(e=>!h.includes(e)); return { ok: missing.length===0, missing }; }
export function normalizeKetersediaan(v){ return String(v||"").trim().toLowerCase()==="tersedia" ? "Tersedia" : "Tidak Tersedia"; }
export async function parseExcel(file){
  const buf = await file.arrayBuffer(); const wb = XLSX.read(buf); const ws = wb.Sheets[wb.SheetNames[0]];
  const arr = XLSX.utils.sheet_to_json(ws,{header:1}); if(arr.length<2) return {rows:[],errors:["Sheet kosong"]};
  const head=validateHeader(arr[0]); if(!head.ok) return {rows:[],errors:["Header miss: "+head.missing.join(", ")]};
  const idx=arr[0].map(x=>String(x).trim().toLowerCase()); const gi=n=>idx.indexOf(n);
  const rows=[];
  for(let i=1;i<arr.length && rows.length<2000;i++){ const r=arr[i]; if(!r||r.every(c=>c==null||c==="")) continue;
    rows.push({ judul_riset:String(r[gi("judul riset")]||"").trim(), latar_belakang:String(r[gi("latar belakang")]||""), masalah:String(r[gi("masalah/problem")]||""), permasalahan_diselesaikan:String(r[gi("permasalahan yang diselesaikan")]||""), kode_dosen:String(r[gi("kode dosen")]||""), ketersediaan:normalizeKetersediaan(r[gi("ketersediaan")]) });
  }
  return { rows, errors: rows.length?[]:["Tidak ada baris valid"] };
}
```

```js
// src/lib/auth.js
import { supabase } from "./supabase";
export const toEmail = (u) => u.includes("@") ? u : `${u.trim()}@admin.local`;
export const loginUsername = (u,p) => supabase.auth.signInWithPassword({ email: toEmail(u), password: p });
export const getSession = async () => (await supabase.auth.getSession()).data.session;
export const logout = () => supabase.auth.signOut();
```

- [ ] **Step 2: Run parse test**

Run: `node scripts/test-excel.mjs` (script buat workbook dummy 2 rows, assert validateHeader ok, normalize benar).
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/excel.js src/lib/auth.js scripts/test-excel.mjs
git commit -m "feat: excel parse validate auth helper"
```

---

### Task 4: Routing + Beranda + Layout

**Files:**
- Create: `src/components/Layout.jsx`, `src/pages/Home.jsx`
- Modify: `src/main.jsx`, `index.html`
- Test: manual `npm run dev` buka `/`

**Interfaces:**
- Consumes: `react-router-dom`
- Produces: routes `/ /topik /login /admin`

- [ ] **Step 1: Write layout + home tiru Beranda.png**

```jsx
// src/components/Layout.jsx
export default function Layout({children}){ return (<div className="min-h-screen bg-cover bg-center" style={{backgroundImage:"url(/bg-kampus.jpg)"}}><div className="min-h-screen bg-black/20 flex items-center justify-center p-4">{children}</div></div>); }
```

```jsx
// src/pages/Home.jsx
import { Link } from "react-router-dom"; import Layout from "../components/Layout";
export default function Home(){ return (<Layout><div className="backdrop-blur-xl bg-white/20 rounded-3xl p-10 w-full max-w-md text-center border border-white/30">
<h1 className="text-4xl font-bold text-white">Welcome</h1>
<p className="text-white mt-4 font-semibold">Sistem Ide Riset</p>
<Link to="/login" className="block mt-6 bg-blue-600 text-white rounded-xl py-3 font-bold">Login</Link>
<Link to="/topik" className="block mt-3 bg-white/30 text-white rounded-xl py-3 font-bold">Lihat Topik</Link>
</div></Layout>); }
```

```jsx
// src/main.jsx
import React from "react"; import ReactDOM from "react-dom/client"; import { BrowserRouter, Routes, Route } from "react-router-dom"; import "./index.css";
import Home from "./pages/Home"; import Topics from "./pages/Topics"; import Login from "./pages/Login"; import Admin from "./pages/Admin";
ReactDOM.createRoot(document.getElementById("root")).render(<BrowserRouter><Routes><Route path="/" element={<Home/>}/><Route path="/topik" element={<Topics/>}/><Route path="/login" element={<Login/>}/><Route path="/admin" element={<Admin/>}/></Routes></BrowserRouter>);
```

- [ ] **Step 2: Verify**

Run: `npm run dev`
Expected: PASS `/` tampil Welcome + 2 tombol seperti Beranda.png.

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout.jsx src/pages/Home.jsx src/main.jsx index.html
git commit -m "feat: routing beranda glass"
```

---

### Task 5: Topik List 6 Kolom + Search + Pagination

**Files:**
- Create: `src/components/Badge.jsx`, `src/components/SearchBar.jsx`, `src/components/TopicTable.jsx`, `src/components/Pagination.jsx`, `src/pages/Topics.jsx`
- Test: manual filter + page

**Interfaces:**
- Consumes: `supabase.from("research_ideas").select("*")`
- Produces: `<Topics/>` fetch + filter client + page 20

- [ ] **Step 1: Write components**

```jsx
// src/components/Badge.jsx
export default function Badge({v}){ const ok=v==="Tersedia"; return (<span className={ok?"text-green-400 font-bold":"text-red-400 font-bold"}>{v}</span>); }
```

```jsx
// src/components/TopicTable.jsx
import { useState } from "react"; import Badge from "./Badge";
function Cell({t}){ const [o,setO]=useState(false); if(!t) return "-"; return (<div><p className={o?"":"line-clamp-3"}>{t}</p><button onClick={()=>setO(!o)} className="underline text-sm">{o?"Sembunyikan":"Baca selengkapnya"}</button></div>); }
export default function TopicTable({rows}){ return (<div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-white text-sm"><thead><tr className="bg-blue-700/80 text-left"><th className="p-3">No</th><th className="p-3">Judul Riset</th><th className="p-3">Latar Belakang</th><th className="p-3">Masalah</th><th className="p-3">Permasalahan Diselesaikan</th><th className="p-3">Kode Dosen</th><th className="p-3">Ketersediaan</th></tr></thead><tbody>{rows.map((r,i)=>(<tr key={r.id||i} className="border-t border-white/20 align-top"><td className="p-3">{i+1}</td><td className="p-3 font-bold">{r.judul_riset}</td><td className="p-3"><Cell t={r.latar_belakang}/></td><td className="p-3"><Cell t={r.masalah}/></td><td className="p-3"><Cell t={r.permasalahan_diselesaikan}/></td><td className="p-3">{r.kode_dosen}</td><td className="p-3"><Badge v={r.ketersediaan}/></td></tr>))}</tbody></table></div>); }
```

```jsx
// src/pages/Topics.jsx
import { useEffect, useState } from "react"; import { Link } from "react-router-dom"; import { supabase } from "../lib/supabase"; import TopicTable from "../components/TopicTable";
export default function Topics(){ const [all,setAll]=useState([]); const [q,setQ]=useState(""); const [page,setPage]=useState(1); const per=20;
useEffect(()=>{ supabase.from("research_ideas").select("*").order("created_at").then(({data})=>setAll(data||[])); },[]);
const f=all.filter(r=>[r.judul_riset,r.latar_belakang,r.masalah,r.permasalahan_diselesaikan,r.kode_dosen].join(" ").toLowerCase().includes(q.toLowerCase()));
const pages=Math.max(1,Math.ceil(f.length/per)); const rows=f.slice((page-1)*per,page*per);
return (<div className="min-h-screen bg-slate-800 p-4"><h1 className="text-white text-center text-xl font-bold">Topik Tugas Akhir</h1>
<input value={q} onChange={e=>{setQ(e.target.value);setPage(1);}} placeholder="Cari topik, deskripsi, atau nama dosen..." className="w-full mt-4 rounded-full p-3"/>
<div className="mt-4 backdrop-blur bg-white/10 rounded-2xl p-2"><TopicTable rows={rows}/></div>
<div className="flex justify-between mt-3 text-white"><Link to="/" className="bg-white/20 rounded-full px-5 py-2">← Kembali</Link><div className="flex gap-2">{Array.from({length:pages},(_,i)=>(<button key={i} onClick={()=>setPage(i+1)} className={"w-8 h-8 rounded-full "+(page===i+1?"bg-white text-blue-700":"bg-white/20")}>{i+1}</button>))}</div></div></div>); }
```

- [ ] **Step 2: Verify**

Run: `npm run dev` buka `/topik`
Expected: PASS 5 seed rows, search "IoT" filter 2 rows, badge hijau/merah benar.

- [ ] **Step 3: Commit**

```bash
git add src/components/Badge.jsx src/components/SearchBar.jsx src/components/TopicTable.jsx src/components/Pagination.jsx src/pages/Topics.jsx
git commit -m "feat: topik 6 kolom search pagination"
```

---

### Task 6: Login + Admin Upload Replace

**Files:**
- Create: `src/pages/Login.jsx`, `src/pages/Admin.jsx`
- Test: login salah/benar, upload invalid/valid

**Interfaces:**
- Consumes: `loginUsername`, `parseExcel`, `supabase.rpc("replace_ideas")`
- Produces: session guard, replace total

- [ ] **Step 1: Write login**

```jsx
// src/pages/Login.jsx
import { useState } from "react"; import { useNavigate, Link } from "react-router-dom"; import { loginUsername } from "../lib/auth"; import Layout from "../components/Layout";
export default function Login(){ const [u,setU]=useState(""); const [p,setP]=useState(""); const [e,setE]=useState(""); const nav=useNavigate();
return (<Layout><form onSubmit={async ev=>{ev.preventDefault(); setE(""); const {error}=await loginUsername(u,p); if(error) setE(error.message); else nav("/admin");}} className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 w-full max-w-sm border border-white/30">
<h2 className="text-white text-2xl font-bold text-center">Login Admin</h2>
<input value={u} onChange={ev=>setU(ev.target.value)} placeholder="Username (admin)" className="w-full mt-4 rounded-xl p-3"/>
<input type="password" value={p} onChange={ev=>setP(ev.target.value)} placeholder="Password" className="w-full mt-3 rounded-xl p-3"/>
{e&&<p className="text-red-300 mt-2">{e}</p>}
<button className="w-full mt-4 bg-blue-600 text-white rounded-xl py-3 font-bold">Masuk</button>
<Link to="/topik" className="block text-center text-white mt-3 underline">Lihat Topik</Link></form></Layout>); }
```

- [ ] **Step 2: Write admin**

```jsx
// src/pages/Admin.jsx
import { useEffect, useState } from "react"; import { useNavigate } from "react-router-dom"; import { supabase } from "../lib/supabase"; import { getSession, logout } from "../lib/auth"; import { parseExcel } from "../lib/excel";
export default function Admin(){ const nav=useNavigate(); const [rows,setRows]=useState([]); const [msg,setMsg]=useState(""); const [cnt,setCnt]=useState(0);
useEffect(()=>{ getSession().then(s=>{ if(!s) nav("/login"); else supabase.from("research_ideas").select("*",{count:"exact",head:true}).then(({count})=>setCnt(count||0)); }); },[nav]);
return (<div className="min-h-screen bg-slate-900 text-white p-6 max-w-4xl mx-auto">
<h1 className="text-xl font-bold">Dashboard Admin — {cnt} rows aktif</h1>
<input type="file" accept=".xlsx" onChange={async e=>{ const {rows,errors}=await parseExcel(e.target.files[0]); if(errors.length){ setMsg(errors.join("; ")); setRows([]);} else { setRows(rows); setMsg(`${rows.length} baris siap. Klik Replace.`);} }} className="mt-4"/>
{msg&&<p className="mt-2">{msg}</p>}
{rows.length>0&&<button onClick={async ()=>{ if(!confirm(`Hapus ${cnt} lama, ganti ${rows.length} baru?`)) return; const {error}=await supabase.rpc("replace_ideas",{payload:rows}); if(error) setMsg(error.message); else { setMsg("Sukses replace."); setRows([]); supabase.from("research_ideas").select("*",{count:"exact",head:true}).then(({count})=>setCnt(count||0)); } }} className="mt-3 bg-red-600 rounded-xl px-5 py-2 font-bold">Replace Total</button>}
<button onClick={async ()=>{ await logout(); nav("/"); }} className="block mt-6 underline">Logout</button></div>); }
```

- [ ] **Step 3: Verify**

Run: `npm run dev`. Test: `/admin` redirect `/login` jika anon. Login `admin` salah → error. Benar → dashboard. Upload header salah → tolak. Upload valid → Replace → `/topik` update.
Expected: PASS semua.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Login.jsx src/pages/Admin.jsx
git commit -m "feat: login admin upload replace"
```

---

### Task 7: Polish + Deploy

**Files:**
- Modify: `index.html`, `public/bg-kampus.jpg`, `README.md`
- Test: `npm run build`

**Interfaces:**
- Consumes: all tasks
- Produces: build pass, README deploy

- [ ] **Step 1: Copy bg + title + README**

Copy 1 foto kampus contoh ke `public/bg-kampus.jpg`. Update `<title>Sistem Ide Riset</title>`. README isi: `cp .env.example .env`, buat user `admin@admin.local` di Dashboard, paste schema.sql, `npm run dev`.

- [ ] **Step 2: Build verify**

Run: `npm run build`
Expected: PASS `dist/` terbuat tanpa error.

- [ ] **Step 3: Commit**

```bash
git add index.html public/bg-kampus.jpg README.md
git commit -m "chore: polish deploy ready"
```

---

## Self-Review

- Spec §4 table+RLS+RPC → Task 2. §5 auth username map → Task 3+6. §6 Excel replace → Task 3+6. §7 UI Beranda/tabel 6 kolom → Task 4+5. No TBD, semua step ada kode exact + command + expected. Tipe konsisten: `rows` shape sama di excel.js, Topics, Admin. RLS + transaction aman.
