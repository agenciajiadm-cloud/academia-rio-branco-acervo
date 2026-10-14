"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown,
  CheckCircle, Clock, XCircle, X, ExternalLink, Calendar,
  CreditCard, BookOpen, Music, Shield, UserPlus, Sparkles
} from "lucide-react";
import {
  getMembers, upsertMember, createMember, deleteMember, generateNextMemberCode,
  type DBMember
} from "@/lib/db";
import { useDbSync } from "@/lib/useDbSync";
import DbStatus from "@/components/DbStatus";

type SortKey = "nome" | "status" | "cidade" | "dataRegistro" | "code";
type SortDir = "asc" | "desc";

const EMPTY_MEMBER: Partial<DBMember> = {
  nome: "",
  code: "",
  role: "associado",
  status: "ativo",
  cadeira: "",
  titulacao: "",
  cidade: "Macapá, AP",
  email: "",
  instagram: "",
  foto: "",
  bio: "",
  fullHistory: "",
  palestras: true,
};

export default function DiretorAutores() {
  const [members, setMembers] = useState<DBMember[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"todos" | "diretor" | "associado">("todos");
  
  // Modal state
  const [modal, setModal] = useState<{ open: boolean; isNew: boolean; data: Partial<DBMember> }>({
    open: false,
    isNew: false,
    data: { ...EMPTY_MEMBER },
  });

  // Delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState<DBMember | null>(null);

  useEffect(() => {
    document.body.style.overflow = modal.open || !!deleteConfirm ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal.open, deleteConfirm]);

  const { loading, error } = useDbSync(async () => {
    setMembers(await getMembers({ todos: true }));
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const matchesSearch =
        m.nome.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.cidade.toLowerCase().includes(q) ||
        (m.cadeira || "").toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (filterRole !== "todos" && m.role !== filterRole) return false;

      return true;
    });
  }, [members, search, filterRole]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = String(a[sortKey] ?? "").toLowerCase();
      const bv = String(b[sortKey] ?? "").toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv, "pt") : bv.localeCompare(av, "pt");
    });
  }, [filtered, sortKey, sortDir]);

  function lastPayment(m: DBMember): string {
    const pago = (m.pagamentos ?? [])
      .filter((p) => p.status === "pago")
      .sort((a, b) => a.mesReferencia.localeCompare(b.mesReferencia))
      .at(-1);
    if (!pago) return "—";
    const [y, mo, d] = pago.data.slice(0, 10).split("-");
    return `${d}/${mo}/${y}`;
  }

  async function openNew() {
    const nextCode = await generateNextMemberCode().catch(() => "");
    setModal({
      open: true,
      isNew: true,
      data: {
        ...EMPTY_MEMBER,
        code: nextCode,
      },
    });
  }

  function openEdit(m: DBMember) {
    setModal({ open: true, isNew: false, data: { ...m } });
  }

  async function handleSave() {
    const d = modal.data;
    if (!d.nome?.trim()) {
      alert("Por favor, preencha o nome do integrante.");
      return;
    }

    try {
      if (modal.isNew) {
        await createMember(d as DBMember);
      } else {
        if (!d.id) return;
        await upsertMember(d as DBMember & { id: string });
      }
      setModal({ open: false, isNew: false, data: {} });
    } catch (e) {
      alert("Não foi possível salvar: " + (e as Error).message);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteConfirm) return;
    try {
      await deleteMember(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (e) {
      alert("Não foi possível excluir: " + (e as Error).message);
    }
  }

  function setField<K extends keyof DBMember>(k: K, v: DBMember[K]) {
    setModal((m) => ({ ...m, data: { ...m.data, [k]: v } }));
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="w-4 h-4 text-gray-400 inline ml-1" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-4 h-4 text-black inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 text-black inline ml-1" />
    );
  }

  const th =
    "text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold whitespace-nowrap select-none cursor-pointer hover:text-black transition-colors";
  const td = "px-4 py-4 text-base";

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="mb-6 empty:hidden"><DbStatus loading={loading} error={error} /></div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black">
            Quadro de Imortais & Integrantes
          </h1>
          <p className="text-gray-500 text-base mt-1">
            Gestão dos membros titulares, patronos, biografias e credenciais de acesso.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-black text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors shrink-0 shadow-sm"
        >
          <UserPlus className="w-5 h-5 text-accent" />
          Novo Integrante
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, código, cadeira, email..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black focus:bg-white transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase mr-1">Papel:</span>
          {[
            { id: "todos", label: "Todos" },
            { id: "diretor", label: "Diretoria" },
            { id: "associado", label: "Associados" },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setFilterRole(r.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterRole === r.id ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabela desktop ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left w-[72px]">Foto</th>
                <th className={th} onClick={() => toggleSort("code")}>Código <SortIcon col="code" /></th>
                <th className={th} onClick={() => toggleSort("nome")}>Nome do Imortal <SortIcon col="nome" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left">Cadeira / Patrono</th>
                <th className={`${th} hidden 2xl:table-cell`} onClick={() => toggleSort("cidade")}>Cidade <SortIcon col="cidade" /></th>
                <th className="hidden 2xl:table-cell px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left">Email</th>
                <th className={th} onClick={() => toggleSort("status")}>Status <SortIcon col="status" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left whitespace-nowrap">Últ. Pagamento</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400 text-base">
                    Nenhum integrante encontrado.
                  </td>
                </tr>
              )}
              {sorted.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-11 h-11 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200">
                      {m.foto ? (
                        <Image src={m.foto} fill alt={m.nome} className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-base">
                          {m.nome[0]}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-brand text-sm">
                    {m.code}
                  </td>
                  <td className={td}>
                    <p className="font-bold text-black leading-tight text-sm">{m.nome}</p>
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold uppercase mt-1 ${
                      m.role === "diretor" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {m.role === "diretor" ? "Diretoria" : "Associado"}
                    </span>
                  </td>
                  <td className={`${td} text-gray-600 max-w-[220px] truncate text-xs`}>
                    {m.cadeira || "—"}
                  </td>
                  <td className={`${td} hidden 2xl:table-cell text-gray-600 text-xs`}>{m.cidade}</td>
                  <td className={`${td} hidden 2xl:table-cell text-gray-500 text-xs max-w-[180px] truncate`}>{m.email}</td>
                  <td className={td}>
                    <StatusBadge status={m.status} />
                  </td>
                  <td className={`${td} text-gray-500 text-xs`}>{lastPayment(m)}</td>
                  <td className={td}>
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/autor/${m.id}`}
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
                        title="Ver página pública do autor"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openEdit(m)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-black"
                        title="Editar dados e biografia"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(m)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-400 hover:text-red-600"
                        title="Excluir integrante"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
            <span>{sorted.length} de {members.length} integrantes listados</span>
            <Link href="/diretor/mensalidades" className="text-brand font-bold hover:underline flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Ir para Planilha de Mensalidades
            </Link>
          </div>
        )}
      </div>

      {/* ── Cards mobile ── */}
      <div className="md:hidden space-y-4">
        {sorted.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden relative shrink-0 border border-gray-200">
                {m.foto ? (
                  <Image src={m.foto} fill alt={m.nome} className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                    {m.nome[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-black leading-tight">{m.nome}</p>
                <p className="text-brand font-mono font-bold text-xs mt-0.5">{m.code}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{m.cadeira}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <StatusBadge status={m.status} />
              <div className="flex items-center gap-2">
                <Link
                  href={`/autor/${m.id}`}
                  target="_blank"
                  className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => openEdit(m)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(m)}
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal de Cadastro / Edição Completa ── */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal((m) => ({ ...m, open: false }));
          }}
        >
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl my-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 bg-gray-50">
              <div>
                <h2 className="text-xl font-serif font-black text-black">
                  {modal.isNew ? "Cadastrar Novo Integrante" : "Editar Dados do Imortal"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {modal.isNew ? "Adicione um novo membro ao quadro oficial da Academia." : "Atualize biografia, cadeira e dados de contato."}
                </p>
              </div>
              <button
                onClick={() => setModal((m) => ({ ...m, open: false }))}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Código & Papel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Código de Acesso *</label>
                  <input
                    value={modal.data.code ?? ""}
                    onChange={(e) => setField("code", e.target.value.toUpperCase())}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-brand outline-none focus:border-black bg-gray-50"
                    placeholder="#001006"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Papel / Função</label>
                  <select
                    value={modal.data.role ?? "associado"}
                    onChange={(e) => setField("role", e.target.value as any)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white"
                  >
                    <option value="associado">Associado / Imortal</option>
                    <option value="diretor">Diretoria / Presidente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Geral</label>
                  <select
                    value={modal.data.status ?? "ativo"}
                    onChange={(e) => setField("status", e.target.value as any)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="pendente">Pendente</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              {/* Nome Completo */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Nome Completo *</label>
                <input
                  value={modal.data.nome ?? ""}
                  onChange={(e) => setField("nome", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black font-semibold"
                  placeholder="Ex: João da Silva"
                />
              </div>

              {/* Cadeira & Titulação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Cadeira / Patrono</label>
                  <input
                    value={modal.data.cadeira ?? ""}
                    onChange={(e) => setField("cadeira", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                    placeholder="Ex: Patrono Machado de Assis — Cadeira 02"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Titulação Acadêmica</label>
                  <input
                    value={modal.data.titulacao ?? ""}
                    onChange={(e) => setField("titulacao", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                    placeholder="Ex: Doutor em Letras, Mestre em História..."
                  />
                </div>
              </div>

              {/* Cidade & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Cidade / UF</label>
                  <input
                    value={modal.data.cidade ?? ""}
                    onChange={(e) => setField("cidade", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                    placeholder="Ex: Macapá, AP"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">E-mail de Contato</label>
                  <input
                    type="email"
                    value={modal.data.email ?? ""}
                    onChange={(e) => setField("email", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                    placeholder="autor@exemplo.com"
                  />
                </div>
              </div>

              {/* Instagram & Foto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Instagram (Link Completo)</label>
                  <input
                    value={modal.data.instagram ?? ""}
                    onChange={(e) => setField("instagram", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                    placeholder="https://instagram.com/perfil"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Foto (URL da Imagem)</label>
                  <input
                    value={modal.data.foto ?? ""}
                    onChange={(e) => setField("foto", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                    placeholder="/imagens/autor.jpg ou https://..."
                  />
                </div>
              </div>

              {/* Bio Resumida */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Bio Resumida (Exibida nos cards de autores e vitrines)
                </label>
                <textarea
                  value={modal.data.bio ?? ""}
                  onChange={(e) => setField("bio", e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black resize-none"
                  placeholder="Apresentação curta em 1 ou 2 frases..."
                />
              </div>

              {/* Biografia Completa */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Biografia Completa / Trajetória Histórica (Página do Autor)
                </label>
                <textarea
                  value={modal.data.fullHistory ?? ""}
                  onChange={(e) => setField("fullHistory", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
                  placeholder="Texto completo narrando a história de vida, formação, conquistas e obras publicadas..."
                />
              </div>

              {/* Palestras Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <p className="text-sm font-bold text-black">Habilitar Botão de Palestras</p>
                  <p className="text-xs text-gray-500">Exibe convite para contratação de palestras na página do autor.</p>
                </div>
                <input
                  type="checkbox"
                  checked={modal.data.palestras ?? true}
                  onChange={(e) => setField("palestras", e.target.checked)}
                  className="w-5 h-5 accent-black cursor-pointer rounded"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex gap-3 justify-end border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setModal((m) => ({ ...m, open: false }))}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors shadow-sm"
              >
                {modal.isNew ? "Cadastrar Integrante" : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de Confirmação de Exclusão ── */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-black text-center text-black">
              Confirmar Exclusão
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Tem certeza que deseja remover <strong>{deleteConfirm.nome}</strong> ({deleteConfirm.code}) do quadro de membros?
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
              >
                Sim, Excluir Membro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: DBMember["status"] }) {
  const map = {
    ativo: { label: "Ativo", cls: "bg-green-100 text-green-700", icon: CheckCircle },
    pendente: { label: "Pendente", cls: "bg-amber-100 text-amber-700", icon: Clock },
    inativo: { label: "Inativo", cls: "bg-gray-100 text-gray-500", icon: XCircle },
  };
  const { label, cls, icon: Icon } = map[status] || map.ativo;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cls}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
