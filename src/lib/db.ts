/**
 * Camada de dados unificada — localStorage hoje, Supabase depois.
 * Para migrar: substituir cada função pelo equivalente do Supabase client.
 * Nenhuma página precisa ser alterada, só este arquivo.
 */

import { seedIfEmpty } from "./members";

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
  fullBio?: string;
  foto?: string;
  dataNascimento?: string;
  palestras: boolean;
  status: "ativo" | "pendente" | "inativo";
  dataRegistro: string;
  pagamentos: DBPayment[];
}

export interface DBPayment {
  id: string;
  memberId: string;
  mesReferencia: string; // "2026-04"
  tipo: "mensal" | "recorrente";
  valor: number;
  status: "pago" | "pendente" | "falhou";
  data: string;
  mpPaymentId?: string;
}

// ─── Chaves ─────────────────────────────────────────────────────────────────

const KEYS = {
  books:   "academia_books",
  musics:  "academia_musics_v2",
  members: "academia_members",
} as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key) ?? "[]"); } catch { return []; }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function uid(): string {
  return crypto.randomUUID();
}

// ─── BOOKS ──────────────────────────────────────────────────────────────────

export function getBooks(): DBBook[] {
  const books = load<DBBook>(KEYS.books);
  if (books.length === 0) seedBooks();
  return load<DBBook>(KEYS.books);
}

export function getBooksByMember(memberId: string): DBBook[] {
  return getBooks().filter(b => b.memberId === memberId);
}

export function upsertBook(data: Omit<DBBook, "id" | "createdAt"> & { id?: string }): DBBook {
  const books = getBooks();
  if (data.id) {
    const idx = books.findIndex(b => b.id === data.id);
    const updated = { ...data, id: data.id, createdAt: books[idx]?.createdAt ?? new Date().toISOString() } as DBBook;
    if (idx >= 0) books[idx] = updated; else books.push(updated);
    save(KEYS.books, books);
    return updated;
  }
  const novo: DBBook = { ...data, id: uid(), createdAt: new Date().toISOString() } as DBBook;
  books.push(novo);
  save(KEYS.books, books);
  return novo;
}

export function deleteBook(id: string): void {
  save(KEYS.books, getBooks().filter(b => b.id !== id));
}

// ─── MUSICS ─────────────────────────────────────────────────────────────────

export function getMusics(): DBMusic[] {
  const musics = load<DBMusic>(KEYS.musics);
  if (musics.length === 0) seedMusics();
  return load<DBMusic>(KEYS.musics);
}

export function getMusicsByMember(memberId: string): DBMusic[] {
  return getMusics().filter(m => m.memberId === memberId);
}

export function upsertMusic(data: Omit<DBMusic, "id" | "createdAt"> & { id?: string }): DBMusic {
  const musics = getMusics();
  if (data.id) {
    const idx = musics.findIndex(m => m.id === data.id);
    const updated = { ...data, id: data.id, createdAt: musics[idx]?.createdAt ?? new Date().toISOString() } as DBMusic;
    if (idx >= 0) musics[idx] = updated; else musics.push(updated);
    save(KEYS.musics, musics);
    return updated;
  }
  const novo: DBMusic = { ...data, id: uid(), createdAt: new Date().toISOString() } as DBMusic;
  musics.push(novo);
  save(KEYS.musics, musics);
  return novo;
}

export function deleteMusic(id: string): void {
  save(KEYS.musics, getMusics().filter(m => m.id !== id));
}

// ─── MEMBERS ────────────────────────────────────────────────────────────────

export function getMembers(): DBMember[] {
  seedIfEmpty();
  return load<DBMember>(KEYS.members);
}

export function getMemberByCode(code: string): DBMember | null {
  const normalized = code.startsWith("#") ? code : `#${code}`;
  return getMembers().find(m => m.code === normalized) ?? null;
}

export function getMemberById(id: string): DBMember | null {
  return getMembers().find(m => m.id === id) ?? null;
}

