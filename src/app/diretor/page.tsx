"use client";

import { useEffect, useState } from "react";
import { BookOpen, Music, Users, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { getBooks, getMusics, getMembers, type DBMember } from "@/lib/db";

export default function DiretorDashboard() {
  const [stats, setStats] = useState({
    livros: 0, musicas: 0,
    totalMembros: 0, ativos: 0, pendentes: 0,
  });

  useEffect(() => {
    const books   = getBooks();
    const musics  = getMusics();
    const members = getMembers() as DBMember[];

    setStats({
      livros:       books.length,
      musicas:      musics.length,
      totalMembros: members.length,
      ativos:       members.filter(m => m.status === "ativo").length,
      pendentes:    members.filter(m => m.status === "pendente").length,
    });
  }, []);

  const cards = [
    { icon: BookOpen,     label: "Livros Cadastrados",    value: stats.livros,       color: "bg-blue-50 text-blue-600" },
    { icon: Music,        label: "Músicas Cadastradas",   value: stats.musicas,      color: "bg-purple-50 text-purple-600" },
    { icon: Users,        label: "Total de Autores",      value: stats.totalMembros, color: "bg-gray-100 text-gray-700" },
    { icon: CheckCircle,  label: "Autores Ativos",        value: stats.ativos,       color: "bg-green-50 text-green-600" },
    { icon: Clock,        label: "Pagamentos Pendentes",  value: stats.pendentes,    color: "bg-amber-50 text-amber-600" },
    { icon: TrendingUp,   label: "Taxa de Ativação",
      value: stats.totalMembros
        ? `${Math.round((stats.ativos / stats.totalMembros) * 100)}%`
        : "—",
      color: "bg-brand/10 text-brand" },
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-black text-black">Visão Geral</h1>
        <p className="text-gray-500 mt-1 text-lg">Academia de Letras Barão do Rio Branco</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium leading-tight">{label}</p>
              <p className="text-3xl font-bold text-black mt-1">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <h2 className="font-serif font-bold text-xl mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/diretor/livros",  label: "Gerenciar Livros",  icon: BookOpen },
            { href: "/diretor/musicas", label: "Gerenciar Músicas", icon: Music },
            { href: "/diretor/autores", label: "Gerenciar Autores", icon: Users },
          ].map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all group"
            >
              <Icon className="w-6 h-6 shrink-0" />
              <span className="font-semibold text-lg">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
