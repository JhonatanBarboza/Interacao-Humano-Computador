import { useSyncExternalStore } from "react";
import { ABRIGOS } from "./abrigos";
import { ANIMAIS } from "./animais";
import { POSTS } from "./posts";

/**
 * Store simulado do protótipo: parte dos dados "hard coded" e persiste as
 * alterações feitas no painel da instituição em localStorage, para que
 * cadastros, edições e trocas de status apareçam imediatamente nas
 * páginas públicas (não há backend).
 */
const DADOS_KEY = "patas-que-acolhem:dados-v1";

function dadosIniciais() {
  return { animais: ANIMAIS, abrigos: ABRIGOS, posts: POSTS };
}

function carregar() {
  try {
    const raw = localStorage.getItem(DADOS_KEY);
    return raw ? { ...dadosIniciais(), ...JSON.parse(raw) } : dadosIniciais();
  } catch {
    return dadosIniciais();
  }
}

let estado = carregar();
const listeners = new Set();

function notificar() {
  listeners.forEach((l) => l());
}

/** Retorna false se o navegador recusar salvar (ex.: fotos excedendo a cota). */
function commit(proximo) {
  try {
    localStorage.setItem(DADOS_KEY, JSON.stringify(proximo));
  } catch {
    return false;
  }
  estado = proximo;
  notificar();
  return true;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// mantém abas diferentes sincronizadas (ex.: painel numa aba, busca na outra)
window.addEventListener("storage", (e) => {
  if (e.key !== DADOS_KEY) return;
  estado = carregar();
  notificar();
});

export function useDados() {
  return useSyncExternalStore(subscribe, () => estado);
}

function slug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function idUnico(base, existentes) {
  const raiz = slug(base) || "item";
  let id = raiz;
  for (let i = 2; existentes.some((e) => e.id === id); i++) id = `${raiz}-${i}`;
  return id;
}

function upsert(lista, item) {
  if (item.id && lista.some((x) => x.id === item.id)) {
    return { lista: lista.map((x) => (x.id === item.id ? item : x)), item };
  }
  // um id já informado (ex.: ao desfazer uma exclusão) é preservado
  const novo = item.id ? item : { ...item, id: idUnico(item.nome ?? item.titulo, lista) };
  return { lista: [novo, ...lista], item: novo };
}

/** Cria ou atualiza um animal. Retorna o registro salvo, ou null se falhar. */
export function salvarAnimal(animal) {
  const { lista, item } = upsert(estado.animais, animal);
  return commit({ ...estado, animais: lista }) ? item : null;
}

export function excluirAnimal(id) {
  return commit({ ...estado, animais: estado.animais.filter((a) => a.id !== id) });
}

export function alterarStatusAnimal(id, status) {
  return commit({ ...estado, animais: estado.animais.map((a) => (a.id === id ? { ...a, status } : a)) });
}

export function salvarAbrigo(abrigo) {
  return commit({ ...estado, abrigos: estado.abrigos.map((a) => (a.id === abrigo.id ? abrigo : a)) });
}

export function salvarPost(post) {
  const { lista, item } = upsert(estado.posts, post);
  return commit({ ...estado, posts: lista }) ? item : null;
}

export function excluirPost(id) {
  return commit({ ...estado, posts: estado.posts.filter((p) => p.id !== id) });
}

/** Volta aos dados de demonstração originais (útil entre sessões de teste com usuários). */
export function restaurarDadosIniciais() {
  localStorage.removeItem(DADOS_KEY);
  estado = dadosIniciais();
  notificar();
}
