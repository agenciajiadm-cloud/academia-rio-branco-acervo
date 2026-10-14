"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mic, ArrowLeft, MapPin, Award, BookOpen } from "lucide-react";
import { getMemberById, getMemberByCode, getBooksByMember } from "@/lib/db";
import BookCard from "@/components/BookCard";

interface AutorDetailClientProps {
  id: string;
  initialAuthor: {
    id: string;
    name: string;
    bio: string;
    fullHistory?: string;
    photoUrl: string;
    instagramHandle?: string;
    cidade?: string;
    cadeira?: string;
  } | null;
  initialBooks: any[];
}

export default function AutorDetailClient({ id, initialAuthor, initialBooks }: AutorDetailClientProps) {
  const [author, setAuthor] = useState(initialAuthor);
  const [books, setBooks] = useState(initialBooks);

  async function syncMember() {
    const mem = await getMemberById(id)
      .then((m) => m ?? getMemberByCode(id))
      .catch((e) => { console.error(e); return null; });
    if (mem) {
      setAuthor({
        id: mem.id,
        name: mem.nome,
        bio: mem.bio || (mem.titulacao ? `${mem.titulacao}. ${mem.cadeira}` : mem.cadeira),
        fullHistory: mem.fullHistory || author?.fullHistory || "",
        photoUrl: mem.foto || author?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(mem.nome)}&background=1a1a1a&color=ffd700&size=512`,
        instagramHandle: mem.instagram,
        cidade: mem.cidade,
        cadeira: mem.cadeira,
      });

      const dbBooks = await getBooksByMember(mem.id).catch(() => []);
      if (dbBooks.length > 0) {
        setBooks(
          dbBooks.map((b) => ({
            id: b.id,
            title: b.titulo,
            subtitle: b.subtitulo,
            price: b.preco || 49.9,
            coverUrl: b.capaUrl || "/images/capa-forte.png",
            authorId: b.memberId,
            description: b.sinopse,
          }))
        );
      }
    }
  }

  useEffect(() => {
    syncMember();
    const handleUpdate = () => syncMember();
    window.addEventListener("academia_db_updated", handleUpdate);
    return () => window.removeEventListener("academia_db_updated", handleUpdate);
  }, [id]);

  if (!author) {
    return (
      <div className="bg-gray-50 min-h-screen pt-32 pb-24 text-center">
        <p className="text-gray-500">Membro não encontrado.</p>
        <Link href="/autores" className="mt-4 inline-block text-brand font-bold">
          Voltar aos Autores
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <Link
          href="/autores"
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-black mb-8 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao quadro de imortais</span>
        </Link>

        {/* Profile Card Master */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 items-center md:items-start mb-16">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gray-100 shrink-0 relative overflow-hidden shadow-xl border-4 border-white">
            <Image src={author.photoUrl} alt={author.name} fill className="object-cover" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3.5 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider mb-4 rounded-full">
              {author.cadeira || "Membro Imortal"}
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black text-black mb-3">
              {author.name}
            </h1>

            {author.cidade && (
              <p className="text-sm text-gray-400 font-medium mb-4 flex items-center justify-center md:justify-start gap-1">
                <MapPin className="w-4 h-4 text-accent" /> {author.cidade}
              </p>
            )}

            <p className="text-xl text-brand font-medium mb-6">
              {author.bio}
            </p>

            <div className="text-gray-600 leading-relaxed max-w-3xl space-y-4 whitespace-pre-line text-base">
              {author.fullHistory || "Biografia oficial em processo de homologação pela Academia de Letras Barão do Rio Branco."}
            </div>

            {author.instagramHandle && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <a
                  href={author.instagramHandle.startsWith("http") ? author.instagramHandle : `https://instagram.com/${author.instagramHandle.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black transition-colors"
                >
                  <svg className="w-4 h-4 text-pink-600 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Seguir no Instagram</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Biblioteca do Autor */}
        {books.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-6 h-6 text-brand" />
              <h2 className="text-3xl font-serif font-bold text-black">
                Obras Publicadas no Acervo
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Palestras Block */}
        <div className="bg-black rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl">
          <div className="max-w-2xl text-center md:text-left mb-8 md:mb-0">
            <div className="flex items-center space-x-3 mb-4 justify-center md:justify-start">
              <Mic className="w-6 h-6 text-accent" />
              <h3 className="text-2xl font-serif font-bold">Solicitar Palestra Oficial</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Convide este(a) autor(a) para conferências, feiras literárias, instituições de ensino e encontros culturais.
            </p>
          </div>
          <Link
            href="/palestras"
            className="bg-brand text-white font-bold py-4 px-10 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            Agendar Palestra
          </Link>
        </div>
      </div>
    </div>
  );
}
