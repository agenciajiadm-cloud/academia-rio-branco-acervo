"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  ChevronsUpDown, X, ExternalLink,
} from "lucide-react";
import {
  getMusics, upsertMusic, deleteMusic, getMembers,
  type DBMusic, type DBMember,
} from "@/lib/db";
import { TIPOS_MUSICA, PLATAFORMAS_AUDIO } from "@/lib/tags";

type SortKey = "titulo" | "tipo" | "plataforma" | "status";
type SortDir  = "asc" | "desc";

const EMPTY: Partial<DBMusic> = {
  memberId: "", titulo: "", descricao: "", capaUrl: "",
  tipo: TIPOS_MUSICA[0], plataforma: "spotify",
  linkExterno: "", tags: [], status: "rascunho",
};

export default function DiretorMusicas() {
  const [musics,  setMusics]  = useState<DBMusic[]>([]);
  const [members, setMembers] = useState<DBMember[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("titulo");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState<{ open: boolean; data: Partial<DBMusic> }>({
    open: false, data: { ...EMPTY },
  });

  useEffect(() => {
    document.body.style.overflow = modal.open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal.open]);

  function reload() {
    setMusics(getMusics());
    setMembers(getMembers() as DBMember[]);
  }

  useEffect(() => { reload(); }, []);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return musics.filter(m =>
      m.titulo.toLowerCase().includes(q) ||
      m.tipo.toLowerCase().includes(q) ||
      memberName(m.memberId).toLowerCase().includes(q)
    );
  }, [musics, search, members]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = String(a[sortKey] ?? "").toLowerCase();
      const bv = String(b[sortKey] ?? "").toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv, "pt") : bv.localeCompare(av, "pt");
    });
  }, [filtered, sortKey, sortDir]);

  function memberName(id: string) {
    return members.find(m => m.id === id)?.nome ?? "—";
  }

  function platformLabel(id: string) {
    return PLATAFORMAS_AUDIO.find(p => p.id === id)?.label ?? id;
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir esta música?")) return;
    deleteMusic(id);
    reload();
  }

  function handleSave() {
    const d = modal.data;
    if (!d.titulo?.trim()) { alert("Título obrigatório"); return; }
    if (!d.memberId)        { alert("Selecione um autor"); return; }
    upsertMusic(d as Omit<DBMusic, "id" | "createdAt"> & { id?: string });
    reload();
    setModal({ open: false, data: { ...EMPTY } });
  }

  function setField<K extends keyof DBMusic>(k: K, v: DBMusic[K]) {
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
          <h1 className="text-3xl md:text-4xl font-serif font-black">Músicas</h1>
          <p className="text-gray-500 text-lg mt-1">{musics.length} registro{musics.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setModal({ open: true, data: { ...EMPTY } })}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Plus className="w-5 h-5" />
          Nova Música
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por título, tipo ou autor…"
          className="w-full border border-gray-200 rounded-xl px-5 py-3 text-base outline-none focus:border-black bg-white"
        />
      </div>

      {/* ── Tabela desktop ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left w-[72px]">Capa</th>
                <th className={th} onClick={() => toggleSort("titulo")}>Título <SortIcon col="titulo" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left">Autor</th>
                <th className={th} onClick={() => toggleSort("tipo")}>Tipo <SortIcon col="tipo" /></th>
                <th className={th} onClick={() => toggleSort("plataforma")}>Plataforma <SortIcon col="plataforma" /></th>
                <th className={th} onClick={() => toggleSort("status")}>Status <SortIcon col="status" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400 text-lg">
                    {musics.length === 0 ? "Nenhuma música cadastrada." : "Nenhum resultado."}
                  </td>
                </tr>
              )}
              {sorted.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
                      {m.capaUrl && <Image src={m.capaUrl} fill alt={m.titulo} className="object-cover" />}
                    </div>
                  </td>
                  <td className={td}>
                    <p className="font-bold text-black leading-tight">{m.titulo}</p>
                    {m.linkExterno && (
                      <a href={m.linkExterno} target="_blank" rel="noreferrer"
                        className="text-sm text-brand hover:underline flex items-center gap-1 mt-0.5">
                        <ExternalLink className="w-3 h-3" /> Ouvir
                      </a>
                    )}
                  </td>
                  <td className={`${td} text-gray-600 max-w-[180px] truncate`}>{memberName(m.memberId)}</td>
                  <td className={td}><span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-sm font-medium">{m.tipo}</span></td>
                  <td className={`${td} text-gray-600`}>{platformLabel(m.plataforma)}</td>
                  <td className={td}><StatusBadge status={m.status} /></td>
                  <td className={td}>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal({ open: true, data: { ...m, tags: [...(m.tags ?? [])] } })}
                        className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors" title="Editar">
                        <Pencil className="w-5 h-5 text-gray-600" />
                      </button>
                      <button onClick={() => handleDelete(m.id)}
                        className="p-2.5 rounded-lg hover:bg-red-50 transition-colors" title="Excluir">
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sorted.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-sm text-gray-400">
            {sorted.length} de {musics.length} registros
          </div>
        )}
      </div>

      {/* ── Cards mobile ── */}
      <div className="md:hidden space-y-4">
        {sorted.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-lg">
            {musics.length === 0 ? "Nenhuma música cadastrada." : "Nenhum resultado."}
          </div>
        )}
        {sorted.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden relative shrink-0">
              {m.capaUrl && <Image src={m.capaUrl} fill alt={m.titulo} className="object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg leading-tight text-black">{m.titulo}</p>
              <p className="text-gray-500 text-base mt-1">{memberName(m.memberId)}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-sm font-medium">{m.tipo}</span>
                <StatusBadge status={m.status} />
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => setModal({ open: true, data: { ...m } })}
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Pencil className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={() => handleDelete(m.id)}
                className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-8 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setModal(m => ({ ...m, open: false })); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl my-4">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold">
                {modal.data.id ? "Editar Música" : "Nova Música"}
              </h2>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Autor *</label>
                <select
                  value={modal.data.memberId ?? ""}
                  onChange={e => setField("memberId", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                >
                  <option value="">Selecione o autor…</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Título *</label>
                <input
                  value={modal.data.titulo ?? ""}
                  onChange={e => setField("titulo", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="Nome da obra"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={modal.data.descricao ?? ""}
                  onChange={e => setField("descricao", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black resize-none"
                  placeholder="Breve descrição…"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL da Capa</label>
                <input
                  value={modal.data.capaUrl ?? ""}
                  onChange={e => setField("capaUrl", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="/imagens/capa.jpg ou https://…"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tipo</label>
                  <select
                    value={modal.data.tipo ?? ""}
                    onChange={e => setField("tipo", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    {TIPOS_MUSICA.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Plataforma</label>
                  <select
                    value={modal.data.plataforma ?? ""}
                    onChange={e => setField("plataforma", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    {PLATAFORMAS_AUDIO.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Link Externo</label>
                <input
                  value={modal.data.linkExterno ?? ""}
                  onChange={e => setField("linkExterno", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="https://open.spotify.com/…"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                  <input
                    value={(modal.data.tags ?? []).join(", ")}
                    onChange={e => setField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                    placeholder="amazônia, poesia…"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    value={modal.data.status ?? "rascunho"}
                    onChange={e => setField("status", e.target.value as "publicado" | "rascunho")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    <option value="publicado">Publicado</option>
                    <option value="rascunho">Rascunho</option>
                  </select>
                </div>
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
                {modal.data.id ? "Salvar Alterações" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "publicado" | "rascunho" }) {
  return status === "publicado" ? (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">Publicado</span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-500">Rascunho</span>
  );
}
