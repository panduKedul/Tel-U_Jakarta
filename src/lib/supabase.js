import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Tanpa env (mis. Netlify belum set): jangan crash saat import.
// Client placeholder tetap kebentuk; query gagal dengan pesan network
// dan UI tampil "Gagal muat ... Retry" sampai env diisi + redeploy.
if (!url || !key) {
  console.warn("Supabase env belum diisi: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder-anon-key"
);
