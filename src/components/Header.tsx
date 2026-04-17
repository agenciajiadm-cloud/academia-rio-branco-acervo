"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-md py-4 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-12 flex justify-between items-center">
        {/* Lado Esquerdo - Logo e Texto */}
        <Link href="/" className="flex items-center space-x-3 group">
          <Image
            src="/images/LOGO ACADEMIA LETRAS BARÃO..png"
            alt="Academia de Letras"
            width={180}
            height={80}
            className="w-auto h-20 object-contain group-hover:opacity-80 transition-opacity"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-black font-serif font-bold text-lg leading-tight uppercase tracking-wide">
              Academia de Letras <br/> Barão do Rio Branco
            </span>
          </div>
        </Link>

        {/* Centro - Links, Hidden on Mobile */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
          <Link href="/" className="hover:text-brand hover:underline underline-offset-4 transition-colors">
            Livraria
          </Link>
          <Link href="/autores" className="hover:text-brand hover:underline underline-offset-4 transition-colors">
            Autores
          </Link>
          <Link href="/sobre" className="hover:text-brand hover:underline underline-offset-4 transition-colors">
            Sobre
          </Link>
        </nav>

        {/* Lado Direito - Ações */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-800 hover:text-brand transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <Link
            href="/login"
            className="border-2 border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition-all rounded-sm"
          >
            Login Associado
          </Link>
        </div>
      </div>
    </header>
  );
}
