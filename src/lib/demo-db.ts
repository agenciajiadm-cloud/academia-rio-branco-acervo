/**
 * Modo demonstração: um "Supabase de mentira" que guarda as tabelas no
 * localStorage, semeado com src/lib/seed.ts. Serve só para ver o site e os
 * painéis em `npm run dev` antes de existir um projeto Supabase.
 *
 * Implementa apenas o pedaço da API do supabase-js que db.ts usa
 * (from/select/insert/update/upsert/delete/eq/neq/order/single/maybeSingle/rpc).
 * Não há RLS: no modo demonstração tudo é visível.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { INITIAL_BOOKS, INITIAL_MEMBERS, INITIAL_MUSICS } from "./seed";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;
type Tables = Record<"members" | "payments" | "books" | "musics" | "settings", Row[]>;
type Result = { data: unknown; error: { message: string } | null };

const STORAGE_KEY = "academia_demo_v1";

function uuid(): string {
  return crypto.randomUUID();
}

function seedTables(): Tables {
  return {
    members: INITIAL_MEMBERS.map((m) => ({
      id: m.id,
      user_id: null,
      code: m.code,
      role: m.role,
      status: m.status,
      nome: m.nome,
      email: m.email,
      cadeira: m.cadeira,
      cidade: m.cidade,
      titulacao: m.titulacao,
      instagram: m.instagram,
      bio: m.bio ?? "",
      full_history: m.fullHistory ?? "",
      foto: m.foto ?? "",
      data_nascimento: m.dataNascimento ?? null,
      palestras: m.palestras,
      data_registro: m.dataRegistro,
    })),
    payments: INITIAL_MEMBERS.flatMap((m) =>
      m.pagamentos.map((p) => ({
        id: uuid(),
        member_id: m.id,
        mes_referencia: p.mesReferencia,
        tipo: p.tipo,
        valor: p.valor,
        status: p.status,
        data: p.data,
        metodo: p.metodo ?? null,
        observacao: p.observacao ?? null,
      }))
    ),
    books: INITIAL_BOOKS.map((b) => ({
      id: b.id,
      member_id: b.memberId,
      titulo: b.titulo,
      subtitulo: b.subtitulo,
      sinopse: b.sinopse,
      capa_url: b.capaUrl,
      genero: b.genero,
      faixa_etaria: b.faixaEtaria,
      data_publicacao: b.dataPublicacao || null,
      preco: b.preco ?? null,
      links_venda: b.linksVenda,
      tags: b.tags,
      status: b.status,
      created_at: b.createdAt,
    })),
    musics: INITIAL_MUSICS.map((m) => ({
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
    })),
    settings: [{ id: 1, mensalidade_valor: 49.9, whatsapp: "", pix_chave: "", pix_nome: "" }],
  };
}

function loadTables(): Tables {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage indisponível ou corrompido: recomeça do seed
  }
  const tables = seedTables();
  saveTables(tables);
  return tables;
}

function saveTables(tables: Tables) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
  } catch {
    // sem localStorage: os dados valem só até recarregar a página
  }
}

function nextMemberCode(members: Row[]): string {
  const nums = members.map((m) => parseInt(String(m.code).replace(/\D/g, ""), 10)).filter((n) => n > 0);
  return "#" + String(Math.max(1005, ...nums) + 1).padStart(6, "0");
}

/** Defaults que o banco aplicaria num insert (ver 0001_schema.sql). */
function withDefaults(table: string, row: Row, tables: Tables): Row {
  const now = new Date().toISOString();
  switch (table) {
    case "members":
      return {
        user_id: null, role: "associado", status: "pendente", email: "", cadeira: "", cidade: "",
        titulacao: "", instagram: "", bio: "", full_history: "", foto: "", data_nascimento: null,
        palestras: true, data_registro: now,
        code: row.code ?? nextMemberCode(tables.members),
        ...row,
      };
    case "payments":
      return { id: uuid(), tipo: "mensal", valor: 0, data: now.split("T")[0], metodo: null, observacao: null, ...row };
    case "books":
      return {
        id: "b_" + uuid().slice(0, 8), subtitulo: "", sinopse: "", capa_url: "", genero: "", faixa_etaria: "",
        data_publicacao: null, preco: null, links_venda: [], tags: [], status: "rascunho", created_at: now, ...row,
      };
    case "musics":
      return {
        id: "m_" + uuid().slice(0, 8), descricao: "", capa_url: "", tipo: "", plataforma: "", link_externo: "",
        tags: [], status: "rascunho", created_at: now, ...row,
      };
    default:
      return { ...row };
  }
}

const PUBLIC_MEMBER_FIELDS = [
  "id", "code", "role", "nome", "cadeira", "cidade", "titulacao", "instagram",
  "bio", "full_history", "foto", "palestras", "data_registro",
];

