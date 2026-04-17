import Image from "next/image";
import Link from "next/link";
import { books, authors } from "@/data/mock";
import { ChevronLeft, ShoppingCart, Lock } from "lucide-react";
import { notFound } from "next/navigation";

// Utilizando página server-side para renderização amigável de e-commerce
export default async function LivroPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const bookId = resolvedParams.id;
  
  const book = books.find((b) => b.id === bookId);
  if (!book) {
    notFound();
  }

  const author = authors.find((a) => a.id === book.authorId);

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-12">
        <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-brand font-medium mb-12 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>Voltar ao Acervo</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Esquerda: Capa Expandida */}
            <div className="md:w-2/5 md:bg-gray-100 p-8 md:p-16 flex justify-center items-center relative">
              <div className="w-full max-w-sm relative aspect-[2/3] shadow-2xl rounded-sm">
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover rounded-sm"
                />
              </div>
            </div>

            {/* Direita: Textos e Compra */}
            <div className="md:w-3/5 p-8 md:p-16 flex flex-col justify-center">
              <div className="mb-2 uppercase tracking-widest text-xs font-bold text-gray-400">
                Lançamento Exclusivo
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-black mb-2 leading-tight">
                {book.title}
              </h1>
              <h2 className="text-xl text-gray-500 font-medium mb-8">
                {book.subtitle}
              </h2>

              <div className="flex items-center space-x-4 mb-8">
                {author && (
                  <>
                    <Image
                      src={author.photoUrl}
                      alt={author.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover border-2 border-transparent hover:border-brand transition-colors cursor-pointer"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Escrito por</p>
                      <p className="font-serif font-bold text-lg text-black">{author.name}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-10 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {book.description || "Nenhuma descrição detalhada disponível para esta obra."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-8 mt-auto">
                <div className="text-center sm:text-left mb-6 sm:mb-0">
                  <span className="block text-sm text-gray-500 font-medium mb-1">Preço Oficial</span>
                  <span className="text-4xl font-black text-brand tracking-tighter">
                    R$ {book.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex w-full sm:w-auto space-x-4">
                  <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-black text-white px-8 py-4 font-bold rounded-sm hover:bg-gray-800 transition-shadow shadow-lg">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </div>
              </div>

              {/* Autenticidade */}
              <div className="mt-8 flex items-center text-sm text-gray-400 space-x-2 border border-gray-100 p-3 rounded-md bg-white">
                <Lock className="w-4 h-4 text-green-600" />
                <span>Edição Digital Oficial e Protegida. Distribuição via Academia de Letras.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
