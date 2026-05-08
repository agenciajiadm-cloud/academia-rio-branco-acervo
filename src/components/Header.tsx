"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Livraria", href: "/livraria" },
    { name: "Autores", href: "/autores" },
    { name: "Músicas", href: "/musicas" },
    { name: "Sobre", href: "/sobre" },
    { name: "Palestras", href: "/palestras" },
    { name: "Contato", href: "/contato" },
  ];

  return (
    <>
      {/* overflow-visible permite o logo extravasar abaixo do header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 h-20 overflow-visible ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white shadow-sm"
        }`}
      >
        <div className="wrapper h-full flex items-center justify-between relative">

          {/* Logo — metade dentro, metade fora do header */}
          <Link href="/" className="flex-shrink-0 relative z-50" style={{ marginTop: "20px" }}>
            <div className="relative w-[72px] h-[90px] md:w-[90px] md:h-[112px] drop-shadow-xl">
              <Image
                src="/imagens/LOGO ACADEMIA LETRAS BARÃO..png"
                alt="Logo Academia de Letras Barão do Rio Branco"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="link-anim hover:text-brand transition-colors duration-300 text-black"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden md:flex">
            <Link
              href="/login"
              className="border-2 border-black px-5 py-2 text-sm font-semibold hover:bg-black hover:text-white transition-all rounded-sm text-black whitespace-nowrap"
            >
              Área do Associado
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black p-1"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="p-6 pt-24 flex flex-col h-full">
                <nav className="flex flex-col space-y-2 mb-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-black py-3 border-b border-gray-100 hover:text-brand"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto mb-8">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center border-2 border-black text-black px-4 py-4 font-bold rounded-sm hover:bg-black hover:text-white transition-all"
                  >
                    Área do Associado
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
