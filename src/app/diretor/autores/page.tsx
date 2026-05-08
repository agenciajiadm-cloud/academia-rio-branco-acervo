"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Pencil, ChevronUp, ChevronDown, ChevronsUpDown,
  CheckCircle, Clock, XCircle, X,
} from "lucide-react";
import { getMembers, upsertMember, type DBMember } from "@/lib/db";
import { activateMember } from "@/lib/members";

type SortKey = "nome" | "status" | "cidade" | "dataRegistro";
type SortDir  = "asc" | "desc";

export default function DiretorAutores() {
  const [members, setMembers] = useState<DBMember[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState<{ open: boolean; data: Partial<DBMember> }>({
    open: false, data: {},
  });

  useEffect(() => {
    document.body.style.overflow = modal.open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal.open]);

  function reload() {
    setMembers(getMembers() as DBMember[]);
  }

  useEffect(() => { reload(); }, []);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter(m =>
      m.nome.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.cidade.toLowerCase().includes(q)
    );
  }, [members, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = String(a[sortKey] ?? "").toLowerCase();
      const bv = String(b[sortKey] ?? "").toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv, "pt") : bv.localeCompare(av, "pt");
    });
  }, [filtered, sortKey, sortDir]);

  function lastPayment(m: DBMember): string {
    const pago = (m.pagamentos ?? []).filter(p => p.status === "pago").at(-1);
    if (!pago) return "—";
    return new Date(pago.data).toLocaleDateString("pt-BR");
  }

  function openEdit(m: DBMember) {
    setModal({ open: true, data: { ...m } });
  }

  function handleSave() {
    const d = modal.data;
    if (!d.id) return;
    upsertMember(d as DBMember & { id: string });
    if (d.status === "ativo" && d.code) activateMember(d.code);
    reload();
    setModal({ open: false, data: {} });
  }

  function setField<K extends keyof DBMember>(k: K, v: DBMember[K]) {
    setModal(m => ({ ...m, data: { ...m.data, [k]: v } }));
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="w-4 h-4 text-gray-400 inline ml-1" />;
    return sortDir === "asc"
      ? <ChevronUp   className="w-4 h-4 text-black inline ml-1" />
      : <ChevronDown className="w-4 h-4 text-black inline ml-1" />;
  }

  const th = "text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold whitespace-nowrap select-none cursor-pointer hover:text-black transition-colors";
  const td = "px-4 py-4 text-base";

  return (
    <div className="p-4 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-black">Autores</h1>
          <p className="text-gray-500 text-lg mt-1">{members.length} associado{members.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, código, email ou cidade…"
          className="w-full border border-gray-200 rounded-xl px-5 py-3 text-base outline-none focus:border-black bg-white"
        />
      </div>

      {/* ── Tabela desktop ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left w-[72px]">Foto</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left whitespace-nowrap">Código</th>
                <th className={th} onClick={() => toggleSort("nome")}>Nome <SortIcon col="nome" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left">Cadeira</th>
                <th className={th} onClick={() => toggleSort("cidade")}>Cidade <SortIcon col="cidade" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left">Email</th>
                <th className={th} onClick={() => toggleSort("status")}>Status <SortIcon col="status" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left whitespace-nowrap">Últ. Pagamento</th>
                <th className={th} onClick={() => toggleSort("dataRegistro")}>Cadastro <SortIcon col="dataRegistro" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-gray-400 text-lg">
                    {members.length === 0 ? "Nenhum associado." : "Nenhum resultado."}
                  </td>
                </tr>
              )}
              {sorted.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-11 h-11 rounded-full bg-gray-100 overflow-hidden relative">
                      {m.foto
                        ? <Image src={m.foto} fill alt={m.nome} className="object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-base">{m.nome[0]}</div>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-brand text-base">{m.code}</td>
                  <td className={td}>
                    <p className="font-bold text-black leading-tight">{m.nome}</p>
                    <p className="text-sm text-gray-400">{m.role === "diretor" ? "Diretor" : "Associado"}</p>
                  </td>
                  <td className={`${td} text-gray-500 max-w-[200px] truncate text-sm`}>{m.cadeira || "—"}</td>
                  <td className={`${td} text-gray-600`}>{m.cidade}</td>
                  <td className={`${td} text-gray-500 text-sm`}>{m.email}</td>
                  <td className={td}><StatusBadge status={m.status} /></td>
                  <td className={`${td} text-gray-500 text-sm`}>{lastPayment(m)}</td>
                  <td className={`${td} text-gray-500 text-sm`}>
                    {new Date(m.dataRegistro).toLocaleDateString("pt-BR")}
                  </td>
                  <td className={td}>
                    <button
                      onClick={() => openEdit(m)}
                      className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-sm text-gray-400">
            {sorted.length} de {members.length} associados
          </div>
        )}
      </div>

      {/* ── Cards mobile ── */}
      <div className="md:hidden space-y-4">
        {sorted.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-lg">
            {members.length === 0 ? "Nenhum associado." : "Nenhum resultado."}
          </div>
        )}
        {sorted.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden relative shrink-0">
              {m.foto
                ? <Image src={m.foto} fill alt={m.nome} className="object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">{m.nome[0]}</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg leading-tight text-black">{m.nome}</p>
              <p className="text-brand font-mono font-bold text-base mt-0.5">{m.code}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <StatusBadge status={m.status} />
                <span className="text-gray-500 text-sm">{m.cidade}</span>
              </div>
            </div>
            <button
              onClick={() => openEdit(m)}
              className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors self-start shrink-0"
            >
              <Pencil className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        ))}
      </div>

      {/* ── Modal de edição ── */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-8 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setModal(m => ({ ...m, open: false })); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl my-4">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold">Editar Autor</h2>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome</label>
                <input
                  value={modal.data.nome ?? ""}
                  onChange={e => setField("nome", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    value={modal.data.status ?? "pendente"}
                    onChange={e => setField("status", e.target.value as DBMember["status"])}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="pendente">Pendente</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Papel</label>
                  <select
                    value={modal.data.role ?? "associado"}
                    onChange={e => setField("role", e.target.value as DBMember["role"])}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    <option value="associado">Associado</option>
                    <option value="diretor">Diretor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cadeira</label>
                <input
                  value={modal.data.cadeira ?? ""}
                  onChange={e => setField("cadeira", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="Ex: Patrono Machado de Assis — Cadeira 01"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Titulação</label>
                <input
                  value={modal.data.titulacao ?? ""}
                  onChange={e => setField("titulacao", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="Doutor em…, Mestre em…"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cidade</label>
                  <input
                    value={modal.data.cidade ?? ""}
                    onChange={e => setField("cidade", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={modal.data.email ?? ""}
                    onChange={e => setField("email", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Instagram</label>
                <input
                  value={modal.data.instagram ?? ""}
                  onChange={e => setField("instagram", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="https://instagram.com/…"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Foto (URL)</label>
                <input
                  value={modal.data.foto ?? ""}
                  onChange={e => setField("foto", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="/imagens/foto.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bio (resumida)</label>
                <textarea
                  value={modal.data.bio ?? ""}
                  onChange={e => setField("bio", e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black resize-none"
                  placeholder="Breve descrição exibida nos cards…"
                />
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3 justify-end border-t border-gray-100 pt-4">
              <button
                onClick={() => setModal(m => ({ ...m, open: false }))}
                className="px-6 py-3 rounded-xl border border-gray-200 text-base font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-xl bg-black text-white text-base font-bold hover:bg-zinc-800 transition-colors"
              >
                Salvar Alterações
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
    ativo:    { label: "Ativo",    cls: "bg-green-100 text-green-700",  icon: CheckCircle },
    pendente: { label: "Pendente", cls: "bg-amber-100 text-amber-700",  icon: Clock },
    inativo:  { label: "Inativo",  cls: "bg-gray-100 text-gray-500",    icon: XCircle },
  };
  const { label, cls, icon: Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold ${cls}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}
