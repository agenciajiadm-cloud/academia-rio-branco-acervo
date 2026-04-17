"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, AtSign, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authors, Author } from "@/data/mock";

export default function Autores() {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-12">
        <motion.h1 
          className="text-4xl md:text-6xl font-serif font-black text-black mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Nossos Imortais
        </motion.h1>

        {/* Grid de Autores */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-6">
          {authors.map((author, index) => (
            <motion.div 
              key={author.id}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => setSelectedAuthor(author)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-brand shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <Image
                  src={author.photoUrl}
                  alt={author.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <h4 className="font-serif font-bold text-center group-hover:text-brand transition-colors px-2">
                {author.name}
              </h4>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal / Lightbox (Fullscreen Moderno) */}
      <AnimatePresence>
        {selectedAuthor && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-white flex flex-col md:flex-row overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Botão de Fechar Absoluto */}
            <button 
              onClick={() => setSelectedAuthor(null)}
              className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-3 bg-black text-white hover:bg-brand rounded-full transition-colors shadow-2xl"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Metade Esquerda Imagem */}
            <div className="w-full md:w-2/5 md:h-screen md:sticky top-0 bg-gray-100 relative min-h-[40vh]">
              <Image 
                src={selectedAuthor.photoUrl}
                alt={selectedAuthor.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Metade Direita Conteúdo */}
            <div className="w-full md:w-3/5 p-8 md:p-16 lg:p-24 flex items-center">
              <div className="max-w-xl">
                <h2 className="text-5xl md:text-7xl font-serif font-black text-black mb-4">
                  {selectedAuthor.name}
                </h2>
                
                {selectedAuthor.instagramHandle && (
                  <a href="#" className="inline-flex items-center space-x-2 text-brand font-bold mb-8 hover:underline">
                    <AtSign className="w-5 h-5" />
                    <span>{selectedAuthor.instagramHandle}</span>
                  </a>
                )}

                <p className="text-2xl text-gray-800 font-medium leading-relaxed mb-8 border-l-4 border-brand pl-6">
                  "{selectedAuthor.bio}"
                </p>

                <div className="prose prose-lg text-gray-600 leading-relaxed">
                  <p>{selectedAuthor.fullHistory}</p>
                </div>

                <div className="mt-12 flex space-x-4">
                  <button className="bg-black text-white px-8 py-3 font-semibold rounded-sm hover:bg-gray-800 transition-colors shadow-lg">
                    Ver Obras Publicadas
                  </button>
                  <button className="border-2 border-gray-300 text-black p-3 rounded-sm hover:border-black transition-colors">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
