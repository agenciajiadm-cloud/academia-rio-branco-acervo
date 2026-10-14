/**
 * Camada de dados unificada da Academia de Letras Barão do Rio Branco.
 * Armazenamento reativo local hoje (localStorage + CustomEvents), 100% pronto para Supabase.
 */

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

// ─── Chaves ─────────────────────────────────────────────────────────────────

const KEYS = {
  books:   "academia_books_v3",
  musics:  "academia_musics_v3",
  members: "academia_members_v3",
} as const;

const EVENT_NAME = "academia_db_updated";

// ─── Helpers ────────────────────────────────────────────────────────────────

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
  notify();
}

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "id_" + Math.random().toString(36).substring(2, 11);
}

// ─── SEED DATA ──────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: DBMember[] = [
  {
    id: "policarpo",
    code: "#001001",
    role: "diretor",
    nome: "José Policarpo Miranda Junior",
    email: "Dr.PolicarpoEngenheiro@outlook.pt",
    cadeira: "Patrono 01 — Presidente",
    cidade: "Macapá, AP",
    titulacao: "Engenheiro Florestal, Doutor em Biotecnologia e Biodiversidade",
    instagram: "https://www.instagram.com/policarpo.junior.311",
    bio: "Escritor, pintor, fotógrafo e pesquisador. Presidente da Academia de Letras Barão do Rio Branco.",
    fullHistory: "Com atuação multifacetada, pesquisador, professor, gestor público, escritor e acadêmico, José Policarpo Miranda Junior construiu uma carreira marcada pelo comprometimento com a defesa ambiental, com a ciência e com a cultura. Nascido em Belém do Pará, é Engenheiro Florestal, Doutor em Biotecnologia e Biodiversidade pela Universidade Federal do Amapá – UNIFAP. Presidente da Academia de Letras Barão do Rio Branco. Sua obra, tanto científica quanto literária, contribui para o fortalecimento do pensamento amazônida e para a divulgação de saberes que valorizam a biodiversidade, a educação, a história e a identidade regional.",
    foto: "/imagens/policarpo-novo.jpg",
    palestras: true,
    status: "ativo",
    dataRegistro: "2025-01-26T10:00:00.000Z",
    pagamentos: [
      { id: "p1_1", memberId: "policarpo", mesReferencia: "2026-01", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-01-10", metodo: "pix" },
      { id: "p1_2", memberId: "policarpo", mesReferencia: "2026-02", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-02-10", metodo: "pix" },
      { id: "p1_3", memberId: "policarpo", mesReferencia: "2026-03", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-03-10", metodo: "pix" },
      { id: "p1_4", memberId: "policarpo", mesReferencia: "2026-04", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-04-10", metodo: "pix" },
    ],
  },
  {
    id: "elaine-araujo",
    code: "#001002",
    role: "associado",
    nome: "Elaine Araújo",
    email: "elaine.a3@icloud.com",
    cadeira: "Cadeira Castro Alves",
    cidade: "Santana, AP",
    titulacao: "Mestranda em Letras, Especialista em Docência Superior, Pedagoga",
    instagram: "https://www.instagram.com/elainearaujoferreira_tv",
    bio: "Professora Mestranda em Letras, compositora, poetisa e produtora cultural do Amapá.",
    fullHistory: "Professora Mestranda do curso de Letras, Literatura e Críticas Literárias da PUC-Goiás, Especialista em Docência do Ensino Superior pela Faculdade CETE. Graduada em Licenciatura em Pedagogia pelo IFPA e em Teologia pela FATECH. Presidente da Fundação de Cultura de Santana-Amapá de 2022 a 2023. Autora dos Hinos Municipais de Santana (1989) e Laranjal do Jari (1995) e do livro 'Dicionário Caboquês'.",
    foto: "/imagens/elaine-araujo.jpg",
    palestras: true,
    status: "ativo",
    dataRegistro: "2025-01-26T10:00:00.000Z",
    pagamentos: [
      { id: "p2_1", memberId: "elaine-araujo", mesReferencia: "2026-01", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-01-15", metodo: "pix" },
      { id: "p2_2", memberId: "elaine-araujo", mesReferencia: "2026-02", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-02-15", metodo: "pix" },
      { id: "p2_3", memberId: "elaine-araujo", mesReferencia: "2026-03", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-03-15", metodo: "pix" },
      { id: "p2_4", memberId: "elaine-araujo", mesReferencia: "2026-04", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-04-15", metodo: "pix" },
    ],
  },
  {
    id: "jacqueline-pharlan",
    code: "#001003",
    role: "associado",
    nome: "Jacqueline Pharlan de Camargo",
    email: "jakepharlan@hotmail.com",
    cadeira: "Patrono Ivo Cannuty — Cadeira 052",
    cidade: "Macapá, AP",
    titulacao: "Mestre em Educação, Engenheira de Segurança do Trabalho",
    instagram: "https://www.instagram.com/jacquepharlan",
    bio: "Professora de inglês, Engenheira de Segurança do Trabalho, escritora e cicloativista com obras publicadas nacional e internacionalmente.",
    fullHistory: "Jacqueline Pharlan de Camargo é professora de inglês, Engenheira de Segurança do Trabalho, escritora e cicloativista. Mestre em Educação com ênfase em gestão educacional e em Tecnologias Emergentes. Livros publicados sobre Cicloturismo, poesias e contos em coletâneas. Participou de feiras culturais como o Equinócio das Águas e Feira Internacional do Livro de Caiena.",
    foto: "/imagens/jacqueline-pharlan.jpg",
    palestras: true,
    status: "ativo",
    dataRegistro: "2025-01-26T10:00:00.000Z",
    pagamentos: [
      { id: "p3_1", memberId: "jacqueline-pharlan", mesReferencia: "2026-01", tipo: "recorrente", valor: 49.9, status: "pago", data: "2026-01-10", metodo: "cartao" },
      { id: "p3_2", memberId: "jacqueline-pharlan", mesReferencia: "2026-02", tipo: "recorrente", valor: 49.9, status: "pago", data: "2026-02-10", metodo: "cartao" },
      { id: "p3_3", memberId: "jacqueline-pharlan", mesReferencia: "2026-03", tipo: "recorrente", valor: 49.9, status: "pago", data: "2026-03-10", metodo: "cartao" },
      { id: "p3_4", memberId: "jacqueline-pharlan", mesReferencia: "2026-04", tipo: "recorrente", valor: 49.9, status: "pago", data: "2026-04-10", metodo: "cartao" },
    ],
  },
  {
    id: "maria-lucia-coelho",
    code: "#001004",
    role: "associado",
    nome: "Maria Lúcia Coelho",
    email: "luciacoelhoadv@uol.com.br",
    cadeira: "Patrono Maria Beatriz do Nascimento — Cadeira 51",
    cidade: "Macapá, AP",
    titulacao: "Advogada, Mestra em Comunicação, Doutoranda em Educação",
    instagram: "",
    bio: "Escritora, poetisa, advogada, mestra em Comunicação e doutoranda em Educação.",
    fullHistory: "Nascida em Afuá, Estado do Pará. Mestra em Comunicação, Linguagens e Cultura e Doutoranda em Educação. Assistente Social, Advogada. Autora do livro de poesias 'Sinfonia de Emoções', além de obras nas categorias crônicas e contos.",
    foto: "/imagens/maria-lucia-coelho.jpg",
    palestras: true,
    status: "ativo",
    dataRegistro: "2026-04-22T14:12:00.000Z",
    pagamentos: [
      { id: "p4_1", memberId: "maria-lucia-coelho", mesReferencia: "2026-04", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-04-22", metodo: "pix" },
    ],
  },
  {
    id: "mathias-alencar",
    code: "#001005",
    role: "associado",
    nome: "Cesar Augusto Mathias de Alencar",
    email: "escoladeescrita@gmail.com",
    cadeira: "Patrono João Cabral de Melo Neto — Cadeira 50",
    cidade: "Macapá, AP",
    titulacao: "Doutor em Filosofia (UFRJ), Professor Efetivo UNIFAP e UFPA",
    instagram: "https://www.instagram.com/mathiasdealencar",
    bio: "Poeta e professor de Filosofia. Doutor pela UFRJ, autor de três livros de poesia e do romance Bárbara.",
    fullHistory: "Mathias de Alencar é poeta e professor. Doutor em Filosofia pela UFRJ, é docente efetivo de Filosofia na UNIFAP e pós-graduação da UFPA. Autor de 'Ninguém há de doar-se a dois amores ou Julieta' (2023), 'Poem(a)limpo' e 'Bárbara'.",
    foto: "/imagens/mathias-alencar.jpg",
    palestras: true,
    status: "ativo",
    dataRegistro: "2026-04-26T11:34:00.000Z",
    pagamentos: [
      { id: "p5_1", memberId: "mathias-alencar", mesReferencia: "2026-04", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-04-26", metodo: "pix" },
    ],
  },
];

const INITIAL_BOOKS: DBBook[] = [
  {
    id: "b1",
    memberId: "policarpo",
    titulo: "O Forte",
    subtitulo: "A defesa de um império",
    sinopse: "Uma imersão na cultura e na força dos defensores do nosso território. Obra de maturidade poética e política ambientada na Amazônia profunda.",
    capaUrl: "/images/capa-forte.png",
    genero: "Romance",
    faixaEtaria: "Adulto (18+)",
    dataPublicacao: "2024-01-01",
    preco: 49.9,
    linksVenda: [
      { plataforma: "amazon", url: "https://amazon.com.br" },
      { plataforma: "mercado", url: "https://mercadolivre.com.br" },
    ],
    tags: ["amazônia", "história", "épico"],
    status: "publicado",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "b2",
    memberId: "policarpo",
    titulo: "Samurai de Carvão",
    subtitulo: "A honra nas chamas escurecidas",
    sinopse: "Um mergulho denso no mundo distópico, onde a honra molda as espadas no limite da realidade moderna.",
    capaUrl: "/images/capa-samurai.png",
    genero: "Ficção Científica",
    faixaEtaria: "Adulto (18+)",
    dataPublicacao: "2023-08-01",
    preco: 69.9,
    linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
    tags: ["ficção", "honra", "distopia"],
    status: "publicado",
    createdAt: "2023-08-01T00:00:00.000Z",
  },
  {
    id: "b3",
    memberId: "policarpo",
    titulo: "A Vila",
    subtitulo: "Histórias do extremo Norte",
    sinopse: "Os mitos e vivências amazônicas recontados pela vivência intrínseca com os ribeirinhos e povos originários.",
    capaUrl: "/images/capa-vila.png",
    genero: "Conto",
    faixaEtaria: "Adulto (18+)",
    dataPublicacao: "2023-11-01",
    preco: 39.9,
    linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
    tags: ["amazônia", "contos", "ribeirinhos"],
    status: "publicado",
    createdAt: "2023-11-01T00:00:00.000Z",
  },
  {
    id: "b4",
    memberId: "policarpo",
    titulo: "Pensamentos na Escuridão",
    subtitulo: "A traição do destino",
    sinopse: "Um convite poético a entender os labirintos do ciúme, da dúvida e da memória abstrata.",
    capaUrl: "/images/capa-pensamentos.png",
    genero: "Poesia",
    faixaEtaria: "Adulto (18+)",
    dataPublicacao: "2023-06-01",
    preco: 35.0,
    linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
    tags: ["poesia", "filosofia", "introspecção"],
    status: "publicado",
    createdAt: "2023-06-01T00:00:00.000Z",
  },
  {
    id: "b5",
    memberId: "policarpo",
    titulo: "Passos Perdidos",
    subtitulo: "Onde terminam os caminhos",
    sinopse: "Uma obra investigativa e literária recheada de ação e reflexões sobre a história amapaense.",
    capaUrl: "/images/capa-passos.png",
    genero: "Crônica",
    faixaEtaria: "Adulto (18+)",
    dataPublicacao: "2024-02-01",
    preco: 45.0,
    linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
    tags: ["crônica", "amapá", "investigação"],
    status: "publicado",
    createdAt: "2024-02-01T00:00:00.000Z",
  },
  {
    id: "b6",
    memberId: "policarpo",
    titulo: "Caipira",
    subtitulo: "A caminhada eterna",
    sinopse: "A aridez da terra e a magia do interior do Brasil retratadas em prosa poética envolvente.",
    capaUrl: "/images/capa-caipira.png",
    genero: "Romance",
    faixaEtaria: "Adulto (18+)",
    dataPublicacao: "2024-05-01",
    preco: 59.9,
    linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
    tags: ["cultura", "brasil", "romance"],
    status: "publicado",
    createdAt: "2024-05-01T00:00:00.000Z",
  },
  {
    id: "b7",
    memberId: "policarpo",
    titulo: "Turminha",
    subtitulo: "O futuro nas entrelinhas",
    sinopse: "A perspectiva encantadora das crianças e do aprendizado lúdico na primeira idade.",
    capaUrl: "/images/capa-turminha.png",
    genero: "Literatura Infantil",
    faixaEtaria: "Infantil (0–8 anos)",
    dataPublicacao: "2024-09-01",
    preco: 29.9,
    linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
    tags: ["infantil", "educação", "leitura"],
    status: "publicado",
    createdAt: "2024-09-01T00:00:00.000Z",
  },
  {
    id: "b8",
    memberId: "elaine-araujo",
    titulo: "Dicionário Caboquês",
    subtitulo: "A Língua do Cabuçu nas Brenhas da Amazônia",
    sinopse: "Entre saberes e fazeres, um resgate etnolinguístico das expressões caboclas e tradições orais do Amapá e do Norte.",
    capaUrl: "/imagens/elaine-araujo.jpg",
    genero: "Acadêmico",
    faixaEtaria: "Todas as idades",
    dataPublicacao: "2025-03-01",
    preco: 49.9,
    linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
    tags: ["caboquês", "amazônia", "linguística", "cultura"],
    status: "publicado",
    createdAt: "2025-03-01T00:00:00.000Z",
  },
  {
    id: "b9",
    memberId: "mathias-alencar",
    titulo: "Bárbara",
    subtitulo: "Edição Especial 10 Anos",
    sinopse: "Romance aclamado pela crítica literária. Uma narrativa sensorial que explora as imagens e sons das palavras como potências estéticas.",
    capaUrl: "/imagens/mathias-alencar.jpg",
    genero: "Romance",
    faixaEtaria: "Adulto (18+)",
    dataPublicacao: "2025-06-01",
    preco: 54.9,
    linksVenda: [{ plataforma: "amazon", url: "https://amazon.com.br" }],
    tags: ["romance", "filosofia", "literatura"],
    status: "publicado",
    createdAt: "2025-06-01T00:00:00.000Z",
  },
];

const INITIAL_MUSICS: DBMusic[] = [
  {
    id: "m1",
    memberId: "elaine-araujo",
    titulo: "Hino de Santana e Vozes da Floresta",
    descricao: "Composições e hinos oficiais celebrando a história e a biodiversidade amazônica.",
    capaUrl: "/imagens/elaine-araujo.jpg",
    tipo: "Música Autoral",
    plataforma: "spotify",
    linkExterno: "https://open.spotify.com",
    tags: ["amazônia", "hinos", "santana"],
    status: "publicado",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "m2",
    memberId: "mathias-alencar",
    titulo: "Bárbara — Audiolivro & Poesias Faladas",
    descricao: "Versão falada com declamações poéticas e trilha incidental acústica.",
    capaUrl: "/imagens/mathias-alencar.jpg",
    tipo: "Audiolivro",
    plataforma: "youtube",
    linkExterno: "https://youtube.com",
    tags: ["audiolivro", "poesia", "teatral"],
    status: "publicado",
    createdAt: "2025-06-01T00:00:00.000Z",
  },
  {
    id: "m3",
    memberId: "policarpo",
    titulo: "Contos e Memórias do Amapá",
    descricao: "Gravação especial de contos narrados pelo Presidente da Academia.",
    capaUrl: "/imagens/policarpo-novo.jpg",
    tipo: "Podcast Literário",
    plataforma: "spotify",
    linkExterno: "https://open.spotify.com",
    tags: ["história", "amapá", "podcast"],
    status: "publicado",
    createdAt: "2025-02-01T00:00:00.000Z",
  },
];

function seedIfEmpty(): void {
  if (typeof window === "undefined") return;
  const existingMembers = localStorage.getItem(KEYS.members);
  if (!existingMembers) {
    localStorage.setItem(KEYS.members, JSON.stringify(INITIAL_MEMBERS));
  }
  const existingBooks = localStorage.getItem(KEYS.books);
  if (!existingBooks) {
    localStorage.setItem(KEYS.books, JSON.stringify(INITIAL_BOOKS));
  }
  const existingMusics = localStorage.getItem(KEYS.musics);
  if (!existingMusics) {
    localStorage.setItem(KEYS.musics, JSON.stringify(INITIAL_MUSICS));
  }
}

// ─── MEMBERS (INTEGRANTES & DIRETORES) ──────────────────────────────────────

export function getMembers(): DBMember[] {
  seedIfEmpty();
  const members = load<DBMember>(KEYS.members);
  return members.length > 0 ? members : INITIAL_MEMBERS;
}

export function getMemberByCode(code: string): DBMember | null {
  const clean = code.trim().toUpperCase();
  const normalized = clean.startsWith("#") ? clean : `#${clean}`;
  return getMembers().find(m => m.code.toUpperCase() === normalized) ?? null;
}

export function getMemberById(id: string): DBMember | null {
  return getMembers().find(m => m.id === id) ?? null;
}

export function generateNextMemberCode(): string {
  const members = getMembers();
  const numericCodes = members
    .map(m => parseInt(m.code.replace(/\D/g, ""), 10))
    .filter(n => !isNaN(n) && n > 0);
  const max = numericCodes.length > 0 ? Math.max(...numericCodes) : 1005;
  const next = max + 1;
  return `#${next.toString().padStart(6, "0")}`;
}

export function createMember(data: Partial<DBMember> & { nome: string }): DBMember {
  const members = getMembers();
  const rawId = data.id?.trim() || data.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const id = rawId || uid();
  
  const code = data.code?.trim().startsWith("#") ? data.code.trim().toUpperCase() : `#${(data.code?.trim() || generateNextMemberCode().replace("#", "")).toUpperCase()}`;

  const newMember: DBMember = {
    nome: data.nome.trim(),
    email: data.email?.trim() || "",
    cadeira: data.cadeira?.trim() || "",
    cidade: data.cidade?.trim() || "Macapá, AP",
    titulacao: data.titulacao?.trim() || "",
    instagram: data.instagram?.trim() || "",
    foto: data.foto?.trim() || "",
    bio: data.bio?.trim() || "",
    fullHistory: data.fullHistory?.trim() || "",
    palestras: data.palestras !== false,
    ...data,
    id,
    code,
    role: data.role || "associado",
    status: data.status || "ativo",
    dataRegistro: data.dataRegistro || new Date().toISOString(),
    pagamentos: data.pagamentos || [],
  };

  members.push(newMember);
  save(KEYS.members, members);
  return newMember;
}

export function upsertMember(data: Partial<DBMember> & { id: string }): DBMember {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === data.id);
  if (idx >= 0) {
    members[idx] = { ...members[idx], ...data };
    save(KEYS.members, members);
    return members[idx];
  } else {
    return createMember(data as any);
  }
}

export function deleteMember(id: string): void {
  const members = getMembers().filter(m => m.id !== id);
  save(KEYS.members, members);
}

// ─── MENSALIDADES / CONTROLE FINANCEIRO ESTILO EXCEL ───────────────────────

export function getMemberMonthlyPayment(memberId: string, mesReferencia: string): DBPayment | null {
  const member = getMemberById(memberId);
  if (!member || !member.pagamentos) return null;
  return member.pagamentos.find(p => p.mesReferencia === mesReferencia) ?? null;
}

/**
 * Alterna rapidamente o status do mês de um membro:
 * Sem registro -> Pago (R$ 49,90) -> Pendente -> Isento -> Pago...
 */
export function toggleMonthlyPayment(
  memberId: string,
  mesReferencia: string,
  forceStatus?: "pago" | "pendente" | "isento",
  valor: number = 49.9,
  observacao?: string
): DBPayment {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === memberId);
  if (idx === -1) throw new Error("Membro não encontrado");

  const member = members[idx];
  member.pagamentos = member.pagamentos || [];
  const pIdx = member.pagamentos.findIndex(p => p.mesReferencia === mesReferencia);

  let nextStatus: "pago" | "pendente" | "isento" = forceStatus ?? "pago";

  if (!forceStatus) {
    if (pIdx === -1) {
      nextStatus = "pago";
    } else {
      const current = member.pagamentos[pIdx].status;
      if (current === "pago") nextStatus = "pendente";
      else if (current === "pendente") nextStatus = "isento";
      else nextStatus = "pago";
    }
  }

  const paymentData: DBPayment = {
    id: pIdx >= 0 ? member.pagamentos[pIdx].id : uid(),
    memberId,
    mesReferencia,
    tipo: "mensal",
    valor: nextStatus === "isento" ? 0 : (valor || 49.9),
    status: nextStatus,
    data: new Date().toISOString().split("T")[0],
    metodo: "pix",
    observacao: observacao || (pIdx >= 0 ? member.pagamentos[pIdx].observacao : undefined),
  };

  if (pIdx >= 0) {
    member.pagamentos[pIdx] = paymentData;
  } else {
    member.pagamentos.push(paymentData);
  }

  save(KEYS.members, members);
  return paymentData;
}

export function setBulkMonthlyPayment(
  mesReferencia: string,
  status: "pago" | "pendente" | "isento",
  valor: number = 49.9
): void {
  const members = getMembers();
  members.forEach(member => {
    if (member.status === "inativo") return;
    member.pagamentos = member.pagamentos || [];
    const pIdx = member.pagamentos.findIndex(p => p.mesReferencia === mesReferencia);
    const item: DBPayment = {
      id: pIdx >= 0 ? member.pagamentos[pIdx].id : uid(),
      memberId: member.id,
      mesReferencia,
      tipo: "mensal",
      valor: status === "isento" ? 0 : valor,
      status,
      data: new Date().toISOString().split("T")[0],
      metodo: "pix",
    };
    if (pIdx >= 0) member.pagamentos[pIdx] = item;
    else member.pagamentos.push(item);
  });
  save(KEYS.members, members);
}

// ─── BOOKS (LIVROS DO ACERVO) ───────────────────────────────────────────────

export function getBooks(): DBBook[] {
  seedIfEmpty();
  const books = load<DBBook>(KEYS.books);
  return books.length > 0 ? books : INITIAL_BOOKS;
}

export function getBooksByMember(memberId: string): DBBook[] {
  return getBooks().filter(b => b.memberId === memberId);
}

export function upsertBook(data: Omit<DBBook, "id" | "createdAt"> & { id?: string }): DBBook {
  const books = getBooks();
  if (data.id) {
    const idx = books.findIndex(b => b.id === data.id);
    const updated = {
      ...data,
      id: data.id,
      createdAt: books[idx]?.createdAt ?? new Date().toISOString(),
    } as DBBook;
    if (idx >= 0) books[idx] = updated;
    else books.push(updated);
    save(KEYS.books, books);
    return updated;
  }
  const novo: DBBook = {
    ...data,
    id: "b_" + uid().slice(0, 8),
    createdAt: new Date().toISOString(),
  } as DBBook;
  books.push(novo);
  save(KEYS.books, books);
  return novo;
}

export function deleteBook(id: string): void {
  save(KEYS.books, getBooks().filter(b => b.id !== id));
}

// ─── MUSICS (MÚSICAS & AUDIOLIVROS) ─────────────────────────────────────────

export function getMusics(): DBMusic[] {
  seedIfEmpty();
  const musics = load<DBMusic>(KEYS.musics);
  return musics.length > 0 ? musics : INITIAL_MUSICS;
}

export function getMusicsByMember(memberId: string): DBMusic[] {
  return getMusics().filter(m => m.memberId === memberId);
}

export function upsertMusic(data: Omit<DBMusic, "id" | "createdAt"> & { id?: string }): DBMusic {
  const musics = getMusics();
  if (data.id) {
    const idx = musics.findIndex(m => m.id === data.id);
    const updated = {
      ...data,
      id: data.id,
      createdAt: musics[idx]?.createdAt ?? new Date().toISOString(),
    } as DBMusic;
    if (idx >= 0) musics[idx] = updated;
    else musics.push(updated);
    save(KEYS.musics, musics);
    return updated;
  }
  const novo: DBMusic = {
    ...data,
    id: "m_" + uid().slice(0, 8),
    createdAt: new Date().toISOString(),
  } as DBMusic;
  musics.push(novo);
  save(KEYS.musics, musics);
  return novo;
}

export function deleteMusic(id: string): void {
  save(KEYS.musics, getMusics().filter(m => m.id !== id));
}

// ─── BACKUP & RESTAURAÇÃO DE DADOS ──────────────────────────────────────────

export function exportDatabaseBackup(): string {
  const backup = {
    version: "3.0",
    exportDate: new Date().toISOString(),
    members: getMembers(),
    books: getBooks(),
    musics: getMusics(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importDatabaseBackup(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data.members) || !Array.isArray(data.books)) {
      return { success: false, message: "Arquivo de backup inválido." };
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.members, JSON.stringify(data.members));
      localStorage.setItem(KEYS.books, JSON.stringify(data.books));
      if (Array.isArray(data.musics)) {
        localStorage.setItem(KEYS.musics, JSON.stringify(data.musics));
      }
      notify();
    }
    return { success: true, message: `Backup importado com sucesso: ${data.members.length} membros e ${data.books.length} livros.` };
  } catch (err: any) {
    return { success: false, message: "Erro ao processar arquivo: " + err.message };
  }
}

export function resetToDefaultData(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.members, JSON.stringify(INITIAL_MEMBERS));
  localStorage.setItem(KEYS.books, JSON.stringify(INITIAL_BOOKS));
  localStorage.setItem(KEYS.musics, JSON.stringify(INITIAL_MUSICS));
  notify();
}

