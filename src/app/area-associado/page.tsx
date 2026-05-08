"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen, Music, LogOut, Settings, Award,
  CheckCircle, Clock, XCircle, Plus, Pencil,
  Trash2, X, PlusCircle, MinusCircle, ExternalLink,
} from "lucide-react";
import {
  getBooksByMember, getMusicsByMember, upsertBook, upsertMusic,
  deleteBook, deleteMusic, upsertMember,
  type DBBook, type DBMusic, type DBMember,
} from "@/lib/db";
import { GENEROS, FAIXAS_ETARIAS, TIPOS_MUSICA, PLATAFORMAS_AUDIO, PLATAFORMAS_VENDA } from "@/lib/tags";
import type { Member } from "@/lib/members";

// Lock/unlock body scroll when modals are open
function useScrollLock(locked: boolean) {
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [locked]);
}

const EMPTY_BOOK: Partial<DBBook> = {
  titulo: "", subtitulo: "", sinopse: "", capaUrl: "",
  genero: GENEROS[0], faixaEtaria: FAIXAS_ETARIAS[3],
  dataPublicacao: "", linksVenda: [], tags: [], status: "rascunho",
};

const EMPTY_MUSIC: Partial<DBMusic> = {
  titulo: "", descricao: "", capaUrl: "",
  tipo: TIPOS_MUSICA[0], plataforma: "spotify",
  linkExterno: "", tags: [], status: "rascunho",
};

