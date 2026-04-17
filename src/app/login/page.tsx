"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "teste@ji.com" && password === "123") {
      router.push("/painel");
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-white pt-20">
      {/* Esquerda - Imagem Abstrata */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
        <Image
          src="/images/CAPA PENSAMENTOS NA ESCURIDÃO FINAL.png"
          alt="Abstract Literary"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h2 className="text-white text-4xl font-serif font-bold text-center px-12">
            A porta de entrada<br />para a imortalidade literária.
          </h2>
        </div>
      </div>

      {/* Direita - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-serif font-bold text-black mb-2">Acesso Privado</h1>
          <p className="text-gray-500 mb-8">Faça login com suas credenciais de associado.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                className="w-full border-b-2 border-gray-300 focus:border-brand outline-none py-2 transition-colors bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                required
                className="w-full border-b-2 border-gray-300 focus:border-brand outline-none py-2 transition-colors bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">Credenciais Inválidas</p>
            )}

            <button
              type="submit"
              className="w-full bg-brand text-white py-4 font-bold text-lg hover:bg-accent transition-colors shadow-lg hover:shadow-accent/30 rounded-sm mt-4"
            >
              Acessar Acervo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
