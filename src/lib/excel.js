import * as XLSX from "xlsx";
export const EXPECTED = ["judul riset","latar belakang","masalah/problem","permasalahan yang diselesaikan","kode dosen","ketersediaan"];
export function validateHeader(hdr){ const h=hdr.map(x=>String(x||"").trim().toLowerCase()); const missing=EXPECTED.filter(e=>!h.includes(e)); return { ok: missing.length===0, missing }; }
export function normalizeKetersediaan(v){ return String(v||"").trim().toLowerCase()==="tersedia" ? "Tersedia" : "Tidak Tersedia"; }
export async function parseExcel(file){
  let wb;
  try {
    const buf = await file.arrayBuffer(); wb = XLSX.read(buf);
  } catch { return { rows:[], errors:["File corrupt / bukan xlsx valid"], truncated:false }; }
  const ws = wb.Sheets[wb.SheetNames[0]];
  if(!ws) return { rows:[], errors:["Sheet kosong"], truncated:false };
  const arr = XLSX.utils.sheet_to_json(ws,{header:1}); if(arr.length<2) return {rows:[],errors:["Sheet kosong"],truncated:false};
  const head=validateHeader(arr[0]); if(!head.ok) return {rows:[],errors:["Header miss: "+head.missing.join(", ")],truncated:false};;
  const idx=arr[0].map(x=>String(x ?? "").trim().toLowerCase()); const gi=n=>idx.indexOf(n);
  const rows=[]; let truncated=false;
  for(let i=1;i<arr.length && !truncated;i++){ const r=arr[i]; if(!r||r.every(c=>c==null||c==="")) continue;
    if(rows.length>=2000){ truncated=true; break; }
    rows.push({ judul_riset:String(r[gi("judul riset")] ?? "").trim(), latar_belakang:String(r[gi("latar belakang")] ?? "").trim(), masalah:String(r[gi("masalah/problem")] ?? "").trim(), permasalahan_diselesaikan:String(r[gi("permasalahan yang diselesaikan")] ?? "").trim(), kode_dosen:String(r[gi("kode dosen")] ?? "").trim(), ketersediaan:normalizeKetersediaan(r[gi("ketersediaan")]) });
  }
  if(!rows.length) return { rows, errors:["Tidak ada baris valid"], truncated };
  return { rows, errors: truncated?["Hanya 2000 baris pertama dipakai"]:[] , truncated };
}
