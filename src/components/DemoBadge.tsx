import { isDemo } from "@/lib/supabase";

/** Aviso fixo quando o site roda sem Supabase, com dados de exemplo do navegador. */
export default function DemoBadge() {
  if (!isDemo()) return null;
  return (
    <div className="pointer-events-none fixed bottom-3 right-3 max-w-[calc(100vw-5rem)] z-[100] rounded-full border border-accent/40 bg-brand px-3 py-1.5 text-xs font-bold text-white shadow-lg">
      Modo demonstração<span className="hidden sm:inline"> · dados de exemplo, salvos só neste navegador</span>
    </div>
  );
}
