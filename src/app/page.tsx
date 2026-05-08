"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mic, BookOpen, Users, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { books, authors, musics } from "@/data/mock";
import BookCard from "@/components/BookCard";
import AuthorCard from "@/components/AuthorCard";
import RevealText from "@/components/RevealText";
import Marquee from "@/components/Marquee";
import CountUp from "@/components/CountUp";

const EASE = [0.65, 0.05, 0, 1] as const;

function SectionLabel({ children }: { children: string }) {
  return (
    <motion.p
      className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {children}
    </motion.p>
  );
}

function ImageReveal({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.4, ease: EASE }}
        className="w-full h-full"
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1.05, 1]);

  const marqueeItems = [
    "Academia de Letras Barão do Rio Branco",
    "Fundada em 26 de Janeiro de 2025",
    "Macapá · Amapá · Brasil",
    "Preservando a Literatura Amazônida",
  ];

  return (
    <div className="relative bg-white text-black min-h-screen overflow-x-hidden">

      {/* ═══════════════════════════════════════════════
          1. HERO INSTITUCIONAL — parallax + text reveal
      ══════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black"
      >
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroImgY, scale: heroScale }}
        >
          <Image
            src="/imagens/fundadores.jpeg"
            alt="Fundadores da Academia"
            fill
            className="object-cover object-top"
            priority
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/65 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" />

        {/* Content */}
        <motion.div className="wrapper relative z-20 w-full py-28" style={{ opacity: heroOpacity }}>
          <div className="max-w-3xl space-y-8">

            <motion.div
              className="inline-flex items-center gap-2 border border-accent/50 text-accent px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-[0.2em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              Fundada em 26 de Janeiro de 2025 — Amapá, Brasil
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-serif font-black leading-[1.0] text-white">
              <RevealText delay={0.3}>Academia de Letras</RevealText>
              <br />
              <span className="text-accent">
                <RevealText delay={0.5}>Barão do Rio Branco</RevealText>
              </span>
            </h1>

            <motion.p
              className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            >
              Nascida do encontro entre o idealismo e a paixão pela palavra, reúne autores,
              pesquisadores e educadores comprometidos com a preservação e o florescimento da
              literatura amazônida — do Amapá para o Brasil.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 pt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            >
              <Link
                href="/sobre"
                className="group flex items-center gap-2 bg-white text-black px-7 py-4 font-bold text-sm rounded-sm hover:bg-accent hover:text-white transition-all duration-500"
              >
                Nossa História
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 border border-white/40 text-white px-7 py-4 font-bold text-sm rounded-sm hover:bg-white/10 hover:border-white/80 transition-all duration-500"
              >
                Seja um Associado
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            className="w-[1px] h-12 bg-white/30 origin-top"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <span className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════════
          MARQUEE — faixa de identidade
      ══════════════════════════════════════════════ */}
      <div className="bg-brand py-4 overflow-hidden border-y border-brand/80">
        <Marquee items={marqueeItems} speed={40} className="text-white/80" />
      </div>

      {/* ═══════════════════════════════════════════════
          2. STATS — números que contam
      ══════════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="wrapper">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: Calendar, label: "Fundação", value: 2025, suffix: "", prefix: "", sub: "26 de Janeiro" },
              { icon: Users, label: "Imortais", value: 5, suffix: "+", prefix: "", sub: "Associados fundadores" },
              { icon: BookOpen, label: "Obras", value: 7, suffix: "+", prefix: "", sub: "Títulos no acervo" },
              { icon: MapPin, label: "Alcance", value: 4, suffix: " estados", prefix: "", sub: "Brasil" },
            ].map(({ icon: Icon, label, value, suffix, prefix, sub }, i) => (
              <motion.div
                key={label}
                className="py-12 px-6 flex flex-col items-center text-center gap-4"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              >
                <div className="w-10 h-10 rounded-full bg-brand/8 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <p className="text-4xl md:text-5xl font-serif font-black text-black tracking-tight">
                  <CountUp to={value} suffix={suffix} prefix={prefix} duration={1.6} />
                </p>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">{label}</p>
                  <p className="text-xs text-gray-400 mt-1">{sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. ORIGINAIS E LANÇAMENTOS — grid centrado
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#0e0e0e] text-white overflow-hidden">
        <div className="wrapper">
          <SectionLabel>Acervo</SectionLabel>
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              <RevealText>Originais e</RevealText>
              <br />
              <RevealText delay={0.1}>Lançamentos</RevealText>
            </h2>
            <Link
              href="/livraria"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-accent transition-colors group link-anim"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-gray-500 mb-10">As obras publicadas pelos nossos Imortais associados.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {books.map((book, i) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. NOSSOS AUTORES — grid centrado
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#f7f6f4] text-black overflow-hidden">
        <div className="wrapper">
          <SectionLabel>Imortais</SectionLabel>
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              <RevealText>Nossos Autores</RevealText>
            </h2>
            <Link
              href="/autores"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-brand hover:text-accent transition-colors group link-anim"
            >
              Ver Todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-gray-500 mb-10">As mentes que forjam nosso acervo.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
            {authors.map((author, i) => (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <AuthorCard author={author} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. QUOTE — frase institucional com image reveal
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-black text-white overflow-hidden">
        <div className="wrapper grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <SectionLabel>Nossa Missão</SectionLabel>
            <blockquote className="text-3xl md:text-5xl font-serif font-bold leading-[1.15] text-white">
              <RevealText>"A literatura é a</RevealText>
              <br />
              <RevealText delay={0.1}>memória viva de</RevealText>
              <br />
              <span className="text-accent">
                <RevealText delay={0.2}>um povo."</RevealText>
              </span>
            </blockquote>
            <motion.p
              className="text-gray-400 text-base leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Ao reunir autores com trajetórias diversas, a Academia constrói uma ponte entre o passado
              cultural do Amapá, sua produção presente e os horizontes futuros da literatura brasileira.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <Link
                href="/sobre"
                className="group inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-sm font-bold hover:bg-white hover:text-black transition-all duration-500 rounded-sm"
              >
                Conheça nossa história
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="relative h-[400px] md:h-[520px] rounded-lg overflow-hidden">
            <ImageReveal src="/imagens/fundadores.jpeg" alt="Fundadores da Academia" className="absolute inset-0" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. MÚSICAS E AUDIOLIVROS
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white text-black">
        <div className="wrapper">
          <SectionLabel>Cultura</SectionLabel>
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              <RevealText>Músicas e</RevealText>
              <br />
              <RevealText delay={0.1}>Audiolivros</RevealText>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-5">
            {musics.map((music, i) => (
              <motion.div
                key={music.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              >
                <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 border border-gray-100 group-hover:shadow-xl transition-all duration-500">
                  <Image
                    src={music.coverUrl}
                    alt={music.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                </div>
                <h3 className="font-bold text-sm leading-tight mb-1 truncate group-hover:text-brand transition-colors duration-300">{music.title}</h3>
                <p className="text-xs text-gray-400">Em breve</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-gray-400 border border-gray-100 py-4 rounded-md bg-gray-50">
            Em breve: compre e baixe músicas e faixas de audiolivros dos nossos associados.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MARQUEE 2 — separador elegante
      ══════════════════════════════════════════════ */}
      <div className="bg-[#0e0e0e] py-5 overflow-hidden">
        <Marquee
          items={["Imortalidade pela Palavra", "Literatura Amazônida", "Amapá · Brasil", "Acervo Digital"]}
          speed={50}
          reverse
          className="text-white/20"
        />
      </div>

      {/* ═══════════════════════════════════════════════
          7. PALESTRAS CTA
      ══════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-brand text-white relative overflow-hidden">
        {/* Decorative large text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <p className="text-[20vw] font-serif font-black text-white/5 whitespace-nowrap leading-none">
            PALESTRAS
          </p>
        </div>

        <div className="wrapper text-center relative z-10 max-w-3xl mx-auto">
          <SectionLabel>Sabedoria em cena</SectionLabel>
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            <RevealText>Contrate Palestras</RevealText>
          </h2>
          <motion.p
            className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Nossos autores e pesquisadores oferecem palestras sobre literatura, história regional
            e educação literária para empresas, escolas e convenções em todo o Brasil.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Link
              href="/palestras"
              className="group inline-flex items-center gap-2 bg-black text-white px-10 py-5 text-base font-bold rounded-sm hover:bg-accent transition-all duration-500 shadow-2xl"
            >
              Solicitar Palestra
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
