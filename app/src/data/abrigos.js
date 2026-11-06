/**
 * `distanciaKm` é a distância simulada entre o abrigo e a localização do
 * adotante (fixada no centro de São Carlos — ver LOCALIZACAO_USUARIO em
 * opcoes.js), usada pelo filtro de raio da busca.
 */
export const ABRIGOS = [
  {
    id: "esperanca",
    nome: "Abrigo Esperança",
    cidade: "São Carlos - SP",
    slogan: "Cuidando hoje, por um futuro melhor.",
    telefone: "(16) 99876-5432",
    email: "contato@abrigoesperanca.org.br",
    endereco: "Rua das Acácias, 210 — Jardim Esperança",
    instagram: "abrigoesperanca",
    linkDoacao: "https://exemplo.org/doar/abrigo-esperanca",
    itensDoacao: "Ração, cobertores, areia sanitária e medicamentos.",
    voluntariado: "Passeios aos sábados, banho e socialização dos animais.",
    requisitos: "Ser maior de 18 anos\nApresentar documento com foto e comprovante de residência\nAceitar visita de acompanhamento após a adoção",
    sobre:
      "O Abrigo Esperança é uma organização sem fins lucrativos dedicada ao resgate, cuidado e adoção de animais em situação de abandono em São Carlos e região. Acreditamos que todo animal merece uma segunda chance, um lar seguro e muito amor. Trabalhamos com uma equipe de voluntários apaixonados por causa animal, promovendo o bem-estar, a saúde e a dignidade de cada animal que passa por aqui.",
    impacto: { resgatados: 247, adocoes: 186, voluntarios: 32 },
    distanciaKm: 3,
    mapaPos: { top: "32%", left: "58%" },
  },
  {
    id: "larbichanos",
    nome: "Lar dos Bichanos",
    cidade: "São Carlos - SP",
    slogan: "Um lar temporário até o lar definitivo.",
    telefone: "(16) 99123-4567",
    email: "contato@lardosbichanos.org.br",
    endereco: "Av. dos Ipês, 780 — Vila Nery",
    instagram: "lardosbichanos",
    linkDoacao: "https://exemplo.org/doar/lar-dos-bichanos",
    itensDoacao: "Ração para gatos, sachês e areia sanitária.",
    voluntariado: "Lar temporário para filhotes e ajuda em feiras de adoção.",
    requisitos: "Ser maior de 18 anos\nJanelas teladas (para gatos)\nAssinar termo de adoção responsável",
    sobre:
      "O Lar dos Bichanos nasceu do sonho de uma protetora independente que hoje reúne uma pequena rede de voluntários. Focamos principalmente em gatos resgatados das ruas, oferecendo cuidados veterinários, castração e socialização antes da adoção.",
    impacto: { resgatados: 132, adocoes: 98, voluntarios: 14 },
    distanciaKm: 7,
    mapaPos: { top: "55%", left: "35%" },
  },
  {
    id: "patasunidas",
    nome: "Patas Unidas",
    cidade: "Ribeirão Preto - SP",
    slogan: "Juntos por mais lares e menos abandono.",
    telefone: "(16) 99654-3210",
    email: "contato@patasunidas.org.br",
    endereco: "Rua Barão do Amazonas, 45 — Centro",
    instagram: "patasunidasrp",
    linkDoacao: "https://exemplo.org/doar/patas-unidas",
    itensDoacao: "Ração para cães de grande porte, coleiras e guias.",
    voluntariado: "Transporte para o veterinário e mutirões de castração.",
    requisitos: "Ser maior de 21 anos\nCasa com quintal murado (cães de médio/grande porte)\nAssinar termo de adoção responsável",
    sobre:
      "A Patas Unidas atua há 8 anos no resgate de cães em situação de rua e maus-tratos na região de Ribeirão Preto. Além da adoção, promovemos campanhas de castração popular e educação sobre posse responsável.",
    impacto: { resgatados: 310, adocoes: 245, voluntarios: 41 },
    distanciaKm: 92,
    mapaPos: { top: "70%", left: "72%" },
  },
];