export default function AreaAssociado() {
  const router = useRouter();

  const [member, setMember]     = useState<Member | null>(null);
  const [books,  setBooks]      = useState<DBBook[]>([]);
  const [musics, setMusics]     = useState<DBMusic[]>([]);

  // modals
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState<Partial<DBMember>>({});
  const [bookModal,   setBookModal]   = useState<{ open: boolean; data: Partial<DBBook> }>({ open: false, data: {} });
  const [musicModal,  setMusicModal]  = useState<{ open: boolean; data: Partial<DBMusic> }>({ open: false, data: {} });

  const anyModal = profileOpen || bookModal.open || musicModal.open;
  useScrollLock(anyModal);

  function reload(m: Member) {
    setBooks(getBooksByMember(m.id));
    setMusics(getMusicsByMember(m.id));
  }

  useEffect(() => {
    const raw = sessionStorage.getItem("academia_current_member");
    if (!raw) { router.replace("/login"); return; }
    const m: Member = JSON.parse(raw);
    if (m.role === "diretor") { router.replace("/diretor"); return; }
    setMember(m);
    reload(m);
  }, [router]);

  function logout() {
    sessionStorage.removeItem("academia_current_member");
    router.push("/login");
  }

  // ── Profile ──────────────────────────────────────────────
  function openProfile() {
    if (!member) return;
    setProfileData({
      id:        member.id,
      nome:      member.nome,
      titulacao: member.titulacao,
      instagram: member.instagram,
      cidade:    member.cidade,
      foto:      (member as any).foto ?? "",
      bio:       (member as any).bio  ?? "",
    });
    setProfileOpen(true);
  }

  function saveProfile() {
    if (!member || !profileData.id) return;
    upsertMember(profileData as DBMember & { id: string });
    const updated = { ...member, ...profileData };
    sessionStorage.setItem("academia_current_member", JSON.stringify(updated));
    setMember(updated as Member);
    setProfileOpen(false);
  }

  function setPField<K extends keyof DBMember>(k: K, v: DBMember[K]) {
    setProfileData(d => ({ ...d, [k]: v }));
  }

  // ── Books ────────────────────────────────────────────────
  function openNewBook() {
    if (!member) return;
    setBookModal({ open: true, data: { ...EMPTY_BOOK, memberId: member.id } });
  }

  function openEditBook(b: DBBook) {
    setBookModal({ open: true, data: { ...b, linksVenda: [...(b.linksVenda ?? [])] } });
  }

  function saveBook() {
    if (!bookModal.data.titulo?.trim()) { alert("Título obrigatório"); return; }
    upsertBook(bookModal.data as Omit<DBBook, "id" | "createdAt"> & { id?: string });
    reload(member!);
    setBookModal({ open: false, data: {} });
  }

  function removeBook(id: string) {
    if (!confirm("Excluir este livro?")) return;
    deleteBook(id);
    reload(member!);
  }

  function setBField<K extends keyof DBBook>(k: K, v: DBBook[K]) {
    setBookModal(m => ({ ...m, data: { ...m.data, [k]: v } }));
  }

  function addLink() {
    setBookModal(m => ({
      ...m,
      data: { ...m.data, linksVenda: [...(m.data.linksVenda ?? []), { plataforma: "amazon", url: "" }] },
    }));
  }

  function updateLink(i: number, f: "plataforma" | "url", v: string) {
    setBookModal(m => {
      const links = [...(m.data.linksVenda ?? [])];
      links[i] = { ...links[i], [f]: v };
      return { ...m, data: { ...m.data, linksVenda: links } };
    });
  }

  function removeLink(i: number) {
    setBookModal(m => ({
      ...m,
      data: { ...m.data, linksVenda: (m.data.linksVenda ?? []).filter((_, idx) => idx !== i) },
    }));
  }

  // ── Music ────────────────────────────────────────────────
  function openNewMusic() {
    if (!member) return;
    setMusicModal({ open: true, data: { ...EMPTY_MUSIC, memberId: member.id } });
  }

  function openEditMusic(m: DBMusic) {
    setMusicModal({ open: true, data: { ...m } });
  }

  function saveMusic() {
    if (!musicModal.data.titulo?.trim()) { alert("Título obrigatório"); return; }
    upsertMusic(musicModal.data as Omit<DBMusic, "id" | "createdAt"> & { id?: string });
    reload(member!);
    setMusicModal({ open: false, data: {} });
  }

  function removeMusic(id: string) {
    if (!confirm("Excluir esta música?")) return;
    deleteMusic(id);
    reload(member!);
  }

  function setMField<K extends keyof DBMusic>(k: K, v: DBMusic[K]) {
    setMusicModal(m => ({ ...m, data: { ...m.data, [k]: v } }));
  }

  // ── Render ───────────────────────────────────────────────
  if (!member) return null;

  const foto = (member as any).foto as string | undefined;
  const lastPago = [...(member.pagamentos ?? [])].filter(p => p.status === "pago").at(-1);
  const statusPag = lastPago
    ? `Pago em ${new Date(lastPago.data).toLocaleDateString("pt-BR")}`
    : "Pagamento pendente";

  const StatusIcon  = member.status === "ativo" ? CheckCircle : member.status === "pendente" ? Clock : XCircle;
  const statusColor = member.status === "ativo" ? "text-green-600" : member.status === "pendente" ? "text-amber-600" : "text-gray-400";

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="wrapper flex flex-col md:flex-row gap-8">

        {/* ── Sidebar ── */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 mb-4 bg-gray-100 flex items-center justify-center relative">
                {foto
                  ? <Image src={foto} fill alt={member.nome} className="object-cover" />
                  : <span className="text-3xl font-bold text-gray-400">{member.nome[0]}</span>
                }
              </div>
              <h2 className="font-serif font-bold text-xl">{member.nome}</h2>
              <span className="text-brand text-sm font-bold mt-1 font-mono">{member.code}</span>
              <p className="text-gray-500 text-sm mt-2 leading-snug">{member.cadeira}</p>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 space-y-1">
              <div className={`flex items-center gap-2 text-sm font-medium ${statusColor}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="capitalize">{member.status}</span>
              </div>
              <p className="text-xs text-gray-400">{statusPag}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-1">
            <button
              onClick={openProfile}
              className="w-full flex items-center gap-3 text-base font-medium p-3 rounded-lg hover:bg-gray-50 text-black transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-500" />
              Editar Perfil
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 text-base font-medium p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 space-y-8">
          <h1 className="text-3xl md:text-4xl font-serif font-black text-black">Meu Painel</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: BookOpen, label: "Livros",  value: books.length,   color: "bg-blue-50 text-blue-600" },
              { icon: Music,    label: "Músicas", value: musics.length,  color: "bg-purple-50 text-purple-600" },
              { icon: Award,    label: "Status",
                value: member.status === "ativo" ? "Ativo" : "Pendente",
                color: member.status === "ativo" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-black">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Livros */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-bold text-xl">Meus Livros</h3>
              <button
                onClick={openNewBook}
                className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Novo Livro
              </button>
            </div>
            {books.length === 0
              ? <p className="text-gray-400 text-base">Nenhum livro cadastrado ainda.</p>
              : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {books.map(book => (
                    <div key={book.id} className="group relative">
                      <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-lg shadow-md overflow-hidden mb-2">
                        {book.capaUrl && <Image src={book.capaUrl} fill alt={book.titulo} className="object-cover" />}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => openEditBook(book)}
                            className="p-2 bg-white rounded-full shadow"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeBook(book.id)}
                            className="p-2 bg-white rounded-full shadow"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-bold leading-tight line-clamp-2">{book.titulo}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{book.genero}</p>
                    </div>
                  ))}
                </div>
              )
            }
          </div>

          {/* Músicas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-bold text-xl">Músicas e Áudios</h3>
              <button
                onClick={openNewMusic}
                className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Nova Música
              </button>
            </div>
            {musics.length === 0
              ? <p className="text-gray-400 text-base">Nenhuma música cadastrada ainda.</p>
              : (
                <div className="space-y-3">
                  {musics.map(m => (
                    <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden relative shrink-0">
                        {m.capaUrl && <Image src={m.capaUrl} fill alt={m.titulo} className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base leading-tight">{m.titulo}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{m.tipo}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {m.linkExterno && (
                          <a href={m.linkExterno} target="_blank" rel="noreferrer"
                            className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                            <ExternalLink className="w-4 h-4 text-brand" />
                          </a>
                        )}
                        <button onClick={() => openEditMusic(m)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                          <Pencil className="w-4 h-4 text-gray-600" />
                        </button>
                        <button onClick={() => removeMusic(m.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      </div>

      {/* ══ Modal: Editar Perfil ══════════════════════════════════ */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-8 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setProfileOpen(false); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-4">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold">Editar Perfil</h2>
              <button onClick={() => setProfileOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome completo</label>
                <input
                  value={profileData.nome ?? ""}
                  onChange={e => setPField("nome", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL da Foto</label>
                <input
                  value={(profileData as any).foto ?? ""}
                  onChange={e => setPField("foto" as any, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="/imagens/minha-foto.jpg ou https://…"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Titulação</label>
                <input
                  value={profileData.titulacao ?? ""}
                  onChange={e => setPField("titulacao", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="Doutor em…, Mestre em…"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bio (resumida)</label>
                <textarea
                  value={(profileData as any).bio ?? ""}
                  onChange={e => setPField("bio" as any, e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black resize-none"
                  placeholder="Apresentação curta exibida no site…"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cidade</label>
                  <input
                    value={profileData.cidade ?? ""}
                    onChange={e => setPField("cidade", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Instagram</label>
                  <input
                    value={profileData.instagram ?? ""}
                    onChange={e => setPField("instagram", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                    placeholder="https://instagram.com/…"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3 justify-end border-t border-gray-100 pt-4">
              <button
                onClick={() => setProfileOpen(false)}
                className="px-6 py-3 rounded-xl border border-gray-200 text-base font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveProfile}
                className="px-6 py-3 rounded-xl bg-black text-white text-base font-bold hover:bg-zinc-800 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Livro ════════════════════════════════════════ */}
      {bookModal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-8 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setBookModal(m => ({ ...m, open: false })); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold">
                {bookModal.data.id ? "Editar Livro" : "Novo Livro"}
              </h2>
              <button onClick={() => setBookModal(m => ({ ...m, open: false }))} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Título *</label>
                <input
                  value={bookModal.data.titulo ?? ""}
                  onChange={e => setBField("titulo", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="Título do livro"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo</label>
                <input
                  value={bookModal.data.subtitulo ?? ""}
                  onChange={e => setBField("subtitulo", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sinopse</label>
                <textarea
                  value={bookModal.data.sinopse ?? ""}
                  onChange={e => setBField("sinopse", e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black resize-none"
                  placeholder="Descrição do livro…"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL da Capa</label>
                <input
                  value={bookModal.data.capaUrl ?? ""}
                  onChange={e => setBField("capaUrl", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="/imagens/capa.jpg ou https://…"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Gênero</label>
                  <select
                    value={bookModal.data.genero ?? ""}
                    onChange={e => setBField("genero", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Faixa Etária</label>
                  <select
                    value={bookModal.data.faixaEtaria ?? ""}
                    onChange={e => setBField("faixaEtaria", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    {FAIXAS_ETARIAS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Data de Publicação</label>
                  <input
                    type="date"
                    value={bookModal.data.dataPublicacao ?? ""}
                    onChange={e => setBField("dataPublicacao", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    value={bookModal.data.status ?? "rascunho"}
                    onChange={e => setBField("status", e.target.value as "publicado" | "rascunho")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    <option value="publicado">Publicado</option>
                    <option value="rascunho">Rascunho</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                <input
                  value={(bookModal.data.tags ?? []).join(", ")}
                  onChange={e => setBField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="amazônia, poesia, história"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700">Links de Venda</label>
                  <button onClick={addLink} className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
                    <PlusCircle className="w-4 h-4" /> Adicionar
                  </button>
                </div>
                <div className="space-y-2">
                  {(bookModal.data.linksVenda ?? []).map((link, i) => (
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
                  {(bookModal.data.linksVenda ?? []).length === 0 && (
                    <p className="text-sm text-gray-400 italic">Nenhum link adicionado.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3 justify-end border-t border-gray-100 pt-4">
              <button
                onClick={() => setBookModal(m => ({ ...m, open: false }))}
                className="px-6 py-3 rounded-xl border border-gray-200 text-base font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveBook}
                className="px-6 py-3 rounded-xl bg-black text-white text-base font-bold hover:bg-zinc-800 transition-colors"
              >
                {bookModal.data.id ? "Salvar Alterações" : "Cadastrar Livro"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Música ═══════════════════════════════════════ */}
      {musicModal.open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 pt-8 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) setMusicModal(m => ({ ...m, open: false })); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl my-4">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold">
                {musicModal.data.id ? "Editar Música" : "Nova Música"}
              </h2>
              <button onClick={() => setMusicModal(m => ({ ...m, open: false }))} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Título *</label>
                <input
                  value={musicModal.data.titulo ?? ""}
                  onChange={e => setMField("titulo", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="Nome da obra"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={musicModal.data.descricao ?? ""}
                  onChange={e => setMField("descricao", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black resize-none"
                  placeholder="Breve descrição…"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL da Capa</label>
                <input
                  value={musicModal.data.capaUrl ?? ""}
                  onChange={e => setMField("capaUrl", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="/imagens/capa.jpg ou https://…"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tipo</label>
                  <select
                    value={musicModal.data.tipo ?? ""}
                    onChange={e => setMField("tipo", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    {TIPOS_MUSICA.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Plataforma</label>
                  <select
                    value={musicModal.data.plataforma ?? ""}
                    onChange={e => setMField("plataforma", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black bg-white"
                  >
                    {PLATAFORMAS_AUDIO.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Link Externo</label>
                <input
                  value={musicModal.data.linkExterno ?? ""}
                  onChange={e => setMField("linkExterno", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                  placeholder="https://open.spotify.com/…"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                  <input
                    value={(musicModal.data.tags ?? []).join(", ")}
                    onChange={e => setMField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-black"
                    placeholder="amazônia, poesia…"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    value={musicModal.data.status ?? "rascunho"}
                    onChange={e => setMField("status", e.target.value as "publicado" | "rascunho")}
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
                onClick={() => setMusicModal(m => ({ ...m, open: false }))}
                className="px-6 py-3 rounded-xl border border-gray-200 text-base font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveMusic}
                className="px-6 py-3 rounded-xl bg-black text-white text-base font-bold hover:bg-zinc-800 transition-colors"
              >
                {musicModal.data.id ? "Salvar Alterações" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
