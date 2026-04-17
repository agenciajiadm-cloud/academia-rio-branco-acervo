"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Sobre() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      {/* Header da Página */}
      <div className="container mx-auto px-6 md:px-12 mb-16 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-serif font-black text-black mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Nossa História
        </motion.h1>
        <motion.p 
          className="text-gray-500 max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          O Encontro entre o Idealismo e a Paixão no extremo Norte do país.
        </motion.p>
      </div>

      <div className="container mx-auto px-6 md:px-12 space-y-24">
        {/* Bloco 1 - Text Esquerda, Img Direita */}
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-serif font-bold text-brand">A Origem</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              A Academia de Letras Barão do Rio Branco – AP nasceu do encontro entre o idealismo e a paixão pela palavra. 
              Sua semente foi plantada em novembro de 2024, durante um projeto de incentivo à leitura e à escrita realizado pela professora e escritora Maria Inês, 
              cuja atuação educacional sempre esteve voltada à formação leitora e crítica. O evento contou com a participação especial do autor e professor Policarpo Junior, 
              convidado para compartilhar sua experiência com os alunos e demais participantes.
            </p>
          </div>
          <div className="md:w-1/2 w-full h-[400px] relative rounded-lg overflow-hidden shadow-2xl">
            <Image 
              src="/images/capa-pensamentos.png" 
              alt="Pensamentos na Escuridão" 
              fill 
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Bloco 2 - Img Esquerda, Text Direita */}
        <motion.div 
          className="flex flex-col md:flex-row-reverse items-center gap-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-serif font-bold text-brand">O Norte e a Identidade</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Entre o <strong className="text-black">Amapá</strong> e o <strong className="text-black">Pará</strong>, a região <strong className="text-black">Norte</strong> encontra a verdadeira essência da literatura do <strong className="text-black">Brasil</strong>. 
              O diálogo entre os fundadores marcou a afinidade de propósitos, rapidamente estendido a outros nomes do meio literário e educacional.
              A ata de fundação da Academia foi lavrada em 26 de janeiro de 2025. Desde então, tem se dedicado a cultivar a língua portuguesa,
              não apenas como ferramenta de comunicação, mas como expressão de identidade, sensibilidade e pensamento crítico.
            </p>
          </div>
          <div className="md:w-1/2 w-full h-[400px] relative rounded-lg overflow-hidden shadow-2xl">
            <Image 
              src="/images/foto.jpg" 
              alt="História da Academia" 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </motion.div>

        {/* Bloco 3 - Full Text Centralizado */}
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-6 bg-gray-50 p-12 rounded-2xl border border-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-serif font-bold text-black border-b-2 border-brand inline-block pb-2 mb-4">A Missão</h2>
          <p className="text-gray-700 leading-relaxed text-lg max-w-2xl mx-auto">
            Ao reunir autores e autoras com trajetórias diversas, a instituição constrói uma ponte entre o passado cultural do estado, sua produção presente e os horizontes futuros. 
            Inspirada na figura emblemática da diplomacia, o Sr. Barão do Rio Branco, a Academia carrega o símbolo da união e do diálogo coletivo.
            Mais do que uma instituição, a Academia é um espaço vivo de criação e memória, transformando a literatura em semente de transformação pessoal e social no Amapá.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
