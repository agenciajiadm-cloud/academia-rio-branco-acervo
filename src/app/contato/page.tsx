import React from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";

export default function ContatoPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-black mb-4">Fale Conosco</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Entre em contato com a Academia de Letras Barão do Rio Branco. Estamos à disposição para parcerias, associações e informações institucionais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Lado Esquerdo - Infos */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <h2 className="text-2xl font-serif font-bold text-black mb-8 border-b-2 border-brand inline-block pb-2">Central de Atendimento</h2>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-black mb-1">E-mail Institucional</p>
                  <p className="text-gray-500">contato@academiariobranco.com.br</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-black mb-1">WhatsApp</p>
                  <p className="text-gray-500">(11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-black mb-1">Sede Oficial</p>
                  <p className="text-gray-500 leading-relaxed">
                    Avenida Pres. Vargas, 1000 - Centro<br/>
                    Macapá - AP, 68900-000
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Form */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <form action="mailto:contato@academiariobranco.com.br" method="POST" encType="text/plain" className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seu Nome Completo</label>
                <input type="text" name="Nome" required className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="Machado de Assis" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <input type="email" name="Email" required className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="seu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input type="tel" name="WhatsApp" required className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <textarea name="Mensagem" rows={5} required className="w-full border border-gray-300 rounded-md p-3 focus:ring-brand focus:border-brand outline-none" placeholder="Como podemos ajudar?"></textarea>
              </div>

              <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-brand text-white px-8 py-4 font-bold rounded-sm hover:bg-black transition-colors">
                <Send className="w-5 h-5" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
