"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Music, Users, LayoutDashboard, LogOut, Menu, X,
  CreditCard, Database, ExternalLink, ShieldCheck, Sparkles
} from "lucide-react";
import type { DBMember } from "@/lib/db";

const NAV = [
  { href: "/diretor",             label: "Visão Geral",          icon: LayoutDashboard },
  { href: "/diretor/mensalidades",label: "Planilha Mensalidades", icon: CreditCard, badge: "Excel" },
  { href: "/diretor/autores",     label: "Quadro de Imortais",    icon: Users },
  { href: "/diretor/livros",      label: "Livros do Acervo",     icon: BookOpen },
  { href: "/diretor/musicas",     label: "Músicas & Áudios",     icon: Music },
  { href: "/diretor/backup",      label: "Backup de Dados",       icon: Database },
];

export default function DiretorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [member, setMember] = useState<DBMember | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("academia_current_member");
    if (!raw) {
      router.replace("/login");
      return;
    }
    const m: DBMember = JSON.parse(raw);
    if (m.role !== "diretor") {
      router.replace("/area-associado");
      return;
    }
    setMember(m);
  }, [router]);

  function logout() {
    sessionStorage.removeItem("academia_current_member");
    router.push("/login");
  }

  if (!member) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar desktop ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-black text-white fixed inset-y-0 left-0 z-50 shadow-xl">
        <div className="px-6 py-7 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-bold">
              Centro de Controle
            </p>
          </div>
          <p className="font-serif font-bold text-base leading-snug">
            Academia de Letras<br />
            <span className="text-white/70 font-normal text-xs">Barão do Rio Branco</span>
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-white/15 text-white font-bold shadow-xs"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-accent" : ""}`} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-[10px] bg-accent/20 text-accent border border-accent/30 px-1.5 py-0.5 rounded font-mono font-bold">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 mt-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver Site Público</span>
              </div>
              <span className="text-[10px] text-white/30">↗</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 bg-zinc-950">
          <div className="px-2 py-1 mb-3">
            <p className="text-[11px] text-white/40">Presidente / Diretor</p>
            <p className="text-sm font-bold text-white truncate">{member.nome}</p>
            <p className="text-[10px] font-mono text-accent font-bold">{member.code}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/15 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* ── Top bar mobile ──────────────────────────────────── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-black text-white flex items-center justify-between px-5 h-16 shadow-md">
        <div>
          <p className="font-serif font-bold text-sm">Painel da Diretoria</p>
          <p className="text-[10px] text-white/50">Academia Barão do Rio Branco</p>
        </div>
        <button onClick={() => setMenuOpen((v) => !v)} className="p-2">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black text-white flex flex-col pt-16">
          <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
            {NAV.map(({ href, label, icon: Icon, badge }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                  pathname === href ? "bg-white/15 text-white font-bold" : "text-white/70 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="text-xs bg-accent text-black font-bold px-2 py-0.5 rounded">
                    {badge}
                  </span>
                )}
              </Link>
            ))}

            <Link
              href="/"
              target="_blank"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-white/50"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Ver Site Público</span>
            </Link>
          </nav>
          <div className="p-5 border-t border-white/10">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-red-400 hover:bg-red-500/15 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────── */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
