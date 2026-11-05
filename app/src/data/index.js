export { STATUS_LABEL, STATUS_BADGE_TONE } from "./animais";
export { TIPOS_POST } from "./posts";
export * from "./opcoes";
export {
  useDados,
  salvarAnimal,
  excluirAnimal,
  alterarStatusAnimal,
  salvarAbrigo,
  salvarPost,
  excluirPost,
  restaurarDadosIniciais,
} from "./store";

/*
 * Seletores puros: recebem o objeto retornado por useDados(), para que
 * os componentes re-renderizem quando o painel da instituição altera algo.
 */

export function getAnimalById(dados, id) {
  return dados.animais.find((a) => a.id === id);
}

export function getAbrigoById(dados, id) {
  return dados.abrigos.find((a) => a.id === id);
}

export function getAnimaisPorAbrigo(dados, abrigoId) {
  return dados.animais.filter((a) => a.abrigoId === abrigoId);
}

/** Posts em ordem cronológica decrescente; filtra por abrigo se informado. */
export function getPosts(dados, abrigoId) {
  return dados.posts
    .filter((p) => !abrigoId || p.abrigoId === abrigoId)
    .slice()
    .sort((a, b) => (a.data < b.data ? 1 : -1));
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** "2026-04-12" → { dia: "12", mes: "Abr", completa: "12 Abr 2026" } */
export function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  const nomeMes = MESES[Number(mes) - 1];
  return { dia, mes: nomeMes, completa: `${dia} ${nomeMes} ${ano}` };
}

export function linkWhatsApp(telefone) {
  return `https://wa.me/55${telefone.replace(/\D/g, "")}`;
}

export function linkTelefone(telefone) {
  return `tel:+55${telefone.replace(/\D/g, "")}`;
}

/** Cadastro sem foto ou com descrição muito curta — sinalizado no painel. */
export function cadastroIncompleto(animal) {
  return !animal.fotos?.length || (animal.descricao ?? "").trim().length < 60;
}
