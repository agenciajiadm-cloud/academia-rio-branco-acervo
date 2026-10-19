/**
 * Camada de dados unificada da Academia de Letras Barão do Rio Branco.
 * Tudo vem do Supabase (supabase/migrations/0001_schema.sql). O que cada
 * visitante enxerga é decidido pelo RLS; aqui só mapeamos snake_case ⇄ camelCase.
 *
 * Por padrão os getters devolvem o que é público (membros ativos, livros e
 * músicas publicados). O painel passa { todos: true } para ver tudo o que o
 * RLS permitir (rascunhos, pendentes, pagamentos).
 */

import { isDemo, supabase } from "./supabase";

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface DBBook {
  id: string;
  memberId: string;
  titulo: string;
  subtitulo: string;
  sinopse: string;
  capaUrl: string;
  genero: string;
  faixaEtaria: string;
  dataPublicacao: string;
  preco?: number;
  linksVenda: { plataforma: string; url: string }[];
  tags: string[];
  status: "publicado" | "rascunho";
  createdAt: string;
}

export interface DBMusic {
  id: string;
  memberId: string;
  titulo: string;
  descricao: string;
  capaUrl: string;
  tipo: string;
  plataforma: string;
  linkExterno: string;
  tags: string[];
  status: "publicado" | "rascunho";
  createdAt: string;
}

export interface DBPayment {
  id: string;
  memberId: string;
  mesReferencia: string; // "2025-01", "2026-04" (YYYY-MM)
  tipo: "mensal" | "recorrente" | "anuidade";
  valor: number;
  status: "pago" | "pendente" | "isento";
  data: string; // ISO ou YYYY-MM-DD
  metodo?: "pix" | "cartao" | "dinheiro" | "boleto" | "outro";
  observacao?: string;
}

export interface DBMember {
  id: string;
  code: string;
  role: "diretor" | "associado";
  nome: string;
  email: string;
  cadeira: string;
  cidade: string;
  titulacao: string;
  instagram: string;
  bio?: string;
  fullHistory?: string;
  foto?: string;
  dataNascimento?: string;
  palestras: boolean;
  status: "ativo" | "pendente" | "inativo";
  dataRegistro: string;
  pagamentos: DBPayment[];
}

export interface DBSettings {
  mensalidadeValor: number;
  whatsapp: string;
  pixChave: string;
  pixNome: string;
}

type Opcoes = { todos?: boolean };

// Linhas cruas do PostgREST; os mapeadores abaixo dão o tipo certo a cada uma.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

// ─── Helpers ────────────────────────────────────────────────────────────────

const EVENT_NAME = "academia_db_updated";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

/** Lança o erro do Supabase com uma mensagem legível; senão devolve os dados. */
function ok<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeCode(code: string): string {
  const clean = code.trim().toUpperCase();
  return clean.startsWith("#") ? clean : `#${clean}`;
}

/** Remove chaves undefined para não sobrescrever colunas num update parcial. */
function defined(row: Row): Row {
  return Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined));
}

// ─── Mapeamento ─────────────────────────────────────────────────────────────

const PUBLIC_MEMBER_COLUMNS =
  "id, code, role, nome, cadeira, cidade, titulacao, instagram, bio, full_history, foto, palestras, data_registro";

function toPayment(r: Row): DBPayment {
  return {
    id: r.id,
    memberId: r.member_id,
    mesReferencia: r.mes_referencia,
    tipo: r.tipo,
    valor: Number(r.valor),
    status: r.status,
    data: r.data,
    metodo: r.metodo ?? undefined,
    observacao: r.observacao ?? undefined,
  };
}

function fromPayment(p: Partial<DBPayment>): Row {
  return defined({
    id: p.id,
    member_id: p.memberId,
    mes_referencia: p.mesReferencia,
    tipo: p.tipo,
    valor: p.valor,
    status: p.status,
    data: p.data,
    metodo: p.metodo ?? null,
    observacao: p.observacao ?? null,
  });
}

function toMember(r: Row): DBMember {
  return {
    id: r.id,
    code: r.code,
    role: r.role,
    nome: r.nome,
    email: r.email ?? "",
    cadeira: r.cadeira ?? "",
    cidade: r.cidade ?? "",
    titulacao: r.titulacao ?? "",
    instagram: r.instagram ?? "",
    bio: r.bio ?? "",
    fullHistory: r.full_history ?? "",
    foto: r.foto ?? "",
    dataNascimento: r.data_nascimento ?? undefined,
    palestras: r.palestras,
    status: r.status ?? "ativo", // members_public só tem ativos
    dataRegistro: r.data_registro,
    pagamentos: (r.pagamentos ?? []).map(toPayment),
  };
}

