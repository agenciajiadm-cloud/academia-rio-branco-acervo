"use client";

import { useState } from "react";
import AuthorCard from "@/components/AuthorCard";
import { authors } from "@/data/mock";

export default function Autores() {
  const [filter, setFilter] = useState("Todos");

  const placeholderAuthors = Array.from({ length: 9 }).map((_, i) => ({
    id: `placeholder-${i}`,
    name: "Aguardando cadastro",
    bio: "Associado em processo de onboarding na plataforma.",
    photoUrl: "https://ui-avatars.com/api/?name=Aguardando+Cadastro&background=333&color=666&size=512",
  }));

  const allAuthorsForGrid = [...authors, ...placeholderAuthors];

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-black mb-4">Membros Imortais</h1>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl">
          Conheça os patronos, imortais e fundadores que dedicam sua vida à arte, cultura e ao avanço histórico.
        </p>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-gray-100">
          {["Todos", "Com livros publicados", "Com palestras"].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-bold rounded-sm border-2 ${filter === f ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-black transition-colors"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid de Autores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allAuthorsForGrid.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      </div>
    </div>
  );
}
