"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageSquare, Play, Info } from "lucide-react";
import { books, authors } from "@/data/mock";
import BookCard from "@/components/BookCard";
import AuthorCard from "@/components/AuthorCard";

export default function Home() {
  const booksRef = useRef<HTMLDivElement>(null);
  const authorsRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative bg-black text-white min-h-screen">
      {/* Hero Section (Netflix Billboard Style) */}
      <motion.section 
        className="relative min-h-[85vh] flex items-center pt-24 pb-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        
        {/* Imagem de Fundo Filme */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/capa-forte.png')` }}
        />

        <div className="container mx-auto px-4 md:px-12 relative z-20 flex flex-col justify-end h-full mt-24">
          <motion.div 
            className="md:max-w-2xl space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-8xl font-serif font-black leading-tight text-white drop-shadow-2xl logo-title">
              O FORTE
            </h1>
            <p className="text-gray-300 text-lg md:text-2xl font-medium drop-shadow-md">
              A defesa de um império contada pela ótica dos sobreviventes. Uma obra-prima literária em alta definição conceitual.
            </p>
            <div className="flex space-x-4 mt-8">
              <button className="flex items-center space-x-2 bg-white text-black px-6 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold rounded hover:bg-white/80 transition-colors">
                <Play className="fill-black w-6 h-6" />
                <span>Adquirir R$ 49,90</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-500/50 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold rounded hover:bg-gray-500/70 transition-colors backdrop-blur-sm">
                <Info className="w-6 h-6" />
                <span>Sinopse</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Trilho 1: Lançamentos */}
      <motion.section 
        className="py-12 md:py-20 relative bg-black"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-white pl-4 md:pl-12">Originais e Lançamentos</h2>
        
        <div className="relative group/slider">
          <button 
            onClick={() => scrollContainer(booksRef, "left")}
            className="absolute left-0 top-0 bottom-0 w-12 bg-black/60 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center z-40 transition-opacity backdrop-blur-sm"
          >
            <ChevronLeft className="w-10 h-10 text-white" />
          </button>

          <div ref={booksRef} className="flex space-x-4 overflow-x-auto scrollbar-hide py-4 px-4 md:px-12 pl-4 md:pl-12">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <button 
            onClick={() => scrollContainer(booksRef, "right")}
            className="absolute right-0 top-0 bottom-0 w-12 bg-black/60 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center z-40 transition-opacity backdrop-blur-sm"
          >
            <ChevronRight className="w-10 h-10 text-white" />
          </button>
        </div>
      </motion.section>

      {/* Trilho 2: Conheça Nossos Autores */}
      <motion.section 
        className="py-12 md:py-24 relative bg-black"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-white pl-4 md:pl-12">Autores Populares</h2>
        
        <div className="relative group/slider">
          <button 
            onClick={() => scrollContainer(authorsRef, "left")}
            className="absolute left-0 top-0 bottom-0 w-12 bg-black/60 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center z-40 transition-opacity backdrop-blur-sm hover:bg-black"
          >
            <ChevronLeft className="w-10 h-10 text-white" />
          </button>

          <div ref={authorsRef} className="flex space-x-6 overflow-x-auto scrollbar-hide py-4 px-4 md:px-12">
            {authors.map(author => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>

          <button 
            onClick={() => scrollContainer(authorsRef, "right")}
            className="absolute right-0 top-0 bottom-0 w-12 bg-black/60 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center z-40 transition-opacity backdrop-blur-sm hover:bg-black"
          >
            <ChevronRight className="w-10 h-10 text-white" />
          </button>
        </div>
      </motion.section>

      {/* FAB - Bibliotecário Virtual */}
      <motion.button 
        className="fixed bottom-8 right-8 bg-brand text-white p-4 rounded-full shadow-2xl hover:bg-accent transition-all duration-300 z-50 group flex items-center space-x-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1 }}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-medium">
          Falar com a Curadoria
        </span>
      </motion.button>
    </div>
  );
}
