"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Copy, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { registerMember } from "@/lib/members";

export default function Cadastro() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cadeira: "",
    cidade: "",
    titulacao: "",
    instagram: "",
    palestras: false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const member = registerMember(form);
    setCode(member.code);
    setStep("success");
    setLoading(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24 px-4">
      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12"
            >
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-brand rounded-lg flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-serif font-bold text-center text-black mb-2">
                Seja um Associado
              </h1>
              <p className="text-gray-500 text-center mb-8 text-sm">
                Preencha seus dados. Ao confirmar, você receberá seu código de acesso único.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo ou Pseudônimo *</label>
                  <input
                    required
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Como deve aparecer no portal"
                    className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">E-mail *</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Número ou Título da Cadeira</label>
                  <input
                    name="cadeira"
                    value={form.cadeira}
                    onChange={handleChange}
                    placeholder="Ex: Patrono X / Cadeira 1"
                    className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Cidade e Estado *</label>
                  <input
                    required
                    name="cidade"
                    value={form.cidade}
                    onChange={handleChange}
                    placeholder="Ex: Macapá, AP"
                    className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Formação e Titulações</label>
                  <input
                    name="titulacao"
                    value={form.titulacao}
                    onChange={handleChange}
                    placeholder="Ex: Doutor em Letras, Professor de História..."
                    className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Instagram</label>
                  <input
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="@seuinstagram"
                    className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-brand/5 rounded-lg border border-brand/20">
                  <input
                    type="checkbox"
                    id="palestras"
                    name="palestras"
                    checked={form.palestras}
                    onChange={handleChange}
                    className="w-4 h-4 accent-brand"
                  />
                  <label htmlFor="palestras" className="text-sm text-gray-700 font-medium cursor-pointer">
                    Tenho disponibilidade para palestras corporativas e educacionais
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 font-bold rounded-sm hover:bg-zinc-800 transition-colors disabled:opacity-60 mt-4"
                >
                  {loading ? "Gerando seu código..." : (
                    <>
                      <span>Confirmar Cadastro</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <h2 className="text-2xl font-serif font-bold text-black mb-3">Cadastro realizado!</h2>
              <p className="text-gray-500 mb-8 text-sm max-w-sm mx-auto">
                Guarde bem o seu código de associado. Ele é sua identificação única na Academia.
              </p>

              <div className="bg-gray-900 rounded-xl p-6 mb-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Seu código de associado</p>
                <p className="text-5xl font-mono font-black text-white tracking-widest">{code}</p>
              </div>

              <button
                onClick={copyCode}
                className="flex items-center gap-2 mx-auto bg-gray-100 hover:bg-gray-200 text-black px-6 py-3 rounded-sm font-bold text-sm transition-colors mb-8"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado!" : "Copiar código"}
              </button>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-sm text-amber-800">
                <strong>Importante:</strong> Anote este código. Para acessar o painel, você precisará dele junto com o pagamento da mensalidade.
              </div>

              <Link
                href={`/mensalidade?code=${encodeURIComponent(code)}`}
                className="w-full flex items-center justify-center gap-2 bg-brand text-white px-8 py-4 font-bold rounded-sm hover:opacity-90 transition-opacity"
              >
                <span>Pagar Mensalidade e Ativar</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="mt-4 text-xs text-gray-400">
                Já tem código?{" "}
                <Link href="/login" className="text-brand font-bold hover:underline">
                  Faça login
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
