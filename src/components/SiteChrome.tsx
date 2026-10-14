"use client";

import { usePathname } from "next/navigation";

/**
 * Cabeçalho, rodapé e barra de progresso do site público. O painel do
 * diretor tem navegação própria (barra lateral com "Sair do Painel"), então
 * lá eles não aparecem.
 */
export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const painel = pathname === "/diretor" || pathname.startsWith("/diretor/");

  return (
    <>
      {!painel && header}
      <main className="flex-grow">{children}</main>
      {!painel && footer}
    </>
  );
}
