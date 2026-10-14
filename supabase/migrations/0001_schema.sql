-- Academia de Letras Barão do Rio Branco — esquema, RLS e gatilhos.
-- Espelha as interfaces de src/lib/db.ts (camelCase no app, snake_case aqui).

create extension if not exists unaccent with schema extensions;

-- Próximo número de associado: maior código existente + 1 (#001006, #001007…).
-- Usado como default de members.code e pelo painel para pré-visualizar o código.
create or replace function public.next_member_code()
returns text
language plpgsql volatile security definer set search_path = ''
as $$
begin
  return (
    select '#' || lpad((coalesce(max(nullif(regexp_replace(code, '\D', '', 'g'), '')::int), 1005) + 1)::text, 6, '0')
    from public.members
  );
end;
$$;

-- ─── Tabelas ────────────────────────────────────────────────────────────────

create table public.members (
  id              text primary key,
  user_id         uuid unique references auth.users (id) on delete set null,
  code            text not null unique
                  default public.next_member_code(),
  role            text not null default 'associado' check (role in ('diretor', 'associado')),
  status          text not null default 'pendente' check (status in ('ativo', 'pendente', 'inativo')),
  nome            text not null,
  email           text not null default '',
  cadeira         text not null default '',
  cidade          text not null default '',
  titulacao       text not null default '',
  instagram       text not null default '',
  bio             text not null default '',
  full_history    text not null default '',
  foto            text not null default '',
  data_nascimento date,
  palestras       boolean not null default true,
  data_registro   timestamptz not null default now()
);
create index members_email_idx on public.members (lower(email));

create table public.payments (
  id              uuid primary key default gen_random_uuid(),
  member_id       text not null references public.members (id) on delete cascade,
  mes_referencia  text not null check (mes_referencia ~ '^\d{4}-\d{2}$'),
  tipo            text not null default 'mensal' check (tipo in ('mensal', 'recorrente', 'anuidade')),
  valor           numeric(10, 2) not null default 0,
  status          text not null check (status in ('pago', 'pendente', 'isento')),
  data            date not null default current_date,
  metodo          text check (metodo in ('pix', 'cartao', 'dinheiro', 'boleto', 'outro')),
  observacao      text,
  unique (member_id, mes_referencia)
);

create table public.books (
  id              text primary key default 'b_' || substr(gen_random_uuid()::text, 1, 8),
  member_id       text not null references public.members (id) on delete cascade,
  titulo          text not null,
  subtitulo       text not null default '',
  sinopse         text not null default '',
  capa_url        text not null default '',
  genero          text not null default '',
  faixa_etaria    text not null default '',
  data_publicacao date,
  preco           numeric(10, 2),
  links_venda     jsonb not null default '[]'::jsonb,
  tags            text[] not null default '{}',
  status          text not null default 'rascunho' check (status in ('publicado', 'rascunho')),
  created_at      timestamptz not null default now()
);
create index books_member_idx on public.books (member_id);

create table public.musics (
  id              text primary key default 'm_' || substr(gen_random_uuid()::text, 1, 8),
  member_id       text not null references public.members (id) on delete cascade,
  titulo          text not null,
  descricao       text not null default '',
  capa_url        text not null default '',
  tipo            text not null default '',
  plataforma      text not null default '',
  link_externo    text not null default '',
  tags            text[] not null default '{}',
  status          text not null default 'rascunho' check (status in ('publicado', 'rascunho')),
  created_at      timestamptz not null default now()
);
create index musics_member_idx on public.musics (member_id);

-- Linha única com a configuração da Academia.
create table public.settings (
  id                 smallint primary key default 1 check (id = 1),
  mensalidade_valor  numeric(10, 2) not null default 49.90,
  whatsapp           text not null default '',
  pix_chave          text not null default '',
  pix_nome           text not null default ''
);

-- ─── Funções auxiliares (usadas nas políticas) ─────────────────────────────

create or replace function public.current_member_id()
returns text
language sql stable security definer set search_path = ''
as $$
  select id from public.members where user_id = (select auth.uid()) limit 1
$$;

create or replace function public.is_director()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.members
    where user_id = (select auth.uid()) and role = 'diretor' and status = 'ativo'
  )
$$;

-- Associado ativo (só ativos publicam e editam conteúdo).
create or replace function public.is_active_member()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.members
    where user_id = (select auth.uid()) and status = 'ativo'
  )
$$;

-- ─── Visão pública dos membros (sem e-mail, nascimento e user_id) ──────────
-- Roda com os privilégios do dono (ignora RLS de members) e já filtra 'ativo'.

create view public.members_public as
  select id, code, role, nome, cadeira, cidade, titulacao, instagram,
         bio, full_history, foto, palestras, data_registro
  from public.members
  where status = 'ativo';

-- ─── RLS ───────────────────────────────────────────────────────────────────

alter table public.members  enable row level security;
alter table public.payments enable row level security;
alter table public.books    enable row level security;
alter table public.musics   enable row level security;
alter table public.settings enable row level security;

-- members: nada público (o público lê members_public).
create policy "membro lê o próprio, diretor lê todos" on public.members
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_director()));

