"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Info, ArrowRight, Mic } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { books, authors, musics } from "@/data/mock";
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

  // Generating 9 placeholders for authors
  const placeholderAuthors = Array.from({ length: 9 }).map((_, i) => ({
    id: `placeholder-${i}`,
    name: "Aguardando cadastro",
    bio: "Associado em processo de onboarding na plataforma.",
    photoUrl: "https://ui-avatars.com/api/?name=Aguardando+Cadastro&background=333&color=666&size=512",
  }));

  const allAuthorsForGrid = [...authors, ...placeholderAuthors];

  return (
    <div className="relative bg-white text-black min-h-screen">
      
      {/* 1. HERO SECTION */}
      <motion.section 
        className="relative min-h-[85vh] flex items-center pt-24 pb-12 overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/capa-forte.png')` }}
        />

        {/* Note the spacing rule 48px desktop (md:px-12), 24px mobile (px-6) */}
        <div className="container mx-auto px-6 md:px-12 relative z-20 flex flex-col justify-end h-full mt-24">
          <motion.div 
            className="md:max-w-2xl space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-8xl font-serif font-black leading-tight text-white drop-shadow-2xl">
              O FORTE
            </h1>
            <p className="text-gray-300 text-lg md:text-2xl font-medium drop-shadow-md font-sans">
              A defesa de um império contada pela ótica dos sobreviventes. Uma obra-prima literária em alta definição conceitual.
            </p>
            <div className="flex space-x-4 mt-8 flex-wrap gap-y-4">
              <button className="flex items-center space-x-2 bg-white text-black px-6 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold rounded-sm hover:bg-white/90 transition-colors">
                <Play className="fill-black w-6 h-6" />
                <span>Adquirir R$ 49,90</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-500/50 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold rounded-sm hover:bg-gray-500/70 transition-colors backdrop-blur-sm">
                <Info className="w-6 h-6" />
                <span>Sinopse</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 2. ORIGINAIS E LANÇAMENTOS */}
      {/* Spacer Rule: 96px desktop / 64px mobile between hero and section = py-16 md:py-24 */}
      <motion.section 
        className="py-16 md:py-24 relative bg-black text-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="px-6 md:px-12 mb-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2">Originais e Lançamentos</h2>
          <p className="text-lg text-gray-400 font-sans">As obras premiadas dos nossos Imortais associados.</p>
        </div>
        
        <div className="relative group/slider">
          <button onClick={() => scrollContainer(booksRef, "left")} className="absolute left-0 top-0 bottom-0 w-12 bg-black/60 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center z-40 transition-opacity backdrop-blur-sm hover:bg-black">
            <ChevronLeft className="w-10 h-10 text-white" />
          </button>
          
          <div ref={booksRef} className="flex space-x-6 overflow-x-auto scrollbar-hide py-4 px-6 md:px-12">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <button onClick={() => scrollContainer(booksRef, "right")} className="absolute right-0 top-0 bottom-0 w-12 bg-black/60 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center z-40 transition-opacity backdrop-blur-sm hover:bg-black">
            <ChevronRight className="w-10 h-10 text-white" />
          </button>
        </div>
      </motion.section>

      {/* 3. NOSSOS AUTORES */}
      <motion.section 
        className="py-16 md:py-24 relative bg-gray-50 text-black border-y border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="px-6 md:px-12 mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2">Nossos Autores</h2>
            <p className="text-lg text-gray-500 font-sans">Conheça as mentes responsáveis por forjar nosso acervo.</p>
          </div>
          <Link href="/autores" className="hidden md:flex items-center space-x-2 text-brand font-bold hover:opacity-80">
            <span>Ver Todos</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="relative group/slider">
          <button onClick={() => scrollContainer(authorsRef, "left")} className="absolute left-0 top-0 bottom-0 w-12 bg-white/80 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center z-40 transition-opacity backdrop-blur-md hover:bg-white shadow-xl">
            <ChevronLeft className="w-10 h-10 text-black" />
          </button>

          <div ref={authorsRef} className="flex space-x-6 overflow-x-auto scrollbar-hide py-4 px-6 md:px-12">
            {allAuthorsForGrid.map(author => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>

          <button onClick={() => scrollContainer(authorsRef, "right")} className="absolute right-0 top-0 bottom-0 w-12 bg-white/80 opacity-0 group-hover/slider:opacity-100 flex items-center justify-center z-40 transition-opacity backdrop-blur-md hover:bg-white shadow-xl">
            <ChevronRight className="w-10 h-10 text-black" />
          </button>
        </div>
      </motion.section>

      {/* 4. OUÇA NOSSOS AUTORES (SPOTIFY Grid) */}
      <motion.section 
        className="py-16 md:py-24 relative bg-white text-black"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2">Músicas e Audiolivros</h2>
            <p className="text-lg text-gray-500 font-sans">Conteúdo em áudio produzido pelos nossos associados</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
            {musics.map((music) => (
              <div key={music.id} className="group cursor-pointer">
                <div className="relative w-full aspect-square bg-gray-100 rounded-md shadow-sm overflow-hidden mb-4 border border-gray-200 group-hover:shadow-lg transition-all">
                  <Image src={music.coverUrl} alt={music.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-sm md:text-base leading-tight mb-1 truncate group-hover:text-brand transition-colors">{music.title}</h3>
                <p className="text-xs text-gray-500">Em breve</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm font-medium text-gray-400 bg-gray-50 py-4 rounded-md border border-gray-100">
            Em breve: compre e baixe músicas e faixas de audiolivros dos nossos associados homologados.
          </div>
        </div>
      </motion.section>

      {/* 5. CONTRATE PALESTRAS (Call to Action Strip) */}
      <motion.section 
        className="py-16 md:py-24 relative bg-brand text-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Contrate Palestras</h2>
          <p className="text-lg md:text-xl text-white/90 font-sans mb-10 leading-relaxed">
            Nossos autores e pesquisadores oferecem palestras institucionais sobre literatura, história regional e educação literária para empresas, escolas e convenções em todo o país.
          </p>
          <Link href="/palestras" className="inline-flex items-center space-x-2 bg-black text-white px-8 md:px-10 py-4 text-lg font-bold rounded-sm shadow-xl hover:bg-zinc-800 transition-colors">
            <span>Solicitar Palestra</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.section>

      {/* 6. SOBRE A ACADEMIA */}
      <motion.section 
        className="py-16 md:py-24 pb-20 md:pb-32 relative bg-white text-black"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">Sobre a Academia</h2>
            <div className="space-y-6 text-lg text-gray-600 font-sans mb-10 leading-relaxed">
              <p>
                A Academia de Letras Barão do Rio Branco foi fundada com a incansável missão de blindar e fomentar o legado da literatura, resgatando as origens históricas da nossa região e projetando-as para a imortalidade do acervo digital.
              </p>
              <p>
                Trabalhamos intensamente para descobrir novos autores, homologar livros e integrar produções literárias de alto nível nas mãos das escolas e do público geral.
              </p>
            </div>
            <Link href="/sobre" className="inline-flex items-center space-x-2 border-2 border-black text-black px-8 py-3 text-base font-bold rounded-sm hover:bg-black hover:text-white transition-colors">
              <span>Conheça nossa história completa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
