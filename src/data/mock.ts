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
    photoUrl: "/images/Policarpo Carteira Academia Barão.png",
    instagramHandle: "@policarpo.mr",
  },
  {
    id: "a2",
    name: "Machado de Assis",
    bio: "O mestre do realismo nacional.",
    fullHistory: "Considerado um dos maiores nomes da literatura do Brasil. Fundou a Academia Brasileira de Letras.",
    photoUrl: "https://ui-avatars.com/api/?name=Machado+Assis&background=111&color=fff&size=512",
  },
  {
    id: "a3",
    name: "Graciliano Ramos",
    bio: "Retrata com crueza a realidade do povo nordestino.",
    fullHistory: "Foi um romancista, cronista, inspetor de escolas, tradutor e político brasileiro. Famoso por sua escrita seca e precisa.",
    photoUrl: "https://ui-avatars.com/api/?name=Graciliano+Ramos&background=111&color=fff&size=512",
  },
  {
    id: "a4",
    name: "Machado Souza",
    bio: "Autor de fantasia sombria e suspense visceral.",
    fullHistory: "Contemporâneo do suspense, destaca-se pela sua narrativa imersiva presente no 'Samurai de Carvão'.",
    photoUrl: "/images/foto.jpg",
    instagramHandle: "@msouza.escritor",
  },
  {
    id: "a5",
    name: "Clarice Lispector",
    bio: "Imersões psicológicas e reflexões existencialistas.",
    fullHistory: "A profundidade introspectiva e os fluxos de consciência ditam sua obra poética inigualável no século XX.",
    photoUrl: "https://ui-avatars.com/api/?name=Clarice+Lispector&background=111&color=fff&size=512",
  },
  {
    id: "a6",
    name: "Jorge Amado",
    bio: "Contador das deliciosas vivências e paixões baianas.",
    fullHistory: "As cores e os cheiros do Brasil descritos de forma inesquecível pelo grande cronista baiano.",
    photoUrl: "https://ui-avatars.com/api/?name=Jorge+Amado&background=111&color=fff&size=512",
  },
  {
    id: "a7",
    name: "Tarsila Guimarães",
    bio: "Poetisa e cronista do cotidiano amapaense.",
    fullHistory: "Membro fundadora na representação poética contemporânea, ligada profundamente aos contos dos rios.",
    photoUrl: "https://ui-avatars.com/api/?name=Tarsila+Guimaraes&background=111&color=fff&size=512",
    instagramHandle: "@tatah.poesia",
  },
  {
    id: "a8",
    name: "Carlos Drummond",
    bio: "No meio do caminho existia a poesia sublime.",
    fullHistory: "Maior poeta do modernismo de segunda geração no Brasil. Suas palavras tocaram milhões.",
    photoUrl: "https://ui-avatars.com/api/?name=Carlos+Drummond&background=111&color=fff&size=512",
  },
  {
    id: "a9",
    name: "Ariano Suassuna",
    bio: "O Movimento Armorial vivo no texto teatral.",
    fullHistory: "Professor, dramaturgo e romancista. Imortal da literatura, trouxe o povo brasileiro sob uma luz vibrante.",
    photoUrl: "https://ui-avatars.com/api/?name=Ariano+Suassuna&background=111&color=fff&size=512",
  },
  {
    id: "a10",
    name: "Rachel de Queiroz",
    bio: "Pioneira. O cenário da seca como palco heroico.",
    fullHistory: "Inaugurou os romances regionalistas sendo a primeira mulher a ingressar na Academia Brasileira de Letras.",
    photoUrl: "https://ui-avatars.com/api/?name=Rachel+Queiroz&background=111&color=fff&size=512",
  }
];

export const books: Book[] = [
  {
    id: "b1",
    title: "O Forte",
    subtitle: "A defesa de um império",
    price: 49.90,
    coverUrl: "/images/CAPA FORTE FINAL.png",
    authorId: "a1",
    description: "Uma imersão na cultura e na força dos defensores do nosso território. Obra de maturidade poética e política.",
  },
  {
    id: "b2",
    title: "Samurai de Carvão",
    subtitle: "A honra nas chamas escurecidas",
    price: 69.90,
    coverUrl: "/images/CAPA LIVRO SAMURAI FINAL.png",
    authorId: "a4",
    description: "Um mergulho denso no mundo distópico, onde a honra molda as espadas no limite da realidade moderna.",
  },
  {
    id: "b3",
    title: "Vidas Secas",
    subtitle: "A caminhada eterna do povo nordestino",
    price: 59.90,
    coverUrl: "/images/CAPA LIVRO CAIPIRA FINAL.png",
    authorId: "a3",
    description: "A aridez da terra e da comunicação marcam este clássico indiscutível sobre resistência.",
  },
  {
    id: "b4",
    title: "Dom Casmurro",
    subtitle: "A traição do destino",
    price: 35.00,
    coverUrl: "/images/CAPA PENSAMENTOS NA ESCURIDÃO FINAL.png",
    authorId: "a2",
    description: "A história de Bento Santiago e Capitu nos convida a entender os labirintos do ciúme e da memória.",
  },
  {
    id: "b5",
    title: "A Vila",
    subtitle: "Histórias do extremo Norte",
    price: 39.90,
    coverUrl: "/images/CAPA LIVRO A VILA.png",
    authorId: "a1",
    description: "Os mitos e vivências amazônicas recontados pela vivência intrínseca com os ribeirinhos.",
  },
  {
    id: "b6",
    title: "Passos Perdidos",
    subtitle: "Onde terminam os caminhos",
    price: 45.00,
    coverUrl: "/images/CAPA PASSOS FINAL.png",
    authorId: "a4",
    description: "Uma obra investigativa e literária recheada de ação.",
  },
  {
    id: "b7",
    title: "Crianças em Foco",
    subtitle: "O futuro nas entrelinhas",
    price: 29.90,
    coverUrl: "/images/CAPA TURMINHA FINAL.png",
    authorId: "a1",
    description: "A perspectiva encantadora das crianças e do aprendizado na primeira idade.",
  },
  {
    id: "b8",
    title: "A Hora da Estrela",
    subtitle: "Existência macabeia",
    price: 33.00,
    coverUrl: "/images/CAPA LIVRO A VILA.png",
    authorId: "a5",
    description: "A poética de uma nordestina no Rio de Janeiro revelando os medos solitários do autor.",
  },
  {
    id: "b9",
    title: "Capitães da Areia",
    subtitle: "Os meninos de Salvador",
    price: 49.00,
    coverUrl: "/images/CAPA FORTE FINAL.png",
    authorId: "a6",
    description: "A amizade nas ruas ensolaradas da Bahia nos anos 1930.",
  },
  {
    id: "b10",
    title: "Iracema",
    subtitle: "Lenda viva",
    price: 25.00,
    coverUrl: "/images/CAPA LIVRO CAIPIRA FINAL.png",
    authorId: "a10",
    description: "Os primeiros choques da ancestralidade literária brasileira.",
  }
];
