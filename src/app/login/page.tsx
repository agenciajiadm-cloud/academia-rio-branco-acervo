"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, AlertCircle } from "lucide-react";
import { getMemberByCode, seedIfEmpty } from "@/lib/members";

export default function Login() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { seedIfEmpty(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 500));

    const normalized = code.trim().toUpperCase().startsWith("#") ? code.trim() : `#${code.trim()}`;
    const member = getMemberByCode(normalized);

    if (!member) {
      setError("Código não encontrado. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    if (member.status === "pendente") {
      router.push(`/mensalidade?code=${encodeURIComponent(member.code)}`);
      return;
    }

    sessionStorage.setItem("academia_current_member", JSON.stringify(member));

    if (member.role === "diretor") {
      router.push("/diretor");
    } else {
      router.push("/area-associado");
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center pt-32 px-4 pb-24">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-center text-black mb-2">
          Área dos Associados
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Digite seu código de associado para acessar o painel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Código de Associado
            </label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="#000000"
              className="w-full border border-gray-300 rounded-md p-4 text-center text-2xl font-mono tracking-widest focus:ring-brand focus:border-brand outline-none bg-gray-50"
              maxLength={7}
            />
            <p className="text-xs text-gray-400 mt-2 text-center">
              Recebeu seu código no cadastro. Ex: #009390
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-bold rounded-sm hover:bg-zinc-800 transition-colors disabled:opacity-60"
          >
            {loading ? "Verificando..." : (
              <>
                <span>Acessar Painel</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          Ainda não é associado?{" "}
          <Link href="/cadastro" className="text-brand font-bold hover:underline">
            Cadastre-se aqui
          </Link>
        </div>

        <div className="mt-3 text-center text-xs text-gray-400">
          Administrador?{" "}
          <Link href="/admin" className="hover:underline">
            Acesso restrito
          </Link>
        </div>
      </div>
    </div>
  );
}
