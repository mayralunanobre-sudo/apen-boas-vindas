-- Tabela principal das cartas
create table if not exists cartas (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text unique,
  nome_colaborador     text not null,
  foto_colaborador_url text,
  nome_admin           text not null,
  cargo_admin          text not null,
  mensagem_admin       text not null,
  foto_admin_url       text,
  pessoa1_nome         text not null,
  pessoa1_cargo        text not null,
  pessoa1_foto_url     text,
  pessoa1_mensagem     text,
  pessoa2_nome         text not null,
  pessoa2_cargo        text not null,
  pessoa2_foto_url     text,
  pessoa2_mensagem     text,
  criado_em            timestamptz default now()
);

-- Tabela de contribuições (família e extras)
create table if not exists contribuicoes (
  id                  uuid primary key default gen_random_uuid(),
  carta_id            uuid not null references cartas(id) on delete cascade,
  nome_remetente      text not null,
  mensagem            text not null,
  foto_remetente_url  text,
  fotos_familia_urls  text[],
  pagina              smallint not null default 2 check (pagina in (1, 2)),
  criado_em           timestamptz default now()
);

create index if not exists idx_contribuicoes_carta_id on contribuicoes(carta_id);

-- Row Level Security (RLS)
alter table cartas enable row level security;
alter table contribuicoes enable row level security;

-- Políticas: leitura pública (via service role no backend)
create policy "Leitura pública" on cartas for select using (true);
create policy "Inserção via service role" on cartas for insert with check (true);
create policy "Atualização via service role" on cartas for update using (true);

create policy "Leitura pública" on contribuicoes for select using (true);
create policy "Inserção via service role" on contribuicoes for insert with check (true);
create policy "Atualização via service role" on contribuicoes for update using (true);
create policy "Exclusão via service role" on contribuicoes for delete using (true);

-- Storage buckets (execute no painel Supabase Storage ou via CLI)
-- insert into storage.buckets (id, name, public) values ('fotos_colaboradores', 'fotos_colaboradores', true);
-- insert into storage.buckets (id, name, public) values ('fotos_contribuicoes', 'fotos_contribuicoes', true);
