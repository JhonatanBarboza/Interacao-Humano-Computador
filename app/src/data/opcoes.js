/** Opções compartilhadas entre filtros da busca e formulário de cadastro. */

export const ESPECIES = ["Cachorro", "Gato"];
export const PORTES = ["Pequeno", "Médio", "Grande"];
export const SEXOS = ["Macho", "Fêmea"];
export const TEMPERAMENTOS = ["Calmo", "Brincalhão", "Dócil", "Independente"];

export const FAIXAS_ETARIAS = [
  { valor: "filhote", label: "Filhote" },
  { valor: "jovem", label: "Jovem" },
  { valor: "adulto", label: "Adulto" },
  { valor: "idoso", label: "Idoso" },
];

export const RAIOS_KM = [5, 20, 100];

/** Localização simulada do adotante — o protótipo não usa geolocalização real. */
export const LOCALIZACAO_USUARIO = "Centro de São Carlos - SP";

/**
 * Deriva a faixa etária a partir da idade em texto livre ("8 meses",
 * "2 anos"), para que o formulário de cadastro peça só um campo.
 * Retorna null se o texto não tiver um número reconhecível.
 */
export function faixaEtaria(idade) {
  const match = /(\d+)\s*(m|a)?/i.exec(idade ?? "");
  if (!match) return null;
  const n = Number(match[1]);
  const meses = match[2]?.toLowerCase() === "m" ? n : n * 12;
  if (meses < 6) return "filhote";
  if (meses < 24) return "jovem";
  if (meses < 96) return "adulto";
  return "idoso";
}
