"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ShoppingCart, Lock, ExternalLink, BookOpen } from "lucide-react";
import { getBooks, getMembers, type DBBook, type DBMember } from "@/lib/db";

interface LivroDetailClientProps {
  id: string;
  initialBook: {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    coverUrl: string;
    authorId: string;
    description?: string;
  };
  initialAuthor: {
    id: string;
    name: string;
    photoUrl: string;
  } | null;
}

export default function LivroDetailClient({ id, initialBook, initialAuthor }: LivroDetailClientProps) {
  const [book, setBook] = useState(initialBook);
  const [author, setAuthor] = useState(initialAuthor);
  const [amazonUrl, setAmazonUrl] = useState<string | null>(null);

  function syncData() {
    const allBooks = getBooks();
    const foundBook = allBooks.find((b) => b.id === id);
    if (foundBook) {
      setBook({
        id: foundBook.id,
        title: foundBook.titulo,
        subtitle: foundBook.subtitulo,
        price: foundBook.preco || 49.9,
        coverUrl: foundBook.capaUrl || initialBook.coverUrl,
        authorId: foundBook.memberId,
        description: foundBook.sinopse,
      });

      const amz = (foundBook.linksVenda || []).find((l) => l.plataforma === "amazon")?.url;
      if (amz) setAmazonUrl(amz);

      const allMembers = getMembers();
      const foundMember = allMembers.find((m) => m.id === foundBook.memberId || m.code === foundBook.memberId);
      if (foundMember) {
        setAuthor({
          id: foundMember.id,
          name: foundMember.nome,
          photoUrl: foundMember.foto || initialAuthor?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundMember.nome)}`,
        });
      }
    }
  }

  useEffect(() => {
    syncData();
    const handleUpdate = () => syncData();
    window.addEventListener("academia_db_updated", handleUpdate);
    return () => window.removeEventListener("academia_db_updated", handleUpdate);
  }, [id]);

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-12">
        <Link
          href="/livraria"
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-black font-medium mb-12 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Voltar ao Acervo de Livros</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Esquerda: Capa Expandida */}
            <div className="md:w-2/5 md:bg-gray-50 p-8 md:p-16 flex justify-center items-center relative border-b md:border-b-0 md:border-r border-gray-100">
              <div className="w-full max-w-sm relative aspect-[2/3] shadow-2xl rounded-2xl overflow-hidden border-4 border-white">
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Direita: Textos e Compra */}
            <div className="md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
              <div className="mb-2 uppercase tracking-widest text-xs font-bold text-accent">
                Publicação Oficial da Academia
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-black text-black mb-2 leading-tight">
                {book.title}
              </h1>
              {book.subtitle && (
                <h2 className="text-xl text-gray-500 font-medium mb-6">
                  {book.subtitle}
                </h2>
              )}

              {author && (
                <Link
                  href={`/autor/${author.id}`}
                  className="flex items-center space-x-4 mb-8 group hover:opacity-80 transition-opacity w-fit"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-transparent group-hover:border-black transition-colors">
                    <Image
                      src={author.photoUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Escrito por</p>
                    <p className="font-serif font-bold text-lg text-black group-hover:underline">
                      {author.name}
                    </p>
                  </div>
                </Link>
              )}

              <div className="mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-700 leading-relaxed text-base">
                  {book.description || "Nenhuma descrição detalhada disponível para esta obra."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-8 mt-auto gap-4">
                <div className="text-center sm:text-left">
                  <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                    Preço de Capa
                  </span>
                  <span className="text-4xl font-black text-brand tracking-tighter">
                    R$ {book.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex flex-wrap w-full sm:w-auto gap-3">
                  {amazonUrl ? (
                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-4 rounded-xl transition-all shadow-md"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Comprar na Amazon</span>
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  ) : (
                    <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-black text-white px-8 py-4 font-bold rounded-xl hover:bg-zinc-800 transition-shadow shadow-lg">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Adquirir Exemplar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Autenticidade */}
              <div className="mt-8 flex items-center text-xs text-gray-400 space-x-2 border border-gray-100 p-3 rounded-xl bg-white">
                <Lock className="w-4 h-4 text-green-600 shrink-0" />
                <span>Edição Oficial e Homologada. Distribuição com chancela da Academia de Letras Barão do Rio Branco.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
