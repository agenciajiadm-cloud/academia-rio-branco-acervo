"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, Music, Users, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import type { Member } from "@/lib/members";

const NAV = [
  { href: "/diretor",          label: "Visão Geral",  icon: LayoutDashboard },
  { href: "/diretor/livros",   label: "Livros",       icon: BookOpen },
  { href: "/diretor/musicas",  label: "Músicas",      icon: Music },
  { href: "/diretor/autores",  label: "Autores",      icon: Users },
];

export default function DiretorLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [member, setMember]     = useState<Member | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("academia_current_member");
    if (!raw) { router.replace("/login"); return; }
    const m: Member = JSON.parse(raw);
    if (m.role !== "diretor") { router.replace("/area-associado"); return; }
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
      <aside className="hidden md:flex flex-col w-64 bg-black text-white fixed inset-y-0 left-0 z-50">
        <div className="px-6 py-8 border-b border-white/10">
          <p className="text-[11px] text-white/40 uppercase tracking-[0.2em] mb-2">Painel da Diretoria</p>
          <p className="font-serif font-bold text-base leading-snug">Academia de Letras<br />Barão do Rio Branco</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-white/40">Logado como</p>
            <p className="text-sm font-semibold text-white truncate">{member.nome.split(" ")[0]}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium text-white/55 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Top bar mobile ──────────────────────────────────── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-black text-white flex items-center justify-between px-5 h-16">
        <p className="font-serif font-bold text-base">Diretoria</p>
        <button onClick={() => setMenuOpen(v => !v)} className="p-2">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black text-white flex flex-col pt-16">
          <nav className="flex-1 p-5 space-y-2">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-4 rounded-xl text-xl font-medium text-white/80 hover:bg-white/10 transition-colors"
              >
                <Icon className="w-7 h-7" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-5 border-t border-white/10">
            <button
              onClick={logout}
              className="flex items-center gap-4 px-4 py-4 rounded-xl text-xl font-medium text-red-400 hover:bg-red-500/15 transition-colors w-full"
            >
              <LogOut className="w-7 h-7" />
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
