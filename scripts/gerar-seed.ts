// Gera supabase/seed.sql a partir de src/lib/seed.ts.
// Uso: node --experimental-strip-types scripts/gerar-seed.ts > supabase/seed.sql
import { INITIAL_MEMBERS, INITIAL_BOOKS, INITIAL_MUSICS } from "../src/lib/seed.ts";
const q = (v: unknown): string =>
  v === undefined || v === null ? "null"
  : typeof v === "number" || typeof v === "boolean" ? String(v)
  : Array.isArray(v) ? (v.every(x => typeof x === "string") ? `array[${v.map(q).join(", ")}]::text[]` : q(JSON.stringify(v)) + "::jsonb")
  : `'${String(v).replace(/'/g, "''")}'`;
const out: string[] = [
  "-- Gerado por scripts/gerar-seed.ts a partir de src/lib/seed.ts. Rode depois de 0001_schema.sql.",
  "",
  "insert into public.settings (id, mensalidade_valor, whatsapp, pix_chave, pix_nome) values (1, 49.90, '', '', '')",
  "on conflict (id) do nothing;",
  "",
];
for (const m of INITIAL_MEMBERS) {
  out.push(`insert into public.members (id, code, role, status, nome, email, cadeira, cidade, titulacao, instagram, bio, full_history, foto, palestras, data_registro) values (${[m.id, m.code, m.role, m.status, m.nome, m.email, m.cadeira, m.cidade, m.titulacao, m.instagram, m.bio ?? "", m.fullHistory ?? "", m.foto ?? "", m.palestras, m.dataRegistro].map(q).join(", ")});`);
}
out.push("");
for (const m of INITIAL_MEMBERS) for (const p of m.pagamentos) {
  out.push(`insert into public.payments (member_id, mes_referencia, tipo, valor, status, data, metodo) values (${[p.memberId, p.mesReferencia, p.tipo, p.valor, p.status, p.data, p.metodo].map(q).join(", ")});`);
}
out.push("");
for (const b of INITIAL_BOOKS) {
  out.push(`insert into public.books (id, member_id, titulo, subtitulo, sinopse, capa_url, genero, faixa_etaria, data_publicacao, preco, links_venda, tags, status, created_at) values (${[b.id, b.memberId, b.titulo, b.subtitulo, b.sinopse, b.capaUrl, b.genero, b.faixaEtaria, b.dataPublicacao, b.preco, b.linksVenda, b.tags, b.status, b.createdAt].map(q).join(", ")});`);
}
out.push("");
for (const m of INITIAL_MUSICS) {
  out.push(`insert into public.musics (id, member_id, titulo, descricao, capa_url, tipo, plataforma, link_externo, tags, status, created_at) values (${[m.id, m.memberId, m.titulo, m.descricao, m.capaUrl, m.tipo, m.plataforma, m.linkExterno, m.tags, m.status, m.createdAt].map(q).join(", ")});`);
}
console.log(out.join("\n"));
