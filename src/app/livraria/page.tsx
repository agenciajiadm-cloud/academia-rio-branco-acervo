"use client";

import { useEffect, useState, useMemo } from "react";
import BookCard from "@/components/BookCard";
import { getBooks, type DBBook } from "@/lib/db";
import { books as mockBooks, categories } from "@/data/mock";

export default function Livraria() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [books, setBooks] = useState<any[]>(mockBooks);

  async function syncBooks() {
    const dbBooks = await getBooks().catch((e) => { console.error(e); return []; });
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
          genero: b.genero,
          linksVenda: b.linksVenda,
        }))
      );
    }
  }

  useEffect(() => {
    syncBooks();
    const handleUpdate = () => syncBooks();
    window.addEventListener("academia_db_updated", handleUpdate);
    return () => window.removeEventListener("academia_db_updated", handleUpdate);
  }, []);

  const filteredBooks = useMemo(() => {
    if (activeFilter === "Todos") return books;
    return books.filter((b) => (b.genero || "").toLowerCase() === activeFilter.toLowerCase());
  }, [books, activeFilter]);

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2 block">
          Catálogo Literário
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-black text-black mb-4">Livraria do Acervo</h1>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl">
          Navegue pelas obras publicadas e homologadas pelos associados da Academia de Letras.
        </p>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
              activeFilter === "Todos"
                ? "bg-black text-white border-black shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
            }`}
            onClick={() => setActiveFilter("Todos")}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${
                activeFilter === cat.name
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
              onClick={() => setActiveFilter(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid de Livros */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}
