import { supabase } from "./supabase";
export const toEmail = (u) => {
  const s = String(u ?? "").trim();
  return s.includes("@") ? s : `${s}@admin.local`;
};
export const loginUsername = (u,p) => supabase.auth.signInWithPassword({ email: toEmail(u), password: p });
export const getSession = async () => (await supabase.auth.getSession()).data.session;
export const logout = () => supabase.auth.signOut();
