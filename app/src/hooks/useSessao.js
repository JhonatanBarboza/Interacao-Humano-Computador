import { useSyncExternalStore } from "react";

const SESSAO_KEY = "patas-que-acolhem:sessao";
const listeners = new Set();

function ler() {
  return localStorage.getItem(SESSAO_KEY);
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Login simulado da instituição: guarda apenas o id do abrigo logado.
 * Retorna `abrigoId` (ou null) e as ações de entrar/sair.
 */
export function useSessao() {
  const abrigoId = useSyncExternalStore(subscribe, ler);

  return {
    abrigoId,
    entrar(id) {
      localStorage.setItem(SESSAO_KEY, id);
      listeners.forEach((l) => l());
    },
    sair() {
      localStorage.removeItem(SESSAO_KEY);
      listeners.forEach((l) => l());
    },
  };
}
