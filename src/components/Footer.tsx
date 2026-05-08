import { AtSign, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-8">

      {/* Bloco principal */}
      <div className="wrapper grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

        {/* Identidade — col 1-6 */}
        <div className="md:col-span-6 space-y-6">
          <h3 className="font-serif font-black text-white leading-tight text-3xl md:text-5xl">
            Academia de Letras<br />
            <span className="text-accent">Barão do Rio Branco</span>
          </h3>
          <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
            Preservando e expandindo o legado literário do Amapá para o Brasil.
            Fundada em 26 de Janeiro de 2025.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center hover:bg-accent transition-colors duration-300" aria-label="Instagram">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center hover:bg-accent transition-colors duration-300" aria-label="Email">
              <AtSign className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center hover:bg-accent transition-colors duration-300" aria-label="Site">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Acesso rápido — col 8-10 */}
        <div className="md:col-span-3">
          <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em] text-gray-500">Acesso Rápido</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            {[
              { label: "Nossa História", href: "/sobre" },
              { label: "Imortais & Autores", href: "/autores" },
              { label: "Contrate Palestras", href: "/palestras" },
              { label: "Contato", href: "/contato" },
              { label: "Área do Associado", href: "/login" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors duration-300 link-anim">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal — col 11-12 */}
        <div className="md:col-span-3">
          <h4 className="font-bold mb-6 uppercase text-xs tracking-[0.2em] text-gray-500">Legal</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/termos" className="hover:text-white transition-colors duration-300 link-anim">Termos de Uso</Link></li>
            <li><Link href="/privacidade" className="hover:text-white transition-colors duration-300 link-anim">Política de Privacidade</Link></li>
          </ul>
        </div>
      </div>

      {/* Patrocinadores — logos grandes, sem fundo */}
      <div className="wrapper mb-14">
        <p className="text-[11px] uppercase tracking-[0.25em] text-gray-600 font-bold mb-8">
          Patrocinadores & Apoiadores
        </p>
        <div className="flex flex-wrap items-center gap-12 md:gap-16">
          {[1, 2, 3].map((n) => (
            <div key={n} className="opacity-50 hover:opacity-100 transition-opacity duration-400">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/imagens/patrocinadores/${n}.png`}
                alt={`Patrocinador ${n}`}
                style={{ height: "80px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé final */}
      <div className="wrapper pt-8 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
        <p>© 2026 Academia de Letras Barão do Rio Branco. Todos os direitos reservados.</p>

        <a
          href="https://agenciaji.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300 group"
        >
          <span className="text-gray-500 group-hover:text-white transition-colors text-xs">Tecnologia</span>
          <div className="relative w-16 h-6">
            <Image
              src="/imagens/logo-JI.png"
              alt="Agência JI"
              fill
              className="object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
        </a>
      </div>
    </footer>
  );
}
