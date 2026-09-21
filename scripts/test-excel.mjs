import assert from "node:assert";
import * as XLSX from "xlsx";
import { EXPECTED, validateHeader, normalizeKetersediaan, parseExcel } from "../src/lib/excel.js";

// header ok
const hdr = ["Judul Riset","Latar Belakang","Masalah/Problem","Permasalahan yang diselesaikan","Kode Dosen","Ketersediaan"];
const vh = validateHeader(hdr);
assert.strictEqual(vh.ok, true, "header should validate ok");
assert.deepStrictEqual(vh.missing, []);

// header miss case
const bad = validateHeader(["Judul Riset","Latar Belakang"]);
assert.strictEqual(bad.ok, false);
assert.ok(bad.missing.length > 0);

// normalize
assert.strictEqual(normalizeKetersediaan("Tersedia"), "Tersedia");
assert.strictEqual(normalizeKetersediaan(" tersedia "), "Tersedia");
assert.strictEqual(normalizeKetersediaan("TERSEDIA"), "Tersedia");
assert.strictEqual(normalizeKetersediaan("Tidak Tersedia"), "Tidak Tersedia");
assert.strictEqual(normalizeKetersediaan("habis"), "Tidak Tersedia");
assert.strictEqual(normalizeKetersediaan(""), "Tidak Tersedia");
assert.strictEqual(normalizeKetersediaan(null), "Tidak Tersedia");

// workbook dummy 2 rows -> parseExcel
const ws = XLSX.utils.aoa_to_sheet([
  hdr,
  ["Riset A","Latar A","Masalah A","Selesai A","DPS","Tersedia"],
  ["Riset B","Latar B","Masalah B","Selesai B","ERS","tidak tersedia"],
]);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
const file = { arrayBuffer: async () => buf };
const { rows, errors } = await parseExcel(file);
assert.strictEqual(errors.length, 0, JSON.stringify(errors));
assert.strictEqual(rows.length, 2);
assert.strictEqual(rows[0].judul_riset, "Riset A");
assert.strictEqual(rows[0].ketersediaan, "Tersedia");
assert.strictEqual(rows[1].ketersediaan, "Tidak Tersedia");
assert.deepStrictEqual(Object.keys(rows[0]).sort(), ["judul_riset","ketersediaan","kode_dosen","latar_belakang","masalah","permasalahan_diselesaikan"].sort());

console.log("PASS test-excel: header ok + normalize + parse 2 rows");
