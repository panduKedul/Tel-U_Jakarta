import { supabase } from "./supabase";
export const toEmail = (u) => u.includes("@") ? u : `${u.trim()}@admin.local`;
export const loginUsername = (u,p) => supabase.auth.signInWithPassword({ email: toEmail(u), password: p });
export const getSession = async () => (await supabase.auth.getSession()).data.session;
export const logout = () => supabase.auth.signOut();
