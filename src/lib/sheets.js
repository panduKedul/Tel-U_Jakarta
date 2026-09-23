// Sumber live: Google Spreadsheet gabungan (gviz JSON, tanpa auth/secret).
// Sheet ID milik kurator; tab dibaca per gid. Kolom dibaca per INDEKS
// (tahan terhadap ganti nama header): 1=Dosen 2=Judul 3=Latar 4=Masalah
// 5=Tujuan 6=Tanggal 7=Ketersediaan. Baris tanpa judul di-skip.

export const SHEET_ID = "1nH_5Q_BWfXRVnxFE1mBHXVhewGUsi0_DaGSGSsWxKh4";
export const SHEET_GID = "0";
export const FETCH_TIMEOUT_MS = 10000;

const BULAN_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function cellVal(c) {
  if (!c) return "";
  const v = c.v;
  if (v === null || v === undefined) return "";
  if (typeof v === "string" && v.startsWith("Date(")) {
    const p = v.match(/\d+/g).map(Number); // Date(thn,bln0,hr)
    return `${BULAN_ID[p[1]] || ""} ${p[0]}`.trim();
  }
  return String(v).trim();
}

export function normalizeKetersediaan(v) {
  const s = String(v || "").trim().toLowerCase();
  if (s === "tersedia") return "Tersedia";
  if (s === "penuh") return "Penuh";
  if (!s) return "Tersedia";
  return "Tidak Tersedia";
}

export function rowsFromGviz(json) {
  const out = [];
  const rows = (json && json.table && json.table.rows) || [];
  for (const r of rows) {
    const c = r.c || [];
    const judul = cellVal(c[2]);
    if (!judul) continue; // baris kosong (mis. No 13-15)
    out.push({
      judul,
      kode_dosen: cellVal(c[1]),
      latar: cellVal(c[3]),
      masalah: cellVal(c[4]),
      target: cellVal(c[5]),
      tanggal: cellVal(c[6]),
      ketersediaan: normalizeKetersediaan(cellVal(c[7])),
    });
  }
  return out;
}

export async function fetchSheetTopics(signal) {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}` +
    `/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Sheet HTTP ${res.status}`);
  const text = await res.text();
  const m = text.match(/setResponse\((.*)\);?\s*$/s);
  if (!m) throw new Error("Format gviz tak dikenal");
  return rowsFromGviz(JSON.parse(m[1]));
}

export function fetchWithTimeout(ms = FETCH_TIMEOUT_MS) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return {
    signal: ctl.signal,
    done: () => clearTimeout(t),
  };
}
