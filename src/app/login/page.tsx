import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function Login() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
             <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-center text-black mb-2">Restrito aos Associados</h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Painel exclusivo para Autores, Imortais e Diretoria operarem suas palestras e obras.
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">E-mail Institucional</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded-md p-4 focus:ring-black focus:border-black outline-none bg-gray-50" 
              placeholder="autor@academiariobranco.com.br"
              defaultValue="policarpo@academiariobranco.com.br" 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">Senha</label>
              <a href="#" className="text-xs text-brand hover:underline">Esqueceu a senha?</a>
            </div>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-md p-4 focus:ring-black focus:border-black outline-none bg-gray-50" 
              placeholder="••••••••" 
              defaultValue="123456"
            />
          </div>

          <Link href="/area-associado" className="mt-8 w-full flex items-center justify-center space-x-2 bg-black text-white px-8 py-4 font-bold rounded-sm hover:bg-zinc-800 transition-colors">
            <span>Acessar Painel (BETA)</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </form>

      </div>
    </div>
  );
}
