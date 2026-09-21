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