function fromMember(m: Partial<DBMember>): Row {
  return defined({
    id: m.id,
    code: m.code,
    role: m.role,
    status: m.status,
    nome: m.nome?.trim(),
    email: m.email?.trim(),
    cadeira: m.cadeira?.trim(),
    cidade: m.cidade?.trim(),
    titulacao: m.titulacao?.trim(),
    instagram: m.instagram?.trim(),
    bio: m.bio?.trim(),
    full_history: m.fullHistory?.trim(),
    foto: m.foto?.trim(),
    data_nascimento: m.dataNascimento === undefined ? undefined : m.dataNascimento || null,
    palestras: m.palestras,
    data_registro: m.dataRegistro,
  });
}

function toBook(r: Row): DBBook {
  return {
    id: r.id,
    memberId: r.member_id,
    titulo: r.titulo,
    subtitulo: r.subtitulo,
    sinopse: r.sinopse,
    capaUrl: r.capa_url,
    genero: r.genero,
    faixaEtaria: r.faixa_etaria,
    dataPublicacao: r.data_publicacao ?? "",
    preco: r.preco === null ? undefined : Number(r.preco),
    linksVenda: r.links_venda ?? [],
    tags: r.tags ?? [],
    status: r.status,
    createdAt: r.created_at,
  };
}

function fromBook(b: Partial<DBBook>): Row {
  return defined({
    id: b.id,
    member_id: b.memberId,
    titulo: b.titulo,
    subtitulo: b.subtitulo,
    sinopse: b.sinopse,
    capa_url: b.capaUrl,
    genero: b.genero,
    faixa_etaria: b.faixaEtaria,
    data_publicacao: b.dataPublicacao === undefined ? undefined : b.dataPublicacao || null,
    preco: b.preco === undefined ? undefined : b.preco ?? null,
    links_venda: b.linksVenda,
    tags: b.tags,
    status: b.status,
    created_at: b.createdAt,
  });
}

function toMusic(r: Row): DBMusic {
  return {
    id: r.id,
    memberId: r.member_id,
    titulo: r.titulo,
    descricao: r.descricao,
    capaUrl: r.capa_url,
    tipo: r.tipo,
    plataforma: r.plataforma,
    linkExterno: r.link_externo,
    tags: r.tags ?? [],
    status: r.status,
    createdAt: r.created_at,
  };
}

function fromMusic(m: Partial<DBMusic>): Row {
  return defined({
    id: m.id,
    member_id: m.memberId,
    titulo: m.titulo,
    descricao: m.descricao,
    capa_url: m.capaUrl,
    tipo: m.tipo,
    plataforma: m.plataforma,
    link_externo: m.linkExterno,
    tags: m.tags,
    status: m.status,
    created_at: m.createdAt,
  });
}

// ─── CONFIGURAÇÕES ──────────────────────────────────────────────────────────

export async function getSettings(): Promise<DBSettings> {
  const r = ok(await supabase().from("settings").select("*").eq("id", 1).maybeSingle());
  return {
    mensalidadeValor: r ? Number(r.mensalidade_valor) : 49.9,
    whatsapp: r?.whatsapp ?? "",
    pixChave: r?.pix_chave ?? "",
    pixNome: r?.pix_nome ?? "",
  };
}

export async function updateSettings(data: Partial<DBSettings>): Promise<void> {
  ok(
    await supabase()
      .from("settings")
      .update(
        defined({
          mensalidade_valor: data.mensalidadeValor,
          whatsapp: data.whatsapp,
          pix_chave: data.pixChave,
          pix_nome: data.pixNome,
        })
      )
      .eq("id", 1)
  );
  notify();
}

// ─── MEMBERS (INTEGRANTES & DIRETORES) ──────────────────────────────────────

/** Público: membros ativos, sem e-mail. { todos: true }: tabela completa com pagamentos (diretor). */
export async function getMembers(opts: Opcoes = {}): Promise<DBMember[]> {
  const rows = opts.todos
    ? ok(await supabase().from("members").select("*, pagamentos:payments(*)").order("code"))
    : ok(await supabase().from("members_public").select(PUBLIC_MEMBER_COLUMNS).order("code"));
  return (rows ?? []).map(toMember);
}

export async function getMemberByCode(code: string, opts: Opcoes = {}): Promise<DBMember | null> {
  const r = opts.todos
    ? ok(await supabase().from("members").select("*, pagamentos:payments(*)").eq("code", normalizeCode(code)).maybeSingle())
    : ok(await supabase().from("members_public").select(PUBLIC_MEMBER_COLUMNS).eq("code", normalizeCode(code)).maybeSingle());
  return r ? toMember(r) : null;
}

export async function getMemberById(id: string, opts: Opcoes = {}): Promise<DBMember | null> {
  const r = opts.todos
    ? ok(await supabase().from("members").select("*, pagamentos:payments(*)").eq("id", id).maybeSingle())
    : ok(await supabase().from("members_public").select(PUBLIC_MEMBER_COLUMNS).eq("id", id).maybeSingle());
  return r ? toMember(r) : null;
}

