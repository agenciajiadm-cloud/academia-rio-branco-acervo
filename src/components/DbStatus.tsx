import { AlertCircle, Loader2 } from "lucide-react";

/** Faixa de carregamento/erro do painel, acima do conteúdo da página. */
export default function DbStatus({ loading, error }: { loading: boolean; error: string }) {
  if (error) {
    return (
      <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-bold">Não foi possível falar com o banco de dados.</p>
          <p className="mt-1 text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div role="status" className="flex items-center gap-2 text-sm font-medium text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin text-brand" /> Carregando dados…
      </div>
    );
  }
  return null;
}
