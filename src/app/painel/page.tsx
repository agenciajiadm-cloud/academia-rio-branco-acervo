"use client";

import { Lock } from "lucide-react";
import Image from "next/image";

export default function Painel() {
  return (
    <div className="flex min-h-screen bg-gray-50 pt-[88px]">
      {/* Sidebar Escura */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <div className="mb-10">
          <Image
            src="/images/LOGO ACADEMIA LETRAS BARÃO..png"
            alt="Logo"
            width={120}
            height={40}
            className="filter invert brightness-0"
          />
        </div>
        <nav className="space-y-4">
          <a href="#" className="block px-4 py-2 bg-white/10 rounded-md font-medium text-brand border-l-2 border-brand">
            Novo Livro
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-white/5 rounded-md text-gray-400 transition-colors">
            Meu Acervo
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-white/5 rounded-md text-gray-400 transition-colors">
            Gerenciar Imortais
          </a>
          <a href="#" className="block px-4 py-2 hover:bg-white/5 rounded-md text-gray-400 transition-colors">
            Configurações
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-black mb-8 border-b pb-4">Publicar Novo Livro</h1>
          
          <div className="bg-white p-8 shadow-sm rounded-lg border border-gray-100 mb-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título do Livro</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                  <select className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none bg-white">
                    <option>Selecione...</option>
                    <option>Policarpo</option>
                    <option>Machado Souza</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                <input type="number" step="0.01" className="w-full md:w-1/3 border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="0,00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição / Sinopse</label>
                <textarea rows={4} className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="Digite a descrição literária do livro..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="block text-sm font-medium text-gray-600">Fazer upload do PDF Final</span>
                  <input type="file" className="hidden" accept=".pdf" />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <span className="block text-sm font-medium text-gray-600">Fazer upload da Capa (.png/.jpg)</span>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              <button type="button" className="bg-black text-white px-8 py-3 font-semibold rounded-sm hover:bg-gray-800 transition-colors">
                Salvar Rascunho
              </button>
            </form>
          </div>

          {/* O Ouro da JI: Trava de Upsell */}
          <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden group">
            <div className="flex items-start space-x-4">
              <div className="bg-white p-3 rounded-full flex-shrink-0">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-600 mb-1">Módulo Omnichannel (Bloqueado)</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Sincronize seu estoque automaticamente com os maiores marketplaces do país.
                  <br />
                  <span className="text-brand font-semibold cursor-pointer hover:underline">Contate a Agência JI para liberar a sincronização multicanais.</span>
                </p>
                
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                    <input type="checkbox" disabled className="w-4 h-4 rounded text-brand border-gray-300" />
                    <span className="text-sm font-medium text-gray-700">Amazon (KDP / Físico)</span>
                  </label>
                  <label className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                    <input type="checkbox" disabled className="w-4 h-4 rounded text-brand border-gray-300" />
                    <span className="text-sm font-medium text-gray-700">Mercado Livre</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Efeito interativo ao tentar clicar na área bloqueada */}
            <div className="absolute inset-0 bg-transparent cursor-not-allowed flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
              <span className="bg-black text-white text-xs px-3 py-1 rounded-sm font-bold shadow-lg">
                Funcionalidade Premium
              </span>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
