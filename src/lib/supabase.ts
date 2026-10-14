import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createDemoClient } from "./demo-db";

let client: SupabaseClient | null = null;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Sem .env.local em `npm run dev`: usa dados de exemplo no navegador (src/lib/demo-db.ts). */
export function isDemo(): boolean {
  return process.env.NODE_ENV === "development" && (!url || !key);
}

/**
 * Cliente Supabase do navegador. Criado só na primeira chamada: o site é
 * exportado estático e as páginas são pré-renderizadas no build sem dados.
 */
export function supabase(): SupabaseClient {
  if (client) return client;
  if (isDemo()) {
    client = createDemoClient();
    return client;
  }
  if (!url || !key) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local."
    );
  }
  client = createClient(url, key);
  return client;
}
