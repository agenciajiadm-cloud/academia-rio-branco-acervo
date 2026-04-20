import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authors, books } from "@/data/mock";
import BookCard from "@/components/BookCard";
import { Mic, ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const realAuthors = authors.map((author) => ({
    id: author.id,
  }));
  // Mapeamos também os 9 placeholders de forma estática para não dar 404
  const placeholders = Array.from({ length: 9 }).map((_, i) => ({
    id: `placeholder-${i}`,
  }));
  
  return [...realAuthors, ...placeholders];
}

export default async function AutorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const isPlaceholder = id.startsWith("placeholder-");
  const author = authors.find(a => a.id === id);

  if (!author && !isPlaceholder) {
    notFound();
  }

  // Preencher com info dummy caso seja placeholder
  const profile = isPlaceholder ? {
    name: "Aguardando cadastro",
    bio: "Associado em trâmite na integração de plataforma digital.",
    fullHistory: "Informações completas, biografia e acervo de livros do associado estarão disponíveis em breve após a conclusão de sua homologação nos registros online da Academia de Letras Barão do Rio Branco.",
    photoUrl: "https://ui-avatars.com/api/?name=Aguardando+Cadastro&background=333&color=666&size=512",
    cidade: "Em Breve",
    cadeira: "Cadeira Não Vinculada"
  } : author;

  const authorBooks = books.filter(b => b.authorId === id);

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        
        <Link href="/autores" className="inline-flex items-center space-x-2 text-gray-500 hover:text-black mb-8 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao quadro de imortais</span>
        </Link>

        {/* Profile Card Master */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-12 items-center md:items-start mb-16">
          
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-fu bg-gray-100 shrink-0 relative overflow-hidden shadow-xl border-4 border-white">
            <Image src={profile!.photoUrl} alt={profile!.name} fill className="object-cover" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider mb-4 rounded-sm">
              {profile!.cadeira || "Membro Associado"}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-serif font-black text-black mb-4">
              {profile!.name}
            </h1>
            
            <p className="text-xl text-brand font-medium mb-6">
              {profile!.bio}
            </p>

            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {profile!.fullHistory}
            </p>
          </div>
        </div>

        {/* Biblioteca do Autor */}
        {authorBooks.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-8 border-b-2 border-brand inline-block pb-2">Acervo Publicado</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {authorBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {/* Palestras Block */}
        {!isPlaceholder && (
          <div className="bg-black rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl">
            <div className="max-w-2xl text-center md:text-left mb-8 md:mb-0">
               <div className="flex items-center space-x-3 mb-4 justify-center md:justify-start">
                 <Mic className="w-6 h-6 text-brand" />
                 <h3 className="text-2xl font-serif font-bold">Solicitar Palestra Oficial</h3>
               </div>
               <p className="text-gray-400">Leve discussões ricas deste autor literário direto para sua escola, corporação ou roda de cultura.</p>
            </div>
            <Link href="/palestras" className="bg-brand text-white font-bold py-4 px-10 rounded-sm hover:-translate-y-1 transition-transform">
               Agendar Agora
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
