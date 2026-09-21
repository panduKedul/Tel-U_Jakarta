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
