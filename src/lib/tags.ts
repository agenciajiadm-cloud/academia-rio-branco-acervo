// Taxonomia FIXA — nunca deixar usuário criar categorias livres

export const GENEROS = [
  "Poesia", "Romance", "Conto", "Crônica", "Ensaio",
  "Ficção Científica", "Literatura Infantil", "Literatura Juvenil",
  "Biografia", "Autobiografia", "História", "Acadêmico",
  "Religioso", "Autoajuda", "Teatro",
] as const;

export const FAIXAS_ETARIAS = [
  "Infantil (0–8 anos)",
  "Juvenil (9–14 anos)",
  "Young Adult (15–17 anos)",
  "Adulto (18+)",
  "Todas as idades",
] as const;

export const TIPOS_MUSICA = [
  "Música Autoral",
  "Audiolivro",
  "Podcast Literário",
  "Poesia Falada",
  "Declamação",
] as const;

export const PLATAFORMAS_VENDA = [
  { id: "amazon",    label: "Amazon",             cor: "#FF9900" },
  { id: "saraiva",   label: "Saraiva",             cor: "#E31E24" },
  { id: "kobo",      label: "Kobo",                cor: "#CC3300" },
  { id: "cultura",   label: "Livraria Cultura",    cor: "#004A97" },
  { id: "americanas",label: "Americanas",           cor: "#CC0000" },
  { id: "estante",   label: "Estante Virtual",     cor: "#2E7D32" },
  { id: "mercado",   label: "Mercado Livre",        cor: "#FFED00" },
  { id: "direto",    label: "Compra Direta",        cor: "#244186" },
  { id: "outro",     label: "Outro",                cor: "#666666" },
] as const;

export const PLATAFORMAS_AUDIO = [
  { id: "spotify",   label: "Spotify",    cor: "#1DB954" },
  { id: "youtube",   label: "YouTube",    cor: "#FF0000" },
  { id: "deezer",    label: "Deezer",     cor: "#A238FF" },
  { id: "soundcloud",label: "SoundCloud", cor: "#FF5500" },
  { id: "outro",     label: "Outro",      cor: "#666666" },
] as const;

export type Genero = typeof GENEROS[number];
export type FaixaEtaria = typeof FAIXAS_ETARIAS[number];
export type TipoMusica = typeof TIPOS_MUSICA[number];
