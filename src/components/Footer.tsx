import { AtSign, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <h3 className="font-serif text-xl mb-4 text-brand">Academia de Letras Barão do Rio Branco</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6">
            Preservando e expandindo o conhecimento clássico para a nova geração digital do Amapá para o Brasil.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors"><AtSign className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors"><MessageCircle className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors"><Globe className="w-5 h-5" /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-wider">Acesso Rápido</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/sobre" className="hover:text-white transition-colors">Nossa História</Link></li>
            <li><Link href="/autores" className="hover:text-white transition-colors">Imortais & Autores</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Área do Associado</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-wider">Legal</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
            <li><Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-12 pt-8 border-t border-gray-800 text-center flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© 2030 Academia de Letras. Todos os direitos reservados.</p>
        <p className="mt-4 md:mt-0">Desenvolvido com tecnologia <span className="font-bold text-white">Agência JI</span></p>
      </div>
    </footer>
  );
}
