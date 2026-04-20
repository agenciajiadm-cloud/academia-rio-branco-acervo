"use client";

import Image from "next/image";
import { musics } from "@/data/mock";
import { AlertCircle } from "lucide-react";

export default function Musicas() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 text-white">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="bg-brand/20 border border-brand/50 rounded-lg p-4 mb-12 flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-brand shrink-0" />
          <p className="text-sm md:text-base text-brand font-medium">
            Em breve: venda oficial de músicas e faixas de audiolivros produzidos e executados pelos nossos associados. Todos os direitos reservados.
          </p>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-black mb-4">Obras em Áudio e Música</h1>
        <p className="text-lg text-gray-400 mb-16 max-w-2xl">
          Nossa galeria de imersão fonográfica regional e folclórica. Conteúdo independente da Academia.
        </p>

        {/* Grid Estilo Spotify Expandido */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {musics.map((music) => (
             <div key={music.id} className="group cursor-pointer">
               <div className="relative w-full aspect-square bg-gray-900 rounded-lg shadow-xl overflow-hidden mb-4 group-hover:shadow-brand/20 transition-all">
                 <Image src={music.coverUrl} alt={music.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                 {/* Fake Play Button overlay */}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform">
                     <div className="w-0 h-0 border-t-8 border-b-8 border-l-[14px] border-y-transparent border-l-white ml-1"></div>
                   </div>
                 </div>
               </div>
               <h3 className="font-bold text-base md:text-lg leading-tight mb-1 truncate text-gray-100 group-hover:text-white transition-colors">{music.title}</h3>
               <p className="text-sm text-gray-500 font-medium">Aguardando Lançamento</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