export function upsertMember(data: Partial<DBMember> & { id: string }): void {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === data.id);
  if (idx >= 0) members[idx] = { ...members[idx], ...data };
  save(KEYS.members, members);
}

// ─── SESSION ────────────────────────────────────────────────────────────────

export function setSession(member: DBMember): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("academia_session", JSON.stringify(member));
}

export function getSession(): DBMember | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(sessionStorage.getItem("academia_session") ?? "null"); } catch { return null; }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("academia_session");
}

// ─── SEEDS ──────────────────────────────────────────────────────────────────

function seedBooks(): void {
  const members = getMembers();
  const policarpo = members.find(m => m.code === "#001001");
  const elaine = members.find(m => m.code === "#001002");

  const initial: DBBook[] = [
    {
      id: "b1", memberId: policarpo?.id ?? "",
      titulo: "O Forte", subtitulo: "A Defesa do Último Bastião",
      sinopse: "A defesa de um império contada pela ótica dos sobreviventes. Uma obra-prima literária ambientada na Amazônia profunda, onde o passado e o presente se entrelaçam num épico de coragem e identidade.",
      capaUrl: "/imagens/policarpo-novo.jpg", genero: "Romance", faixaEtaria: "Adulto (18+)",
      dataPublicacao: "2024-01-01",
      linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }, { plataforma: "saraiva", url: "https://saraiva.com.br" }],
      tags: ["amazônia", "história", "épico"], status: "publicado", createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "b2", memberId: policarpo?.id ?? "",
      titulo: "Pensamentos na Escuridão", subtitulo: "",
      sinopse: "Uma coleção de poesias que navega pelos recantos mais sombrios da alma humana, transformando a dor em beleza literária através de versos que ecoam pela floresta amazônida.",
      capaUrl: "/imagens/policarpo-novo.jpg", genero: "Poesia", faixaEtaria: "Adulto (18+)",
      dataPublicacao: "2023-06-01",
      linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
      tags: ["poesia", "amazônia", "introspectivo"], status: "publicado", createdAt: "2023-06-01T00:00:00.000Z",
    },
    {
      id: "b3", memberId: elaine?.id ?? "",
      titulo: "Passos na Memória", subtitulo: "",
      sinopse: "Entre saberes e fazeres, a autora conduz o leitor por uma jornada de memórias educativas e culturais, tecendo histórias da Amazônia com fios de esperança e resistência.",
      capaUrl: "/imagens/elaine-araujo.jpg", genero: "Crônica", faixaEtaria: "Adulto (18+)",
      dataPublicacao: "2025-03-01",
      linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
      tags: ["memória", "educação", "cultura"], status: "publicado", createdAt: "2025-03-01T00:00:00.000Z",
    },
  ];
  save(KEYS.books, initial);
}

function seedMusics(): void {
  const members = getMembers();
  const elaine = members.find(m => m.code === "#001002");
  const mathias = members.find(m => m.code === "#001005");

  const initial: DBMusic[] = [
    {
      id: "m1", memberId: elaine?.id ?? "",
      titulo: "Voz da Floresta", descricao: "Composição autoral que celebra a biodiversidade amazônica",
      capaUrl: "/imagens/elaine-araujo.jpg", tipo: "Música Autoral", plataforma: "spotify",
      linkExterno: "https://open.spotify.com", tags: ["amazônia", "natureza"],
      status: "publicado", createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "m2", memberId: mathias?.id ?? "",
      titulo: "Bárbara — Audiolivro", descricao: "Versão em áudio do romance aclamado pela crítica literária",
      capaUrl: "/imagens/mathias-alencar.jpg", tipo: "Audiolivro", plataforma: "youtube",
      linkExterno: "https://youtube.com", tags: ["romance", "audiolivro"],
      status: "publicado", createdAt: "2025-06-01T00:00:00.000Z",
    },
  ];
  save(KEYS.musics, initial);
}
