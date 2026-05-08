"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, RefreshCw, Check, AlertCircle, Shield } from "lucide-react";
import { getMemberByCode, activateMember } from "@/lib/members";

const MENSALIDADE_VALOR = 49.9;
const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? "";

function MensalidadeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code") ?? "";
  const [member, setMember] = useState<ReturnType<typeof getMemberByCode>>(null);
  const [plan, setPlan] = useState<"mensal" | "recorrente">("mensal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (code) {
      const m = getMemberByCode(code);
      setMember(m);
    }
  }, [code]);

  async function handlePay() {
    if (!member) return;
    setLoading(true);
    setError("");

    try {
      if (plan === "recorrente") {
        // Mercado Pago Subscriptions — redireciona para checkout externo
        const res = await fetch("/api/mp/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberCode: member.code, memberEmail: member.email }),
        });
        if (!res.ok) throw new Error("Erro ao criar assinatura");
        const { init_point } = await res.json();
        window.location.href = init_point;
        return;
      }

      // Pagamento avulso mensal — Mercado Pago Checkout
      const res = await fetch("/api/mp/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberCode: member.code, memberEmail: member.email }),
      });
      if (!res.ok) throw new Error("Erro ao criar preferência de pagamento");
      const { init_point } = await res.json();
      window.location.href = init_point;
    } catch (err: any) {
      // Fallback em dev: ativa diretamente (remover em produção)
      if (process.env.NODE_ENV === "development") {
        activateMember(member.code);
        router.push("/area-associado");
        return;
      }
      setError(err.message ?? "Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  }

  if (!code) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Código não informado.</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <p className="text-gray-700 font-bold">Código não encontrado</p>
        <p className="text-gray-400 text-sm mt-2">Verifique seu código e tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-brand rounded-lg flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-center text-black mb-1">Mensalidade</h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Associado: <span className="font-bold text-black">{member.nome}</span> · {member.code}
        </p>

        {/* Plano */}
        <div className="space-y-3 mb-8">
          <p className="text-sm font-bold text-gray-700 mb-3">Escolha seu plano</p>

          <button
            onClick={() => setPlan("mensal")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              plan === "mensal" ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-left">
              <p className="font-bold text-black">Mensal</p>
              <p className="text-xs text-gray-500">Renovação manual todo mês</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-black text-lg">R$ {MENSALIDADE_VALOR.toFixed(2).replace(".", ",")}</p>
              {plan === "mensal" && <Check className="w-4 h-4 text-brand ml-auto mt-1" />}
            </div>
          </button>

          <button
            onClick={() => setPlan("recorrente")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              plan === "recorrente" ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-left">
              <p className="font-bold text-black flex items-center gap-2">
                Recorrente
                <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full font-bold">Recomendado</span>
              </p>
              <p className="text-xs text-gray-500">Cobrança automática mensal — cancele quando quiser</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-black text-lg">R$ {MENSALIDADE_VALOR.toFixed(2).replace(".", ",")}/mês</p>
              {plan === "recorrente" && <Check className="w-4 h-4 text-brand ml-auto mt-1" />}
            </div>
          </button>
        </div>

        {/* O que inclui */}
        <div className="bg-gray-50 rounded-xl p-5 mb-8 text-sm text-gray-700 space-y-2">
          {[
            "Carteirinha digital de associado",
            "Perfil na vitrine de autores",
            "Cadastro de obras na livraria",
            "Botão de contratação de palestras (se habilitado)",
            "Acesso ao painel do associado",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand text-white px-8 py-4 font-bold rounded-sm hover:opacity-90 transition-opacity disabled:opacity-60 text-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Processando...
            </>
          ) : plan === "recorrente" ? (
            <>
              <RefreshCw className="w-5 h-5" />
              Assinar com Mercado Pago
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pagar R$ {MENSALIDADE_VALOR.toFixed(2).replace(".", ",")}
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Pagamento 100% seguro via Mercado Pago</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function MensalidadePage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24 px-4">
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Carregando...</div>}>
        <MensalidadeContent />
      </Suspense>
    </div>
  );
}
