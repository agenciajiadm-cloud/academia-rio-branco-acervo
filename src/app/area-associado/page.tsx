import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users, LogOut, Settings, Award, Mic } from "lucide-react";
import { authors, books } from "@/data/mock";

export default function AreaAssociado() {
  // Simulando login do único usuário homologado na V1
  const user = authors.find(a => a.id === "policarpo");
  const myBooks = books.filter(b => b.authorId === "policarpo");

  if (!user) return <div className="p-20 text-center">Usuário não encontrado</div>;

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 mb-4">
                <Image src={user.photoUrl} alt={user.name} width={96} height={96} className="object-cover" />
              </div>
              <h2 className="font-serif font-bold text-xl">{user.name}</h2>
              <span className="text-brand text-sm font-bold mt-1 uppercase tracking-wider">{user.cadeira || "Associado"}</span>
            </div>
            
            <div className="mt-8 space-y-2">
               <button className="w-full flex items-center space-x-3 text-sm font-medium p-3 rounded bg-gray-50 text-black">
                 <Settings className="w-5 h-5 text-gray-500" />
                 <span>Configurar Perfil</span>
               </button>
               <Link href="/login" className="w-full flex items-center space-x-3 text-sm font-medium p-3 rounded hover:bg-red-50 text-red-600 transition-colors">
                 <LogOut className="w-5 h-5" />
                 <span>Sair da Conta</span>
               </Link>
            </div>
          </div>
        </div>

        {/* Console Content */}
        <div className="w-full md:w-3/4 space-y-8">
          
          <h1 className="text-3xl font-serif font-black text-black">Painel do Associado</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                 <BookOpen className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-sm font-medium text-gray-500">Obras Publicadas</p>
                  <p className="text-2xl font-bold">{myBooks.length}</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
               <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-brand">
                 <Mic className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-sm font-medium text-gray-500">Palestras Agendadas</p>
                  <p className="text-2xl font-bold">2</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
               <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                 <Award className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-sm font-medium text-gray-500">Status Na Academia</p>
                  <p className="text-lg font-bold">Ativo</p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-serif font-bold text-xl mb-6">Miniaturas do seu Acervo</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {myBooks.map(book => (
                <div key={book.id} className="min-w-[120px]">
                  <div className="relative w-[120px] h-[180px] bg-gray-100 rounded shadow-md overflow-hidden mb-2">
                    <Image src={book.coverUrl} fill alt={book.title} className="object-cover" />
                  </div>
                  <p className="text-xs font-bold truncate pr-2">{book.title}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
