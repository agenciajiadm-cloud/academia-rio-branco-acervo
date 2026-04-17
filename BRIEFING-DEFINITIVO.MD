# SUPER BRIEFING DE EXECUÇÃO: ACERVO NEXT-GEN (MVP)

Você é um Engenheiro de Front-end Sênior operando sob as diretrizes da Agência JI. Seu objetivo é construir um MVP de um e-commerce literário (Next.js + Tailwind) com estética "Tubik Studio" e arquitetura de navegação "Netflix". 

## 1. SETUP E AMBIENTE (Obrigatório)
- Inicialize o servidor rodando em `http://localhost:5000`.
- O framework é Next.js com App Router.
- O estilo é gerido 100% via Tailwind CSS. 
- Transições devem usar Framer Motion.
- Leia os assets (imagens, logos, capas de livros) de `/public/images/`.

## 2. DESIGN SYSTEM E TIPOGRAFIA
- **Cores Primárias:** Fundo predominante Branco (`#FFFFFF`), Destaques e Botões CTA no Laranja Xiaomi (`#FF6700`), Textos em Preto Absoluto (`#000000`) ou Cinza Escuro (`#1F2937`) para subtítulos.
- **Tipografia:** - Títulos (H1, H2): Use a fonte `Playfair Display` (serifada, imponente, estilo editorial).
  - Corpo de Texto, Header e Botões: Use `Inter` ou `Montserrat` (sans-serif, limpa).
- **Espaçamento (Whitespace):** Respeite o respiro. Elementos não devem ser amontoados. O grid é assimétrico e luxuoso.

## 3. COMPORTAMENTO MOBILE (Bakery Mobility)
- **Gestos:** Todos os carrosséis (trilhos) na versão mobile devem suportar *swipe* (arrastar com o dedo) nativo e suave, sem barras de rolagem visíveis (`scrollbar-hide`).
- **Header Mobile:** O menu colapsa para um ícone de Hambúrguer discreto.
- **Floating Action Button (FAB):** O botão de "Ajuda/Curador IA" fica fixo no canto inferior direito, visível apenas no scroll up ou constante em tamanho reduzido.

## 4. MAPA DA PÁGINA: HOME (A "Netflix dos Livros")

### 4.1 Header (Navegação)
- Fixo no topo (`sticky`), fundo transparente que se torna branco sólido com leve sombra ao iniciar o scroll.
- **Esquerda:** Logo da Academia de Letras Barão do Rio Branco.
- **Centro:** Links limpos com efeito hover sublinhado (Livraria, Autores, Sobre).
- **Direita:** Botão vazado (outline preto) "Login Associado" e ícone de carrinho de compras.

### 4.2 Hero Section (O Destaque Principal)
- Ocupa 80% da altura da tela (`min-h-[80vh]`).
- Fundo com um leve gradiente ou uma imagem de capa borrada gigantesca.
- **Conteúdo:** Imagem nítida de um livro em destaque à direita com efeito 3D sutil (Framer Motion tilt ou floating). À esquerda: Título gigantesco em Serif ("O Lançamento da Década"), subtítulo rápido e um Botão Sólido Laranja (`bg-[#FF6700]`) "Comprar por R$ 49,90".

### 4.3 Trilho 1: "Livraria Virtual" (Lançamentos)
- Estilo Netflix: Título da seção alinhado à esquerda. Logo abaixo, uma linha contínua de capas de livros.
- Cada capa de livro (card) não tem bordas duras. Ao passar o mouse (`hover`), a capa sofre um leve `scale-up` (aumenta 105%) e exibe o preço e o botão "Adicionar" deslizando de baixo para cima.

### 4.4 Trilho 2: "Conheça Nossos Autores"
- Em vez de retângulos, use círculos perfeitos (`rounded-full`) grandes para as fotos dos autores.
- Nome do autor abaixo da foto. 
- Efeito de hover: a foto do autor fica em preto e branco e volta a colorida ao interagir.

### 4.5 Footer (Rodapé)
- Fundo Preto (`#000000`), texto branco. 
- Três colunas limpas: Links Úteis, Redes Sociais, Políticas de Privacidade. 
- No centro inferior: "Desenvolvido com tecnologia Agência JI".

## 5. FLUXO DE LOGIN E PAINEL ADMINISTRATIVO (MOCKADO)

### 5.1 Tela de Login (`/login`)
- Design minimalista. Metade da tela branca com formulário, metade com imagem literária abstrata.
- Campos: E-mail e Senha. Botão Laranja "Acessar Acervo".
- **Comportamento Mockado:** Se o usuário digitar E-mail: `teste@ji.com` e Senha: `123`, redirecione imediatamente para a rota `/painel`. Se não, mostre erro "Credenciais Inválidas".

### 5.2 Painel de Upload (`/painel`)
- Sidebar escura à esquerda. Área principal branca.
- **O Formulário:** Título "Novo Livro". Campos: Título (input text), Autor (dropdown), Preço (input numérico), PDF Final (input file), Capa (input file).
- **A Trava de Upsell (Ouro da JI):** Abaixo do formulário, um Box cinza inativo com Checkboxes bloqueados (`disabled`): "[ ] Amazon", "[ ] Mercado Livre". Um ícone de Cadeado (`🔒`) ao lado. Texto: *"Módulo Omnichannel bloqueado. Contate a Agência JI para liberar a sincronização multicanais."*

## 6. ORDEM EXATA DE EXECUÇÃO (Passo a Passo)

1. **Setup Inicial:** Crie a estrutura Next.js, configure o Tailwind e instale `framer-motion` e `lucide-react` (para ícones).
2. **Mock de Dados:** Crie um arquivo `data/mock.ts` contendo arrays de livros e autores fictícios (use nomes como "A Queda do Barão", etc.) referenciando caminhos de imagens locais.
3. **Componentes Base:** Codifique os componentes `Header`, `Footer`, `BookCard` e `AuthorCard`.
4. **Páginas:** - Codifique `app/page.tsx` montando a Home exatamente como descrito.
   - Codifique `app/login/page.tsx` com a lógica estática de validação.
   - Codifique `app/painel/page.tsx` com o formulário e a trava de upsell.
5. **Revisão Visual:** Verifique se as fontes Serifadas estão aplicadas nos títulos e a paleta de cores Laranja Xiaomi/Branco/Preto está estrita.
6. **Deploy Local:** Inicie o servidor em `localhost:5000` para que a equipe valide.

Comece imediatamente pelo Passo 1 e não pare até gerar o código completo e funcional dessas três rotas. Escreva código de produção, modular e tipado em TypeScript.