/** Pré-visualização do próximo código (o banco atribui o mesmo valor no insert). */
export async function generateNextMemberCode(): Promise<string> {
  return ok(await supabase().rpc("next_member_code")) as string;
}

export async function createMember(data: Partial<DBMember> & { nome: string }): Promise<DBMember> {
  const baseId = data.id?.trim() || slugify(data.nome) || crypto.randomUUID();
  const exists = ok(await supabase().from("members").select("id").eq("id", baseId).maybeSingle());
  const id = exists ? `${baseId}-${crypto.randomUUID().slice(0, 6)}` : baseId;

  const row = fromMember({
    cidade: "Macapá, AP",
    palestras: true,
    ...data,
    id,
    code: data.code?.trim() ? normalizeCode(data.code) : undefined, // vazio → default do banco
    role: data.role || "associado",
    status: data.status || "ativo",
  });

  const r = ok(await supabase().from("members").insert(row).select("*, pagamentos:payments(*)").single());
  notify();
  return toMember(r);
}

export async function upsertMember(data: Partial<DBMember> & { id: string }): Promise<DBMember> {
  const r = ok(
    await supabase()
      .from("members")
      .update(fromMember(data)) // fromMember ignora `pagamentos`
      .eq("id", data.id)
      .select("*, pagamentos:payments(*)")
      .maybeSingle()
  );
  if (!r) return createMember(data as DBMember);
  notify();
  return toMember(r);
}

export async function deleteMember(id: string): Promise<void> {
  ok(await supabase().from("members").delete().eq("id", id));
  notify();
}

// ─── MENSALIDADES / CONTROLE FINANCEIRO ESTILO EXCEL ───────────────────────

export async function getMemberMonthlyPayment(memberId: string, mesReferencia: string): Promise<DBPayment | null> {
  const r = ok(
    await supabase()
      .from("payments")
      .select("*")
      .eq("member_id", memberId)
      .eq("mes_referencia", mesReferencia)
      .maybeSingle()
  );
  return r ? toPayment(r) : null;
}

/**
 * Alterna rapidamente o status do mês de um membro:
 * Sem registro -> Pago -> Pendente -> Isento -> Pago...
 * Sem `valor`, usa a mensalidade de settings.
 */
export async function toggleMonthlyPayment(
  memberId: string,
  mesReferencia: string,
  forceStatus?: "pago" | "pendente" | "isento",
  valor?: number,
  observacao?: string
): Promise<DBPayment> {
  const current = await getMemberMonthlyPayment(memberId, mesReferencia);

  let nextStatus: "pago" | "pendente" | "isento" = forceStatus ?? "pago";
  if (!forceStatus && current) {
    if (current.status === "pago") nextStatus = "pendente";
    else if (current.status === "pendente") nextStatus = "isento";
    else nextStatus = "pago";
  }

  const valorMensal = valor || (await getSettings()).mensalidadeValor;
  const r = ok(
    await supabase()
      .from("payments")
      .upsert(
        fromPayment({
          memberId,
          mesReferencia,
          tipo: current?.tipo ?? "mensal",
          valor: nextStatus === "isento" ? 0 : valorMensal,
          status: nextStatus,
          data: new Date().toISOString().split("T")[0],
          metodo: current?.metodo ?? "pix",
          observacao: observacao || current?.observacao,
        }),
        { onConflict: "member_id,mes_referencia" }
      )
      .select()
      .single()
  );
  notify();
  return toPayment(r);
}

export async function setBulkMonthlyPayment(
  mesReferencia: string,
  status: "pago" | "pendente" | "isento",
  valor?: number
): Promise<void> {
  const valorMensal = valor || (await getSettings()).mensalidadeValor;
  const members = ok(await supabase().from("members").select("id").neq("status", "inativo"));
  const today = new Date().toISOString().split("T")[0];
  const rows = (members ?? []).map((m: Row) =>
    fromPayment({
      memberId: m.id,
      mesReferencia,
      tipo: "mensal",
      valor: status === "isento" ? 0 : valorMensal,
      status,
      data: today,
      metodo: "pix",
    })
  );
  if (rows.length > 0) {
    ok(await supabase().from("payments").upsert(rows, { onConflict: "member_id,mes_referencia" }));
  }
  notify();
}

// ─── BOOKS (LIVROS DO ACERVO) ───────────────────────────────────────────────

/** Público: só publicados. { todos: true }: inclui rascunhos que o RLS permitir. */
export async function getBooks(opts: Opcoes = {}): Promise<DBBook[]> {
  let q = supabase().from("books").select("*").order("created_at", { ascending: false });
  if (!opts.todos) q = q.eq("status", "publicado");
  return (ok(await q) ?? []).map(toBook);
}

