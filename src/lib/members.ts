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

export async function getAllMembers(): Promise<DBMember[]> {
  return getMembers({ todos: true });
}

export async function getMemberByCode(code: string): Promise<DBMember | null> {
  return dbGetMemberByCode(code);
}

export async function getMemberById(id: string): Promise<DBMember | null> {
  return dbGetMemberById(id);
}

export async function registerMember(data: Partial<DBMember> & { nome: string }): Promise<DBMember> {
  return dbCreateMember(data);
}

export async function activateMember(code: string): Promise<void> {
  const member = await dbGetMemberByCode(code, { todos: true });
  if (member) {
    await dbUpsertMember({ id: member.id, status: "ativo" });
  }
}

export async function getMembersCSV(): Promise<string> {
  const members = await getMembers({ todos: true });
  const header = "Código,Nome,Email,Cadeira,Cidade,Status,Data Registro,Último Pagamento";
  const rows = members.map((m) => {
    const lastPago = (m.pagamentos || [])
      .filter((p) => p.status === "pago")
      .sort((a, b) => a.mesReferencia.localeCompare(b.mesReferencia))
      .at(-1);
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
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });
  return [header, ...rows].join("\n");
}
