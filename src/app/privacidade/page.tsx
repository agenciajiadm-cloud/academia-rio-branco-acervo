export default function Privacidade() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:max-w-3xl">
        <h1 className="text-4xl font-serif font-bold mb-8 text-black border-l-4 border-brand pl-4">Política de Privacidade</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Sua privacidade é critically importante para nós da <strong>Academia de Letras</strong>. Nós seguimos práticas 
            rígidas para proteger suas informações pessoais nas entrelinhas de nossos sistemas.
          </p>

          <h2 className="text-2xl font-bold font-serif text-black mt-8">Coleta de Informações</h2>
          <p>
            Solicitamos informações pessoais, como e-mail ou nome, apenas nas instâncias que necessitamos contatar 
            você para prestar os devidos serviços (por exemplo, efetuando o Login no portal de associados).
          </p>

          <h2 className="text-2xl font-bold font-serif text-black mt-8">Transferências e Pagamentos</h2>
          <p>
            Não guardamos localmente dados sensíveis de transações, todos os fluxos de aquisição do acervo literário 
            funcionam de forma cega via SSL nativo.
          </p>

          <h2 className="text-2xl font-bold font-serif text-black mt-8">Contato</h2>
          <p>
            Caso você tenha qualquer dúvida sobre como seus dados são manuseados (tanto você como leitor quanto como Acadêmico), 
            entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
}
