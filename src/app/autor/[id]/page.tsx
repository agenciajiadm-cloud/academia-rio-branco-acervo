import { authors, books } from "@/data/mock";
import AutorDetailClient from "./AutorDetailClient";

export async function generateStaticParams() {
  const realAuthors = authors.map((author) => ({
    id: author.id,
  }));
  const placeholders = Array.from({ length: 9 }).map((_, i) => ({
    id: `placeholder-${i}`,
  }));
  
  return [...realAuthors, ...placeholders];
}

export default async function AutorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const isPlaceholder = id.startsWith("placeholder-");
  const author = authors.find(a => a.id === id);

  const profile = isPlaceholder ? {
    id,
    name: "Aguardando cadastro",
    bio: "Associado em trâmite na integração de plataforma digital.",
    fullHistory: "Informações completas, biografia e acervo de livros do associado estarão disponíveis em breve após a conclusão de sua homologação nos registros online da Academia de Letras Barão do Rio Branco.",
    photoUrl: "https://ui-avatars.com/api/?name=Aguardando+Cadastro&background=333&color=666&size=512",
    cidade: "Em Breve",
    cadeira: "Cadeira Não Vinculada"
  } : author || {
    id,
    name: "Membro da Academia",
    bio: "Associado da Academia de Letras Barão do Rio Branco.",
    photoUrl: `https://ui-avatars.com/api/?name=Membro&background=1a1a1a&color=ffd700&size=512`,
  };

  const authorBooks = books.filter(b => b.authorId === id);

  return (
    <AutorDetailClient
      id={id}
      initialAuthor={profile as any}
      initialBooks={authorBooks}
    />
  );
}

