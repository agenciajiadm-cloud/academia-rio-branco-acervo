"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // TODO: Conectar com contexto real de autenticação depois.
  const isLoggedIn = false; 
  const userAvatarUrl = "/images/policarpo.png"; // Mocking avatar when logged in

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 h-20 flex items-center ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 md:px-12 flex justify-between items-center w-full">
          
          {/* Lado Esquerdo - Logo */}
          <Link href="/" className="flex items-center space-x-3 group z-50">
            <div className="relative w-12 h-10 md:w-[70px] md:h-[50px]">
              <Image
                src="/images/logo.png"
                alt="Logo Academia"
                fill
                className="object-contain group-hover:opacity-80 transition-opacity"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-black font-serif font-bold text-xs md:text-sm leading-tight uppercase tracking-wide">
                Academia de Letras <br className="md:hidden" />
                <span className="hidden md:inline"> Barão do Rio Branco</span>
                <span className="md:hidden"> Rio Branco</span>
              </span>
            </div>
          </Link>

          {/* Centro - Links Desktop */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="hover:text-brand hover:underline underline-offset-4 transition-colors text-black"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Lado Direito - Ações Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-800 hover:text-brand transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
            </button>
            
            {isLoggedIn ? (
              <div className="group relative">
                <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand focus:outline-none">
                  <Image src={userAvatarUrl} alt="Perfil" width={40} height={40} className="object-cover" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2">
                  <Link href="/area-associado" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Meu Perfil</Link>
                  <Link href="/meus-livros" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Meus Livros</Link>
                  <button className="px-4 py-2 text-sm text-red-600 hover:bg-gray-50 text-left">Sair</button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="border-2 border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition-all rounded-sm text-black"
              >
                Login Associado
              </Link>
            )}
          </div>

          {/* Right Mobile Actions */}
          <div className="md:hidden flex items-center space-x-4 z-50">
            <button className="text-gray-800 hover:text-brand transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black p-1"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Lateral Mobile */}
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
                  {isLoggedIn ? (
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand">
                          <Image src={userAvatarUrl} alt="Perfil" width={48} height={48} className="object-cover" />
                        </div>
                        <span className="font-bold text-black">Associado VIP</span>
                      </div>
                      <Link href="/area-associado" className="text-black font-medium py-2">Meu Perfil</Link>
                      <Link href="/meus-livros" className="text-black font-medium py-2">Meus Livros</Link>
                      <button className="text-red-600 font-medium py-2 text-left">Sair da Conta</button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center bg-black text-white px-4 py-4 font-bold rounded-sm hover:bg-zinc-800"
                    >
                      Login Associado
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
