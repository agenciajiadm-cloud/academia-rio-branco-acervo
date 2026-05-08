"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Users, CheckCircle, Clock, XCircle, Search, Lock } from "lucide-react";
import { getAllMembers, getMembersCSV, seedIfEmpty, type Member } from "@/lib/members";

const ADMIN_CODE = "ADMIN2026";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [authError, setAuthError] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (auth) {
      seedIfEmpty();
      setMembers(getAllMembers());
    }
  }, [auth]);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (inputCode === ADMIN_CODE) {
      setAuth(true);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  }

  function downloadCSV() {
    const csv = getMembersCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `associados_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = members.filter(
    (m) =>
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.code.includes(search) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const ativos = members.filter((m) => m.status === "ativo").length;
  const pendentes = members.filter((m) => m.status === "pendente").length;

  if (!auth) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 pt-32 pb-24">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 w-full max-w-sm text-center">
          <div className="w-14 h-14 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-serif font-bold mb-2">Painel Administrativo</h1>
          <p className="text-gray-400 text-sm mb-8">Acesso restrito à diretoria</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Código de acesso"
              className={`w-full border rounded-md p-3 text-center font-mono tracking-widest outline-none bg-gray-50 ${
                authError ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-brand"
              }`}
            />
            {authError && <p className="text-red-500 text-xs">Código incorreto</p>}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 font-bold rounded-sm hover:bg-zinc-800 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-serif font-black text-black">Painel Administrativo</h1>
            <p className="text-gray-500 text-sm mt-1">Academia de Letras Barão do Rio Branco</p>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-zinc-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Users, label: "Total de Associados", value: members.length, color: "bg-blue-50 text-blue-600" },
            { icon: CheckCircle, label: "Ativos", value: ativos, color: "bg-green-50 text-green-600" },
            { icon: Clock, label: "Pendentes de Pagamento", value: pendentes, color: "bg-amber-50 text-amber-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-3xl font-bold text-black">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabela / Planilha */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, código ou email..."
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  {["Código", "Nome", "Cadeira", "Cidade", "E-mail", "Status", "Cadastro", "Ações"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      {members.length === 0
                        ? "Nenhum associado cadastrado ainda."
                        : "Nenhum resultado para esta busca."}
                    </td>
                  </tr>
                )}
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-brand">{m.code}</td>
                    <td className="px-4 py-3 font-medium">{m.nome}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{m.cadeira || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{m.cidade}</td>
                    <td className="px-4 py-3 text-gray-500">{m.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(m.dataRegistro).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/mensalidade?code=${encodeURIComponent(m.code)}`}
                        target="_blank"
                        className="text-brand text-xs font-bold hover:underline"
                      >
                        Ver pagamento
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="p-4 text-xs text-gray-400 border-t border-gray-100">
              {filtered.length} de {members.length} associados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Member["status"] }) {
  const map = {
    ativo: { label: "Ativo", class: "bg-green-100 text-green-700", icon: CheckCircle },
    pendente: { label: "Pendente", class: "bg-amber-100 text-amber-700", icon: Clock },
    inativo: { label: "Inativo", class: "bg-gray-100 text-gray-500", icon: XCircle },
  };
  const { label, class: cls, icon: Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
