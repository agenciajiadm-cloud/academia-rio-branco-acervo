import autoresData from "./autores.json";
import livrosData from "./livros.json";
import musicasData from "./musicas.json";
import categoriasData from "./categorias.json";

export interface Author {
  id: string;
  name: string;
  bio: string;
  fullHistory?: string;
  photoUrl: string;
  instagramHandle?: string;
  cidade?: string;
  cadeira?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  coverUrl: string;
  authorId: string;
  description?: string;
}

export interface Music {
  id: string;
  title: string;
  coverUrl: string;
  authorId: string;
}

export interface Category {
  id: string;
  name: string;
}

// Map the raw JSON representations to our application typing
export const authors: Author[] = autoresData.map((a: any) => ({
  id: a.id,
  name: a.nome, // map 'nome' to 'name' for legacy compatibility
  bio: a.bio,
  fullHistory: a.fullHistory,
  photoUrl: a.foto,
  instagramHandle: a.instagram,
  cidade: a.cidade,
  cadeira: a.cadeira
}));

export const books: Book[] = livrosData.map((b: any) => ({
  id: b.id,
  title: b.title,
  subtitle: b.subtitle,
  price: b.price,
  coverUrl: b.coverUrl,
  authorId: b.autor_id, // ensure relationship matches the json property
  description: b.description
}));

export const musics: Music[] = musicasData.map((m: any) => ({
  id: m.id,
  title: m.title,
  coverUrl: m.coverUrl,
  authorId: m.autor_id
}));

export const categories: Category[] = categoriasData as Category[];
