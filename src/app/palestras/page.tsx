import React from "react";
import { Mic, CheckCircle2 } from "lucide-react";

export default function PalestrasPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            <Mic className="w-4 h-4" />
            <span>Eventos e Imersões</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-black mb-4">Contrate Palestras</h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Os imortais e Autores Associados realizam palestras literárias, educacionais e históricas para escolas, universidades e corporações em todo o Brasil. Preencha o pré-agendamento abaixo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <form action="mailto:contato@academiariobranco.com.br" method="POST" encType="text/plain" className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Solicitante</label>
                <input type="text" name="Nome" required className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail Profissional</label>
                <input type="email" name="Email" required className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp / Telefone</label>
                <input type="tel" name="WhatsApp" required className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Instituição/Escola</label>
                <input type="text" name="Instituicao" required className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="Ex: Colégio Estadual..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema Desejado</label>
                <input type="text" name="Tema" required className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="Qual o recorte histórico ou literário focado?" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Data e Horário Sugeridos</label>
                <input type="text" name="DataSugerida" className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="Sugerir 2 ou 3 datas possíveis." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem do Escopo (Opcional)</label>
              <textarea name="Mensagem" rows={4} className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="Fale um pouco sobre o público alvo e o que esperam do autor..."></textarea>
            </div>

            <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between">
              <div className="text-sm text-gray-500 mb-6 md:mb-0 max-w-sm">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>O envio submeterá os dados diretamente à nossa equipe de avaliação via e-mail corporativo.</p>
                </div>
              </div>
              <button type="submit" className="w-full md:w-auto flex items-center justify-center space-x-2 bg-black text-white px-10 py-4 font-bold rounded-sm hover:opacity-80 transition-opacity">
                <span>Solicitar Orçamento de Palestra</span>
              </button>
            </div>
            
          </form>
        </div>

      </div>
    </div>
  );
}
