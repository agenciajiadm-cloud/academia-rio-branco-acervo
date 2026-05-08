// Member management — localStorage hoje, Supabase depois
// Para migrar: trocar as funções abaixo por chamadas ao Supabase client

export interface Member {
  id: string;
  code: string;          // #009390 format
  role: "diretor" | "associado";
  nome: string;
  email: string;
  cadeira: string;
  cidade: string;
  titulacao: string;
  instagram: string;
  palestras: boolean;
  status: "ativo" | "pendente" | "inativo";
  dataRegistro: string;  // ISO string
  pagamentos: Payment[];
}

export interface Payment {
  id: string;
  memberId: string;
  tipo: "mensal" | "recorrente";
  valor: number;
  status: "pago" | "pendente" | "falhou";
  data: string; // ISO string
  mpPaymentId?: string;
}

const STORAGE_KEY = "academia_members";
const PAYMENTS_KEY = "academia_payments";

const SEED_MEMBERS: Omit<Member, "id">[] = [
  {
    code: "#001001",
    role: "diretor",
    nome: "José Policarpo Miranda Junior",
    email: "Dr.PolicarpoEngenheiro@outlook.pt",
    cadeira: "Patrono 01 — Presidente",
    cidade: "Macapá, AP",
    titulacao: "Doutor em Biotecnologia e Biodiversidade, Engenheiro Florestal",
    instagram: "https://www.instagram.com/policarpo.junior.311",
    palestras: true,
    status: "ativo",
    dataRegistro: "2025-01-26T10:00:00.000Z",
    pagamentos: [{ id: "p1", memberId: "#001001", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-04-01T10:00:00.000Z" }],
  },
  {
    code: "#001002",
    role: "associado",
    nome: "Elaine Araújo",
    email: "elaine.a3@icloud.com",
    cadeira: "Cadeira Castro Alves",
    cidade: "Santana, AP",
    titulacao: "Mestranda em Letras, Especialista em Docência Superior",
    instagram: "https://www.instagram.com/elainearaujoferreira_tv",
    palestras: true,
    status: "ativo",
    dataRegistro: "2025-01-26T10:00:00.000Z",
    pagamentos: [{ id: "p2", memberId: "#001002", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-04-01T10:00:00.000Z" }],
  },
  {
    code: "#001003",
    role: "associado",
    nome: "Jacqueline Pharlan de Camargo",
    email: "jakepharlan@hotmail.com",
    cadeira: "Patrono Ivo Cannuty — Cadeira 052",
    cidade: "Macapá, AP",
    titulacao: "Mestre em Educação, Engenheira de Segurança do Trabalho",
    instagram: "https://www.instagram.com/jacquepharlan",
    palestras: true,
    status: "ativo",
    dataRegistro: "2025-01-26T10:00:00.000Z",
    pagamentos: [{ id: "p3", memberId: "#001003", tipo: "recorrente", valor: 49.9, status: "pago", data: "2026-04-01T10:00:00.000Z" }],
  },
  {
    code: "#001004",
    role: "associado",
    nome: "Maria Lúcia Coelho",
    email: "luciacoelhoadv@uol.com.br",
    cadeira: "Patrono Maria Beatriz do Nascimento — Cadeira 51",
    cidade: "Macapá, AP",
    titulacao: "Advogada, Mestra em Comunicação, Doutoranda em Educação",
    instagram: "",
    palestras: true,
    status: "pendente",
    dataRegistro: "2026-04-22T14:12:00.000Z",
    pagamentos: [],
  },
  {
    code: "#001005",
    role: "associado",
    nome: "Cesar Augusto Mathias de Alencar",
    email: "escoladeescrita@gmail.com",
    cadeira: "Patrono João Cabral de Melo Neto — Cadeira 50",
    cidade: "Macapá, AP",
    titulacao: "Doutor em Filosofia (UFRJ), Professor Efetivo UNIFAP e UFPA",
    instagram: "https://www.instagram.com/mathiasdealencar",
    palestras: true,
    status: "ativo",
    dataRegistro: "2026-04-26T11:34:00.000Z",
    pagamentos: [{ id: "p5", memberId: "#001005", tipo: "mensal", valor: 49.9, status: "pago", data: "2026-04-26T12:00:00.000Z" }],
  },
];

export function seedIfEmpty(): void {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      if (parsed.length > 0 && parsed[0].role !== undefined) return;
    } catch { /* re-seed */ }
  }
  const seeded = SEED_MEMBERS.map((m) => ({ ...m, id: crypto.randomUUID() }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
}

function generateCode(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `#${num}`;
}

function loadMembers(): Member[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMembers(members: Member[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function registerMember(data: Omit<Member, "id" | "code" | "role" | "status" | "dataRegistro" | "pagamentos">): Member {
  const members = loadMembers();
  const member: Member = {
    ...data,
    id: crypto.randomUUID(),
    code: generateCode(),
    role: "associado",
    status: "pendente",
    dataRegistro: new Date().toISOString(),
    pagamentos: [],
  };
  members.push(member);
  saveMembers(members);
  return member;
}

export function getMemberByCode(code: string): Member | null {
  const normalized = code.startsWith("#") ? code : `#${code}`;
  const members = loadMembers();
  return members.find((m) => m.code === normalized) ?? null;
}

export function getAllMembers(): Member[] {
  return loadMembers();
}

export function activateMember(code: string): void {
  const members = loadMembers();
  const idx = members.findIndex((m) => m.code === code);
  if (idx >= 0) {
    members[idx].status = "ativo";
    saveMembers(members);
  }
}

export function recordPayment(payment: Omit<Payment, "id">): Payment {
  const members = loadMembers();
  const idx = members.findIndex((m) => m.id === payment.memberId);
  const full: Payment = { ...payment, id: crypto.randomUUID() };
  if (idx >= 0) {
    members[idx].pagamentos.push(full);
    if (payment.status === "pago") members[idx].status = "ativo";
    saveMembers(members);
  }
  return full;
}

export function getMembersCSV(): string {
  const members = loadMembers();
  const header = "Código,Nome,Email,Cadeira,Cidade,Status,Data Registro,Último Pagamento";
  const rows = members.map((m) => {
    const lastPago = m.pagamentos.filter((p) => p.status === "pago").at(-1);
    return [
      m.code,
      m.nome,
      m.email,
      m.cadeira,
      m.cidade,
      m.status,
      new Date(m.dataRegistro).toLocaleDateString("pt-BR"),
      lastPago ? new Date(lastPago.data).toLocaleDateString("pt-BR") : "–",
    ]
      .map((v) => `"${v}"`)
      .join(",");
  });
  return [header, ...rows].join("\n");
}