class DemoQuery implements PromiseLike<Result> {
  private action: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private payload: Row | Row[] | null = null;
  private conflictKeys = ["id"];
  private filters: ((r: Row) => boolean)[] = [];
  private orderBy: { col: string; asc: boolean } | null = null;
  private columns = "*";
  private mode: "many" | "one" | "maybe" = "many";

  constructor(private table: string) {}

  select(columns = "*") {
    this.columns = columns;
    return this;
  }
  insert(payload: Row | Row[]) {
    this.action = "insert";
    this.payload = payload;
    return this;
  }
  update(payload: Row) {
    this.action = "update";
    this.payload = payload;
    return this;
  }
  upsert(payload: Row | Row[], opts?: { onConflict?: string }) {
    this.action = "upsert";
    this.payload = payload;
    if (opts?.onConflict) this.conflictKeys = opts.onConflict.split(",").map((k) => k.trim());
    return this;
  }
  delete() {
    this.action = "delete";
    return this;
  }
  eq(col: string, value: unknown) {
    this.filters.push((r) => r[col] === value);
    return this;
  }
  neq(col: string, value: unknown) {
    this.filters.push((r) => r[col] !== value);
    return this;
  }
  order(col: string, opts?: { ascending?: boolean }) {
    this.orderBy = { col, asc: opts?.ascending ?? true };
    return this;
  }
  single() {
    this.mode = "one";
    return this;
  }
  maybeSingle() {
    this.mode = "maybe";
    return this;
  }

  then<A = Result, B = never>(
    onfulfilled?: ((value: Result) => A | PromiseLike<A>) | null,
    onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null
  ): PromiseLike<A | B> {
    return Promise.resolve()
      .then(() => this.execute())
      .then(onfulfilled, onrejected);
  }

  private execute(): Result {
    const tables = loadTables();
    const isView = this.table === "members_public";
    const name = (isView ? "members" : this.table) as keyof Tables;
    const source = isView ? tables.members.filter((m) => m.status === "ativo") : tables[name];
    const matches = (r: Row) => this.filters.every((f) => f(r));
    let rows: Row[];

    switch (this.action) {
      case "select":
        rows = source.filter(matches);
        break;
      case "insert": {
        const list = Array.isArray(this.payload) ? this.payload : [this.payload!];
        rows = list.map((r) => withDefaults(name, r, tables));
        for (const r of rows) {
          if (tables[name].some((x) => x.id === r.id)) {
            return { data: null, error: { message: `duplicate key value violates unique constraint "${name}_pkey"` } };
          }
          tables[name].push(r);
        }
        saveTables(tables);
        break;
      }
      case "update":
        rows = source.filter(matches);
        rows.forEach((r) => Object.assign(r, this.payload));
        saveTables(tables);
        break;
      case "upsert": {
        const list = Array.isArray(this.payload) ? this.payload : [this.payload!];
        rows = list.map((r) => {
          const found = tables[name].find((x) => this.conflictKeys.every((k) => x[k] === r[k]));
          if (found) return Object.assign(found, r);
          const created = withDefaults(name, r, tables);
          tables[name].push(created);
          return created;
        });
        saveTables(tables);
        break;
      }
      case "delete": {
        rows = tables[name].filter(matches);
        const removed = new Set(rows.map((r) => r.id));
        tables[name] = tables[name].filter((r) => !removed.has(r.id));
        if (name === "members") {
          for (const child of ["payments", "books", "musics"] as const) {
            tables[child] = tables[child].filter((r) => !removed.has(r.member_id));
          }
        }
        saveTables(tables);
        break;
      }
    }

    if (this.orderBy) {
      const { col, asc } = this.orderBy;
      rows = [...rows].sort((a, b) => String(a[col] ?? "").localeCompare(String(b[col] ?? "")) * (asc ? 1 : -1));
    }

    const embedPayments = this.columns.includes("pagamentos:payments");
    let out = rows.map((r) => {
      let copy: Row = isView
        ? Object.fromEntries(PUBLIC_MEMBER_FIELDS.map((k) => [k, r[k]]))
        : { ...r };
      if (embedPayments) copy = { ...copy, pagamentos: tables.payments.filter((p) => p.member_id === r.id) };
      return copy;
    });
    out = JSON.parse(JSON.stringify(out)); // como o PostgREST: cópias, não referências

    if (this.mode === "many") return { data: out, error: null };
    if (this.mode === "one" && out.length !== 1) {
      return { data: null, error: { message: "JSON object requested, multiple (or no) rows returned" } };
    }
    return { data: out[0] ?? null, error: null };
  }
}

export function createDemoClient(): SupabaseClient {
  const client = {
    from: (table: string) => new DemoQuery(table),
    rpc: async (fn: string) =>
      fn === "next_member_code"
        ? { data: nextMemberCode(loadTables().members), error: null }
        : { data: null, error: { message: `RPC ${fn} não existe no modo demonstração` } },
  };
  return client as unknown as SupabaseClient;
}
