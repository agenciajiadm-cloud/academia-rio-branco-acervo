export interface Author {
  id: string;
  name: string;
  bio: string;
  fullHistory?: string;
  photoUrl: string;
  instagramHandle?: string;
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

export const authors: Author[] = [
  {
    id: "a1",
    name: "José Policarpo M. Junior",
    bio: "Pintor, fotógrafo, pesquisador e autor inspirador.",
    fullHistory: "Nascido em 27/12/1969 em Belém do Pará é escritor, pintor, fotógrafo e pesquisador. Engenheiro Florestal, Doutor em Biotecnologia e Biodiversidade pela UNIFAP. Membro da Academia Maçônica Amapaense de Letras, Presidente da Academia de Letras Barão do Rio Branco. Além de docente, lidera projetos sociais através do esporte.",
    photoUrl: "/images/policarpo.png",
    instagramHandle: "@policarpo.mr",
  }
];

export const books: Book[] = [
  {
    id: "b1",
    title: "O Forte",
    subtitle: "A defesa de um império",
    price: 49.90,
    coverUrl: "/images/capa-forte.png",
    authorId: "a1",
    description: "Uma imersão na cultura e na força dos defensores do nosso território. Obra de maturidade poética e política.",
  },
  {
    id: "b2",
    title: "Samurai de Carvão",
    subtitle: "A honra nas chamas escurecidas",
    price: 69.90,
    coverUrl: "/images/capa-samurai.png",
    authorId: "a1",
    description: "Um mergulho denso no mundo distópico, onde a honra molda as espadas no limite da realidade moderna.",
  },
  {
    id: "b3",
    title: "Caipira",
    subtitle: "A caminhada eterna do povo interiorano",
    price: 59.90,
    coverUrl: "/images/capa-caipira.png",
    authorId: "a1",
    description: "A aridez da terra e a magia caipira marcam este indiscutível sobre resistência cultural.",
  },
  {
    id: "b4",
    title: "Pensamentos na Escuridão",
    subtitle: "A traição do destino",
    price: 35.00,
    coverUrl: "/images/capa-pensamentos.png",
    authorId: "a1",
    description: "Um convite poético a entender os labirintos do ciúme, da dúvida e da memória abstrata.",
  },
  {
    id: "b5",
    title: "A Vila",
    subtitle: "Histórias do extremo Norte",
    price: 39.90,
    coverUrl: "/images/capa-vila.png",
    authorId: "a1",
    description: "Os mitos e vivências amazônicas recontados pela vivência intrínseca com os ribeirinhos.",
  },
  {
    id: "b6",
    title: "Passos Perdidos",
    subtitle: "Onde terminam os caminhos",
    price: 45.00,
    coverUrl: "/images/capa-passos.png",
    authorId: "a1",
    description: "Uma obra investigativa e literária recheada de ação.",
  },
  {
    id: "b7",
    title: "Turminha",
    subtitle: "O futuro nas entrelinhas (Crianças)",
    price: 29.90,
    coverUrl: "/images/capa-turminha.png",
    authorId: "a1",
    description: "A perspectiva encantadora das crianças e do aprendizado na primeira idade.",
  }
];
