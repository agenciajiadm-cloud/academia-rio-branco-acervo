"use client";

import { useEffect, useState, useMemo } from "react";
import AuthorCard from "@/components/AuthorCard";
import { getMembers, getBooks, type DBMember, type DBBook } from "@/lib/db";
import { authors as mockAuthors } from "@/data/mock";

export default function Autores() {
  const [filter, setFilter] = useState("Todos");
  const [members, setMembers] = useState<DBMember[]>([]);
  const [books, setBooks] = useState<DBBook[]>([]);

  async function syncData() {
    try {
      const [m, b] = await Promise.all([getMembers(), getBooks()]);
      setMembers(m);
      setBooks(b);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    syncData();
    const handleUpdate = () => syncData();
    window.addEventListener("academia_db_updated", handleUpdate);
    return () => window.removeEventListener("academia_db_updated", handleUpdate);
  }, []);

  const authorCards = useMemo(() => {
    if (members.length === 0) return mockAuthors;

    return members
      .filter((m) => m.status !== "inativo")
      .map((m) => {
        const memberBooks = books.filter((b) => b.memberId === m.id || b.memberId === m.code);
        return {
          id: m.id,
          name: m.nome,
          bio: m.bio || (m.titulacao ? `${m.titulacao}. ${m.cadeira}` : m.cadeira),
          fullHistory: m.fullHistory || "",
          photoUrl: m.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.nome)}&background=1a1a1a&color=ffd700&size=512`,
          instagramHandle: m.instagram,
          cidade: m.cidade,
          cadeira: m.cadeira,
          hasBooks: memberBooks.length > 0,
          palestras: m.palestras !== false,
        };
      });
  }, [members, books]);

  const filteredAuthors = useMemo(() => {
    if (filter === "Com livros publicados") {
      return authorCards.filter((a: any) => a.hasBooks);
    }
    if (filter === "Com palestras") {
      return authorCards.filter((a: any) => a.palestras);
    }
    return authorCards;
  }, [authorCards, filter]);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2 block">
            Quadro Oficial
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-black mb-4">
            Membros Imortais & Fundadores
          </h1>
          <p className="text-lg text-gray-500">
            Conheça os patronos, imortais e associados que preservam a memória, a literatura e a cultura da Amazônia.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-gray-100">
          {["Todos", "Com livros publicados", "Com palestras"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                filter === f
                  ? "bg-black text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid de Autores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAuthors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </div>
  );
}
