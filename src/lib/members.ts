import {
  getMembers,
  getMemberByCode as dbGetMemberByCode,
  getMemberById as dbGetMemberById,
  upsertMember as dbUpsertMember,
  createMember as dbCreateMember,
  type DBMember,
  type DBPayment,
} from "./db";

export type Member = DBMember;
export type Payment = DBPayment;

export function seedIfEmpty(): void {
  // Chamada de seed garantida dentro de getMembers()
  getMembers();
}

export function getAllMembers(): DBMember[] {
  return getMembers();
}

export function getMemberByCode(code: string): DBMember | null {
  return dbGetMemberByCode(code);
}

export function getMemberById(id: string): DBMember | null {
  return dbGetMemberById(id);
}

export function registerMember(data: Partial<DBMember> & { nome: string }): DBMember {
  return dbCreateMember(data);
}

export function activateMember(code: string): void {
  const member = dbGetMemberByCode(code);
  if (member) {
    dbUpsertMember({ id: member.id, status: "ativo" });
  }
}

export function recordPayment(payment: Omit<DBPayment, "id">): DBPayment {
  const members = getMembers();
  const member = members.find(m => m.id === payment.memberId || m.code === payment.memberId);
  if (!member) throw new Error("Membro não encontrado");
  
  const fullPayment: DBPayment = {
    ...payment,
    id: "p_" + Math.random().toString(36).substring(2, 9),
  };
  
  member.pagamentos = member.pagamentos || [];
  member.pagamentos.push(fullPayment);
  if (payment.status === "pago") {
    member.status = "ativo";
  }
  dbUpsertMember(member);
  return fullPayment;
}

export function getMembersCSV(): string {
  const members = getMembers();
  const header = "Código,Nome,Email,Cadeira,Cidade,Status,Data Registro,Último Pagamento";
  const rows = members.map((m) => {
    const lastPago = (m.pagamentos || []).filter((p) => p.status === "pago").at(-1);
    return [
      m.code,
      m.nome,
      m.email,
      m.cadeira,
      m.cidade,
      m.status,
      new Date(m.dataRegistro).toLocaleDateString("pt-BR"),
      lastPago ? lastPago.data : "–",
    ]
      .map((v) => `"${v}"`)
      .join(",");
  });
  return [header, ...rows].join("\n");
}

