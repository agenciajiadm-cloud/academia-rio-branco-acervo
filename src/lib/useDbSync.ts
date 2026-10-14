"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Roda `load` ao montar e sempre que a camada de dados avisa que algo mudou
 * (evento "academia_db_updated", disparado por db.ts após cada gravação).
 */
export function useDbSync(load: () => Promise<void>, deps: unknown[] = []) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadRef = useRef(load);
  useLayoutEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    let active = true;

    async function run() {
      let message = "";
      try {
        await loadRef.current();
      } catch (e) {
        console.error(e);
        message = e instanceof Error ? e.message : "Erro ao carregar os dados.";
      }
      if (!active) return;
      setError(message);
      setLoading(false);
    }

    run();
    window.addEventListener("academia_db_updated", run);
    return () => {
      active = false;
      window.removeEventListener("academia_db_updated", run);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { loading, error };
}
