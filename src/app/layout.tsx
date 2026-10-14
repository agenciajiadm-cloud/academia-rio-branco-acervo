import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Acervo Next-Gen | Academia de Letras Barão do Rio Branco",
  description: "A Netflix dos Livros — Preservando a Literatura Amazônida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <SmoothScroll>
          <ScrollProgress />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

