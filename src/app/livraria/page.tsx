"use client";

import { useState } from "react";
import BookCard from "@/components/BookCard";
import { books, categories } from "@/data/mock";

export default function Livraria() {
  const [activeFilter, setActiveFilter] = useState("Todos");

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-black mb-4">Livraria do Acervo</h1>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl">
          Navegue pelas obras publicadas e homologadas pelos associados da Academia de Letras.
        </p>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-full border ${activeFilter === "Todos" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
            onClick={() => setActiveFilter("Todos")}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`px-4 py-2 text-sm font-medium rounded-full border ${activeFilter === cat.name ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"}`}
              onClick={() => setActiveFilter(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid de Livros */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
          {/* Placeholders for visual grid fill */}
          {Array.from({ length: 3 }).map((_, i) => (
             <div key={`p-${i}`} className="opacity-40 pointer-events-none filter grayscale">
               <div className="w-full aspect-[2/3] bg-gray-300 rounded mb-4" />
               <div className="w-3/4 h-4 bg-gray-300 mb-2 rounded" />
               <div className="w-1/2 h-3 bg-gray-200 rounded" />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
