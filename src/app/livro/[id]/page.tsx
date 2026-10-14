import { books, authors } from "@/data/mock";
import LivroDetailClient from "./LivroDetailClient";

export function generateStaticParams() {
  return books.map((book) => ({
    id: book.id,
  }));
}

export default async function LivroPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const bookId = resolvedParams.id;
  
  const book = books.find((b) => b.id === bookId) || books[0];
  const author = authors.find((a) => a.id === book.authorId) || null;

  return (
    <LivroDetailClient
      id={bookId}
      initialBook={book}
      initialAuthor={author}
    />
  );
}