export async function getBookById(id: string): Promise<DBBook | null> {
  const r = ok(await supabase().from("books").select("*").eq("id", id).maybeSingle());
  return r ? toBook(r) : null;
}

export async function getBooksByMember(memberId: string, opts: Opcoes = {}): Promise<DBBook[]> {
  let q = supabase().from("books").select("*").eq("member_id", memberId).order("created_at", { ascending: false });
  if (!opts.todos) q = q.eq("status", "publicado");
  return (ok(await q) ?? []).map(toBook);
}

export async function upsertBook(data: Omit<DBBook, "id" | "createdAt"> & { id?: string }): Promise<DBBook> {
  const row = fromBook(data);
  const r = data.id
    ? ok(await supabase().from("books").upsert(row).select().single())
    : ok(await supabase().from("books").insert(row).select().single());
  notify();
  return toBook(r);
}

export async function deleteBook(id: string): Promise<void> {
  ok(await supabase().from("books").delete().eq("id", id));
  notify();
}

// ─── MUSICS (MÚSICAS & AUDIOLIVROS) ─────────────────────────────────────────

export async function getMusics(opts: Opcoes = {}): Promise<DBMusic[]> {
  let q = supabase().from("musics").select("*").order("created_at", { ascending: false });
  if (!opts.todos) q = q.eq("status", "publicado");
  return (ok(await q) ?? []).map(toMusic);
}

export async function getMusicsByMember(memberId: string, opts: Opcoes = {}): Promise<DBMusic[]> {
  let q = supabase().from("musics").select("*").eq("member_id", memberId).order("created_at", { ascending: false });
  if (!opts.todos) q = q.eq("status", "publicado");
  return (ok(await q) ?? []).map(toMusic);
}

export async function upsertMusic(data: Omit<DBMusic, "id" | "createdAt"> & { id?: string }): Promise<DBMusic> {
  const row = fromMusic(data);
  const r = data.id
    ? ok(await supabase().from("musics").upsert(row).select().single())
    : ok(await supabase().from("musics").insert(row).select().single());
  notify();
  return toMusic(r);
}

export async function deleteMusic(id: string): Promise<void> {
  ok(await supabase().from("musics").delete().eq("id", id));
  notify();
}

// ─── BACKUP & RESTAURAÇÃO DE DADOS ──────────────────────────────────────────

export async function exportDatabaseBackup(): Promise<string> {
  const [members, books, musics, settings] = await Promise.all([
    getMembers({ todos: true }),
    getBooks({ todos: true }),
    getMusics({ todos: true }),
    getSettings(),
  ]);
  const backup = {
    version: "4.0",
    exportDate: new Date().toISOString(),
    settings,
    members,
    books,
    musics,
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Importa um backup (formato 3.0 do localStorage ou 4.0 do Supabase).
 * Faz upsert por id: não apaga o que não está no arquivo e não mexe no vínculo de login.
 */
export async function importDatabaseBackup(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data.members) || !Array.isArray(data.books)) {
      return { success: false, message: "Arquivo de backup inválido." };
    }
    const db = supabase();
    const members = data.members as DBMember[];

    ok(await db.from("members").upsert(members.map(fromMember)));

    const payments = members.flatMap((m) =>
      (m.pagamentos ?? []).map((p) => fromPayment({ ...p, id: undefined, memberId: m.id }))
    );
    if (payments.length > 0) {
      ok(await db.from("payments").upsert(payments, { onConflict: "member_id,mes_referencia" }));
    }

    ok(await db.from("books").upsert((data.books as DBBook[]).map(fromBook)));
    if (Array.isArray(data.musics) && data.musics.length > 0) {
      ok(await db.from("musics").upsert((data.musics as DBMusic[]).map(fromMusic)));
    }
    if (data.settings) await updateSettings(data.settings);

    notify();
    return {
      success: true,
      message: `Backup importado com sucesso: ${members.length} membros e ${data.books.length} livros.`,
    };
  } catch (err) {
    return { success: false, message: "Erro ao importar backup: " + (err instanceof Error ? err.message : String(err)) };
  }
}

/** Só em desenvolvimento ou no modo demonstração: regrava os dados iniciais de src/lib/seed.ts. */
export async function resetToDefaultData(): Promise<{ success: boolean; message: string }> {
  if (process.env.NODE_ENV !== "development" && !isDemo()) {
    return { success: false, message: "Restaurar padrão só está disponível em desenvolvimento." };
  }
  const { INITIAL_MEMBERS, INITIAL_BOOKS, INITIAL_MUSICS } = await import("./seed");
  return importDatabaseBackup(
    JSON.stringify({ members: INITIAL_MEMBERS, books: INITIAL_BOOKS, musics: INITIAL_MUSICS })
  );
}
