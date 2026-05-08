"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  ChevronsUpDown, X, PlusCircle, MinusCircle,
} from "lucide-react";
import {
  getBooks, upsertBook, deleteBook, getMembers,
  type DBBook, type DBMember,
} from "@/lib/db";
import { GENEROS, FAIXAS_ETARIAS, PLATAFORMAS_VENDA } from "@/lib/tags";

type SortKey = "titulo" | "genero" | "faixaEtaria" | "dataPublicacao" | "status";
type SortDir  = "asc" | "desc";

const EMPTY_BOOK: Partial<DBBook> = {
  memberId: "", titulo: "", subtitulo: "", sinopse: "",
  capaUrl: "", genero: GENEROS[0], faixaEtaria: FAIXAS_ETARIAS[3],
  dataPublicacao: "", linksVenda: [], tags: [], status: "rascunho",
};

export default function DiretorLivros() {
  const [books,   setBooks]   = useState<DBBook[]>([]);
  const [members, setMembers] = useState<DBMember[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("titulo");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [search,  setSearch]  = useState("");
  const [modal,   setModal]   = useState<{ open: boolean; data: Partial<DBBook> }>({
    open: false, data: { ...EMPTY_BOOK },
  });

  useEffect(() => {
    document.body.style.overflow = modal.open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal.open]);

  function reload() {
    setBooks(getBooks());
    setMembers(getMembers() as DBMember[]);
  }

  useEffect(() => { reload(); }, []);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return books.filter(b =>
      b.titulo.toLowerCase().includes(q) ||
      b.genero.toLowerCase().includes(q) ||
      memberName(b.memberId).toLowerCase().includes(q)
    );
  }, [books, search, members]);

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

  function openNew() {
    setModal({ open: true, data: { ...EMPTY_BOOK } });
  }

  function openEdit(book: DBBook) {
    setModal({ open: true, data: { ...book, linksVenda: [...(book.linksVenda ?? [])] } });
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir este livro permanentemente?")) return;
    deleteBook(id);
    reload();
  }

  function handleSave() {
    const d = modal.data;
    if (!d.titulo?.trim()) { alert("Título obrigatório"); return; }
    if (!d.memberId)        { alert("Selecione um autor"); return; }
    upsertBook(d as Omit<DBBook, "id" | "createdAt"> & { id?: string });
    reload();
    setModal({ open: false, data: { ...EMPTY_BOOK } });
  }

  function setField<K extends keyof DBBook>(k: K, v: DBBook[K]) {
    setModal(m => ({ ...m, data: { ...m.data, [k]: v } }));
  }

  function addLink() {
    setModal(m => ({
      ...m,
      data: {
        ...m.data,
        linksVenda: [...(m.data.linksVenda ?? []), { plataforma: "amazon", url: "" }],
      },
    }));
  }

  function updateLink(i: number, field: "plataforma" | "url", val: string) {
    setModal(m => {
      const links = [...(m.data.linksVenda ?? [])];
      links[i] = { ...links[i], [field]: val };
      return { ...m, data: { ...m.data, linksVenda: links } };
    });
  }

  function removeLink(i: number) {
    setModal(m => {
      const links = (m.data.linksVenda ?? []).filter((_, idx) => idx !== i);
      return { ...m, data: { ...m.data, linksVenda: links } };
    });
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
          <h1 className="text-3xl md:text-4xl font-serif font-black">Livros</h1>
          <p className="text-gray-500 text-lg mt-1">{books.length} obra{books.length !== 1 ? "s" : ""} cadastrada{books.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Plus className="w-5 h-5" />
          Novo Livro
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por título, gênero ou autor…"
          className="w-full border border-gray-200 rounded-xl px-5 py-3 text-base outline-none focus:border-black bg-white"
        />
      </div>

      {/* ── Tabela desktop ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left w-[72px]">Capa</th>
                <th className={th} onClick={() => toggleSort("titulo")}>Título <SortIcon col="titulo" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left">Autor</th>
                <th className={th} onClick={() => toggleSort("genero")}>Gênero <SortIcon col="genero" /></th>
                <th className={th} onClick={() => toggleSort("faixaEtaria")}>Faixa Etária <SortIcon col="faixaEtaria" /></th>
                <th className={th} onClick={() => toggleSort("dataPublicacao")}>Data <SortIcon col="dataPublicacao" /></th>
                <th className={th} onClick={() => toggleSort("status")}>Status <SortIcon col="status" /></th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-bold text-left">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400 text-lg">
                    {books.length === 0 ? "Nenhum livro cadastrado." : "Nenhum resultado."}
                  </td>
                </tr>
              )}
              {sorted.map(book => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-11 h-16 bg-gray-100 rounded overflow-hidden relative shrink-0">
                      {book.capaUrl && (
                        <Image src={book.capaUrl} fill alt={book.titulo} className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className={td}>
                    <p className="font-bold text-black leading-tight">{book.titulo}</p>
                    {book.subtitulo && <p className="text-sm text-gray-400 mt-0.5">{book.subtitulo}</p>}
                  </td>
                  <td className={`${td} text-gray-600 max-w-[180px] truncate`}>{memberName(book.memberId)}</td>
                  <td className={td}><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">{book.genero}</span></td>
                  <td className={`${td} text-gray-600 text-sm`}>{book.faixaEtaria}</td>
                  <td className={`${td} text-gray-500 text-sm`}>
                    {book.dataPublicacao ? new Date(book.dataPublicacao + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className={td}>
                    <StatusBadge status={book.status} />
                  </td>
                  <td className={td}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(book)}
                        className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-2.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
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
            {sorted.length} de {books.length} livros
          </div>
        )}
      </div>

      {/* ── Cards mobile ── */}
      <div className="md:hidden space-y-4">
        {sorted.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 text-lg">
            {books.length === 0 ? "Nenhum livro cadastrado." : "Nenhum resultado."}
          </div>
        )}
        {sorted.map(book => (
          <div key={book.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
            <div className="w-16 h-24 bg-gray-100 rounded-lg overflow-hidden relative shrink-0">
              {book.capaUrl && <Image src={book.capaUrl} fill alt={book.titulo} className="object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg leading-tight text-black">{book.titulo}</p>
              <p className="text-gray-500 text-base mt-1">{memberName(book.memberId)}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-sm font-medium">{book.genero}</span>
                <StatusBadge status={book.status} />
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => openEdit(book)} className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <Pencil className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={() => handleDelete(book.id)} className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ──────────────────────────────────────────── */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-8 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setModal(m => ({ ...m, open: false })); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold">
                {modal.data.id ? "Editar Livro" : "Novo Livro"}
              </h2>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Autor */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Autor *</label>
                <select
                  value={modal.data.memberId ?? ""}
                  onChange={e => setField("memberId", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                >
                  <option value="">Selecione o autor…</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Título *</label>
                <input
                  value={modal.data.titulo ?? ""}
                  onChange={e => setField("titulo", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="Título do livro"
                />
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo</label>
                <input
                  value={modal.data.subtitulo ?? ""}
                  onChange={e => setField("subtitulo", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="Opcional"
                />
              </div>

              {/* Sinopse */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sinopse</label>
                <textarea
                  value={modal.data.sinopse ?? ""}
                  onChange={e => setField("sinopse", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black resize-none"
                  placeholder="Descrição do livro…"
                />
              </div>

              {/* URL da Capa */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL da Capa</label>
                <input
                  value={modal.data.capaUrl ?? ""}
                  onChange={e => setField("capaUrl", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="/imagens/capa.jpg ou https://…"
                />
              </div>

              {/* Gênero + Faixa Etária */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Gênero</label>
                  <select
                    value={modal.data.genero ?? ""}
                    onChange={e => setField("genero", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Faixa Etária</label>
                  <select
                    value={modal.data.faixaEtaria ?? ""}
                    onChange={e => setField("faixaEtaria", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    {FAIXAS_ETARIAS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Data + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Data de Publicação</label>
                  <input
                    type="date"
                    value={modal.data.dataPublicacao ?? ""}
                    onChange={e => setField("dataPublicacao", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
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

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                <input
                  value={(modal.data.tags ?? []).join(", ")}
                  onChange={e => setField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="amazônia, poesia, história (separe por vírgula)"
                />
              </div>

              {/* Links de Venda */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700">Links de Venda</label>
                  <button onClick={addLink} className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
                    <PlusCircle className="w-4 h-4" /> Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {(modal.data.linksVenda ?? []).map((link, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select
                        value={link.plataforma}
                        onChange={e => updateLink(i, "plataforma", e.target.value)}
                        className="border border-gray-200 rounded-xl px-3 py-2.5 text-base outline-none focus:border-black bg-white shrink-0"
                      >
                        {PLATAFORMAS_VENDA.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </select>
                      <input
                        value={link.url}
                        onChange={e => updateLink(i, "url", e.target.value)}
                        placeholder="https://…"
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-base outline-none focus:border-black"
                      />
                      <button onClick={() => removeLink(i)} className="p-2 hover:bg-red-50 rounded-lg shrink-0">
                        <MinusCircle className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  ))}
                  {(modal.data.linksVenda ?? []).length === 0 && (
                    <p className="text-sm text-gray-400 italic">Nenhum link adicionado.</p>
                  )}
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
                {modal.data.id ? "Salvar Alterações" : "Cadastrar Livro"}
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
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
      Publicado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-500">
      Rascunho
    </span>
  );
}