create policy "membro edita o próprio, diretor edita todos" on public.members
  for update to authenticated
  using (user_id = (select auth.uid()) or (select public.is_director()))
  with check (user_id = (select auth.uid()) or (select public.is_director()));

create policy "diretor cria membros" on public.members
  for insert to authenticated
  with check ((select public.is_director()));

create policy "diretor apaga membros" on public.members
  for delete to authenticated
  using ((select public.is_director()));

-- payments: nunca públicos. Associado só lê os próprios.
create policy "membro lê os próprios pagamentos, diretor lê todos" on public.payments
  for select to authenticated
  using (member_id = (select public.current_member_id()) or (select public.is_director()));

create policy "diretor gerencia pagamentos" on public.payments
  for all to authenticated
  using ((select public.is_director()))
  with check ((select public.is_director()));

-- books e musics: público lê 'publicado' de autor ativo; autor ativo gerencia os seus; diretor tudo.
create policy "público lê livros publicados" on public.books
  for select to anon, authenticated
  using (
    status = 'publicado'
    and exists (select 1 from public.members m where m.id = member_id and m.status = 'ativo')
    or member_id = (select public.current_member_id())
    or (select public.is_director())
  );

create policy "autor gerencia os próprios livros" on public.books
  for all to authenticated
  using (
    (member_id = (select public.current_member_id()) and (select public.is_active_member()))
    or (select public.is_director())
  )
  with check (
    (member_id = (select public.current_member_id()) and (select public.is_active_member()))
    or (select public.is_director())
  );

create policy "público lê músicas publicadas" on public.musics
  for select to anon, authenticated
  using (
    status = 'publicado'
    and exists (select 1 from public.members m where m.id = member_id and m.status = 'ativo')
    or member_id = (select public.current_member_id())
    or (select public.is_director())
  );

create policy "autor gerencia as próprias músicas" on public.musics
  for all to authenticated
  using (
    (member_id = (select public.current_member_id()) and (select public.is_active_member()))
    or (select public.is_director())
  )
  with check (
    (member_id = (select public.current_member_id()) and (select public.is_active_member()))
    or (select public.is_director())
  );

-- settings: PIX e WhatsApp são exibidos em /mensalidade, então a leitura é pública.
create policy "público lê configurações" on public.settings
  for select to anon, authenticated using (true);

create policy "diretor altera configurações" on public.settings
  for update to authenticated
  using ((select public.is_director()))
  with check ((select public.is_director()));

-- ─── Privilégios ───────────────────────────────────────────────────────────

revoke all on public.members, public.payments from anon;
grant select on public.members_public to anon, authenticated;
grant select on public.books, public.musics, public.settings to anon;
grant select, insert, update, delete on public.members, public.payments,
  public.books, public.musics to authenticated;
grant select, update on public.settings to authenticated;
revoke execute on function public.next_member_code() from anon, public;
grant execute on function public.next_member_code() to authenticated;

-- ─── Gatilhos ──────────────────────────────────────────────────────────────

-- Associado não muda o próprio papel, status, código, vínculo ou e-mail.
create or replace function public.protect_member_fields()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not public.is_director() then
    new.role    := old.role;
    new.status  := old.status;
    new.code    := old.code;
    new.user_id := old.user_id;
    new.email   := old.email;
    new.id      := old.id;
  end if;
  return new;
end;
$$;

create trigger members_protect_fields
  before update on public.members
  for each row execute function public.protect_member_fields();

-- Quando o e-mail de uma conta é confirmado: vincula ao membro com o mesmo
-- e-mail (convite do diretor) ou cria um membro 'pendente' (cadastro público).
-- Só depois da confirmação, para ninguém se apossar de um membro pelo e-mail.
create or replace function public.link_member_on_confirm()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  slug text;
begin
  if new.email_confirmed_at is null then
    return new;
  end if;
  if exists (select 1 from public.members where user_id = new.id) then
    return new;
  end if;

  update public.members
     set user_id = new.id
   where id = (
     select id from public.members
      where user_id is null and lower(email) = lower(new.email)
      order by data_registro limit 1
   );

  if not found then
    slug := trim(both '-' from regexp_replace(
              lower(extensions.unaccent(coalesce(nullif(meta->>'nome', ''), split_part(new.email, '@', 1)))),
              '[^a-z0-9]+', '-', 'g'));
    if slug = '' or exists (select 1 from public.members where id = slug) then
      slug := slug || '-' || substr(new.id::text, 1, 6);
    end if;
    insert into public.members (id, user_id, nome, email, cidade, cadeira, titulacao, instagram, role, status)
    values (
      slug, new.id,
      coalesce(nullif(meta->>'nome', ''), split_part(new.email, '@', 1)),
      new.email,
      coalesce(meta->>'cidade', ''),
      coalesce(meta->>'cadeira', ''),
      coalesce(meta->>'titulacao', ''),
      coalesce(meta->>'instagram', ''),
      'associado', 'pendente'
    );
  end if;
  return new;
end;
$$;

create trigger on_auth_user_confirmed
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.link_member_on_confirm();
