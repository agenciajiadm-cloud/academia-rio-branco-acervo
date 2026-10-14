"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, Music, Users, Clock, CheckCircle, TrendingUp,
  CreditCard, UserPlus, Plus, DollarSign, ArrowRight,
  Shield, Database, ExternalLink, Sparkles
} from "lucide-react";
import {
  getBooks, getMusics, getMembers,
  type DBMember, type DBBook, type DBMusic
} from "@/lib/db";
import { useDbSync } from "@/lib/useDbSync";
import DbStatus from "@/components/DbStatus";

export default function DiretorDashboard() {
  const currentYear = new Date().getFullYear();
  const currentMonthNum = String(new Date().getMonth() + 1).padStart(2, "0");

  const [members, setMembers] = useState<DBMember[]>([]);
  const [books, setBooks] = useState<DBBook[]>([]);
  const [musics, setMusics] = useState<DBMusic[]>([]);

  const { loading, error } = useDbSync(async () => {
    const [m, b, mu] = await Promise.all([getMembers({ todos: true }), getBooks({ todos: true }), getMusics({ todos: true })]);
    setMembers(m);
    setBooks(b);
    setMusics(mu);
  });

  const mesRefAtual = `${currentYear}-${currentMonthNum}`;
  const monthName = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][new Date().getMonth()];

  const totalMembros = members.length;
  const ativos = members.filter((m) => m.status === "ativo").length;
  const pendentes = members.filter((m) => m.status === "pendente").length;

  let totalArrecadadoMesAtual = 0;
  let totalArrecadadoAno = 0;
  let pagosMesAtualCount = 0;

  members.forEach((m) => {
    const pags = m.pagamentos || [];
    pags.forEach((p) => {
      if (p.status === "pago") {
        if (p.mesReferencia.startsWith(`${currentYear}-`)) {
          totalArrecadadoAno += p.valor || 0;
        }
        if (p.mesReferencia === mesRefAtual) {
          totalArrecadadoMesAtual += p.valor || 0;
          pagosMesAtualCount++;
        }
      } else if (p.status === "isento" && p.mesReferencia === mesRefAtual) {
        pagosMesAtualCount++;
      }
    });
  });

  const taxaAdimplencia = ativos > 0 ? Math.round((pagosMesAtualCount / ativos) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="mb-6 empty:hidden"><DbStatus loading={loading} error={error} /></div>
      {/* Welcome Banner */}
      <div className="bg-black text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold font-mono uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Centro de Controle da Presidência
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight">
            Academia de Letras<br />
            <span className="text-accent font-normal">Barão do Rio Branco</span>
          </h1>
          <p className="text-gray-300 text-base mt-2">
            Painel de gestão operacional de membros, mensalidades, acervo literário e fonográfico.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link
            href="/diretor/mensalidades"
            className="flex items-center gap-2 bg-accent text-black px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            <CreditCard className="w-4 h-4" />
            Planilha de Mensalidades
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver Vitrine Pública
          </Link>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Imortais</p>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-black">{totalMembros}</p>
          <p className="text-xs text-green-600 font-bold mt-1">{ativos} ativos</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Livros</p>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-black">{books.length}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">no acervo</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Músicas & Áudios</p>
            <Music className="w-4 h-4 text-pink-600" />
          </div>
          <p className="text-3xl font-black text-black">{musics.length}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">gravações</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mensalidades {monthName}</p>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-black text-green-700">
            R$ {totalArrecadadoMesAtual.toFixed(0)}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1">{pagosMesAtualCount} associados</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Arrecadado {currentYear}</p>
            <TrendingUp className="w-4 h-4 text-brand" />
          </div>
          <p className="text-2xl font-black text-black">
            R$ {totalArrecadadoAno.toFixed(0)}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1">acumulado anual</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Adimplência</p>
            <CheckCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-black">{taxaAdimplencia}%</p>
          <p className="text-xs text-amber-600 font-bold mt-1">este mês</p>
        </div>
      </div>

      {/* Quick Access Control Grid */}
      <div>
        <h2 className="font-serif font-black text-xl text-black mb-4">
          Ações Rápidas de Gestão
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/diretor/mensalidades"
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-black hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black mb-1">Planilha de Mensalidades</h3>
              <p className="text-xs text-gray-500">Marcar quem pagou ou está pendente mês a mês no formato Excel.</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand group-hover:underline">
              Abrir Planilha <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/diretor/autores"
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-black hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black mb-1">Cadastrar Novo Integrante</h3>
              <p className="text-xs text-gray-500">Inserir novo acadêmico, gerar código, cadeira, biografia e foto.</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand group-hover:underline">
              Gerenciar Membros <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/diretor/livros"
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-black hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black mb-1">Gerenciar Livros & Acervo</h3>
              <p className="text-xs text-gray-500">Cadastrar capas, sinopses, gêneros e links da Amazon para venda.</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand group-hover:underline">
              Ver Livros <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href="/diretor/backup"
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-black hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black mb-1">Backup & Segurança</h3>
              <p className="text-xs text-gray-500">Baixar cópia de segurança em JSON ou restaurar dados em 1 clique.</p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand group-hover:underline">
              Exportar Backup <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Roster & Recent Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-lg text-black">Quadro de Membros Ativos</h3>
            <Link href="/diretor/autores" className="text-xs font-bold text-brand hover:underline">
              Ver todos ({members.length})
            </Link>
          </div>
          <div className="space-y-3">
            {members.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                    {m.foto ? (
                      <Image src={m.foto} fill alt={m.nome} className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {m.nome[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black leading-tight">{m.nome}</p>
                    <p className="text-xs text-gray-400 font-mono">{m.code} · {m.cadeira}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  m.status === "ativo" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Acervo Books Preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-lg text-black">Obras Recentes no Acervo</h3>
            <Link href="/diretor/livros" className="text-xs font-bold text-brand hover:underline">
              Ver todos ({books.length})
            </Link>
          </div>
          <div className="space-y-3">
            {books.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-11 rounded bg-gray-200 overflow-hidden relative shrink-0">
                    {b.capaUrl && (
                      <Image src={b.capaUrl} fill alt={b.titulo} className="object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black leading-tight">{b.titulo}</p>
                    <p className="text-xs text-gray-400">{b.genero} · R$ {(b.preco || 49.9).toFixed(2).replace(".", ",")}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
