"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getMusics, type DBMusic } from "@/lib/db";
import { musics as mockMusics } from "@/data/mock";
import { AlertCircle, ExternalLink, Music } from "lucide-react";

export default function Musicas() {
  const [musicList, setMusicList] = useState<any[]>(mockMusics);

  function syncMusics() {
    const dbMusics = getMusics();
    if (dbMusics.length > 0) {
      setMusicList(
        dbMusics.map((m) => ({
          id: m.id,
          title: m.titulo,
          coverUrl: m.capaUrl || "/imagens/elaine-araujo.jpg",
          tipo: m.tipo,
          linkExterno: m.linkExterno,
          plataforma: m.plataforma,
          status: m.status,
        }))
      );
    }
  }

  useEffect(() => {
    syncMusics();
    const handleUpdate = () => syncMusics();
    window.addEventListener("academia_db_updated", handleUpdate);
    return () => window.removeEventListener("academia_db_updated", handleUpdate);
  }, []);

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="bg-brand/20 border border-brand/50 rounded-2xl p-4 mb-12 flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-brand shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-brand font-medium">
            Obras fonográficas, declamações poéticas e faixas de audiolivros produzidas pelos nossos associados. Todos os direitos reservados à Academia de Letras Barão do Rio Branco.
          </p>
        </div>

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2 block font-mono">
          Acervo Sonoro & Fonográfico
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-black mb-4">Obras em Áudio e Música</h1>
        <p className="text-lg text-gray-400 mb-16 max-w-2xl">
          Nossa galeria de imersão fonográfica regional e folclórica amapaense e amazônica.
        </p>

        {/* Grid Estilo Spotify */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {musicList.map((music) => (
            <div
              key={music.id}
              onClick={() => {
                if (music.linkExterno) window.open(music.linkExterno, "_blank");
              }}
              className="group cursor-pointer bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800 hover:border-accent transition-all duration-300"
            >
              <div className="relative w-full aspect-square bg-gray-900 rounded-xl shadow-xl overflow-hidden mb-4 group-hover:shadow-brand/20 transition-all">
                <Image
                  src={music.coverUrl}
                  alt={music.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-[14px] border-y-transparent border-l-black ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-base leading-tight mb-1 truncate text-gray-100 group-hover:text-white transition-colors">
                {music.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>{music.tipo || "Obra Fonográfica"}</span>
                {music.linkExterno && <ExternalLink className="w-3.5 h-3.5 text-accent" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
