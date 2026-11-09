import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Save, Star, X } from "lucide-react";
import { PainelShell } from "../../components/PainelShell/PainelShell";
import { PainelCabecalho } from "../../components/PainelShell/PainelCabecalho";
import { Button } from "../../components/Button/Button";
import { Field } from "../../components/Field/Field";
import { controlClass } from "../../components/Field/controlClass";
import { FilterChip } from "../../components/FilterChip/FilterChip";
import {
  ESPECIES,
  FAIXAS_ETARIAS,
  PORTES,
  SEXOS,
  STATUS_LABEL,
  TEMPERAMENTOS,
  faixaEtaria,
  getAnimalById,
  salvarAnimal,
  useDados,
} from "../../data";
import { lerImagemReduzida } from "../../utils/imagem";
import styles from "./PainelCadastro.module.css";

const MAX_FOTOS = 6;
const MAX_MB = 5;
const MAX_DESCRICAO = 1000;

const VAZIO = {
  nome: "",
  especie: "",
  porte: "",
  idade: "",
  sexo: "",
  descricao: "",
  status: "disponivel",
  fotos: [],
  raca: "",
  temperamento: "",
  vacinado: false,
  castrado: false,
  compativelCriancas: false,
  compativelPets: false,
  necessidadesEspeciais: false,
};

function validar(form) {
  const e = {};
  if (!form.nome.trim()) e.nome = "Dê um nome ao animal.";
  if (!form.especie) e.especie = "Escolha a espécie.";
  if (!form.porte) e.porte = "Escolha o porte.";
  if (!form.idade.trim()) e.idade = "Informe a idade aproximada.";
  else if (!faixaEtaria(form.idade)) e.idade = "Use um número, por exemplo: “8 meses” ou “2 anos”.";
  if (!form.sexo) e.sexo = "Escolha o sexo.";
  if (!form.descricao.trim()) e.descricao = "Escreva uma descrição — é ela que aproxima o adotante.";
  return e;
}

/** Primeira frase da descrição, usada como resumo no card da busca. */
function gerarResumo(descricao) {
  const texto = descricao.trim().replace(/\s+/g, " ");
  const frase = texto.match(/^.{20,160}?[.!?](\s|$)/)?.[0] ?? texto.slice(0, 140);
  return frase.trim();
}

function Formulario({ abrigo, animal }) {
  const navigate = useNavigate();
  const inputFotos = useRef(null);
  const inicial = animal ? { ...VAZIO, ...animal } : VAZIO;
  const [form, setForm] = useState(inicial);
  const [erros, setErros] = useState({});
  const [erroFoto, setErroFoto] = useState("");
  const [erroSalvar, setErroSalvar] = useState("");
  const editando = !!animal;
  const alterado = JSON.stringify(form) !== JSON.stringify(inicial);
  const faixa = faixaEtaria(form.idade);

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  async function adicionarFotos(arquivos) {
    setErroFoto("");
    const lista = [...arquivos];
    const vagas = MAX_FOTOS - form.fotos.length;
    if (lista.length > vagas) setErroFoto(`Você pode enviar no máximo ${MAX_FOTOS} fotos por animal.`);
    const novas = [];
    for (const arq of lista.slice(0, vagas)) {
      if (!arq.type.startsWith("image/")) {
        setErroFoto(`“${arq.name}” não é uma imagem.`);
        continue;
      }
      if (arq.size > MAX_MB * 1024 * 1024) {
        setErroFoto(`“${arq.name}” passa de ${MAX_MB} MB.`);
        continue;
      }
      try {
        novas.push(await lerImagemReduzida(arq));
      } catch {
        setErroFoto(`Não foi possível ler “${arq.name}”.`);
      }
    }
    setForm((f) => ({ ...f, fotos: [...f.fotos, ...novas] }));
  }

  function removerFoto(i) {
    setForm((f) => ({ ...f, fotos: f.fotos.filter((_, j) => j !== i) }));
  }

  function tornarPrincipal(i) {
    setForm((f) => ({ ...f, fotos: [f.fotos[i], ...f.fotos.filter((_, j) => j !== i)] }));
  }

  function cancelar() {
    if (alterado && !window.confirm("Descartar as alterações feitas neste cadastro?")) return;
    navigate("/painel/animais");
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validar(form);
    setErros(e);
    if (Object.keys(e).length) {
      document.getElementById(Object.keys(e)[0])?.focus();
      return;
    }
    const salvo = salvarAnimal({
      ...form,
      nome: form.nome.trim(),
      idade: form.idade.trim(),
      resumo: gerarResumo(form.descricao),
      abrigoId: abrigo.id,
    });
    if (!salvo) {
      setErroSalvar("Não foi possível salvar: o armazenamento do navegador está cheio. Tente remover algumas fotos.");
      return;
    }
    navigate("/painel/animais", {
      state: { toast: { mensagem: editando ? `Alterações em ${salvo.nome} salvas.` : `${salvo.nome} foi cadastrado e já aparece na busca!` } },
    });
  }

  const qtdErros = Object.values(erros).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <PainelCabecalho
        titulo={editando ? `Editar ${animal.nome}` : "Cadastrar novo animal"}
        descricao={
          editando ? "Atualize as informações do animal." : "Preencha as informações do animal para que ele possa encontrar um novo lar."
        }
        acao={
          <Button variant="ghost" size="sm" onClick={cancelar}>
            <ArrowLeft size={15} /> Voltar para a lista
          </Button>
        }
      />

      {qtdErros > 0 && (
        <p className={styles.resumoErros} role="alert">
          {qtdErros === 1 ? "Falta 1 campo obrigatório" : `Faltam ${qtdErros} campos obrigatórios`} — veja os destaques abaixo.
        </p>
      )}

      <div className={styles.grid}>
        {/* ---------- Fotos ---------- */}
        <div className={styles.fotosCol}>
          <div className={styles.fotoPrincipal}>
            {form.fotos[0] ? (
              <img src={form.fotos[0]} alt="Foto principal" />
            ) : (
              <button type="button" className={styles.fotoVazia} onClick={() => inputFotos.current?.click()}>
                <ImagePlus size={40} aria-hidden="true" />
                <strong>Adicionar fotos</strong>
                <span>Fotos de boa qualidade atraem mais adotantes</span>
              </button>
            )}
          </div>

          <input
            ref={inputFotos}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              adicionarFotos(e.target.files);
              e.target.value = "";
            }}
          />

          <div
            className={styles.dropzone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              adicionarFotos(e.dataTransfer.files);
            }}
          >
            <Button variant="secondary" size="sm" onClick={() => inputFotos.current?.click()} disabled={form.fotos.length >= MAX_FOTOS}>
              <ImagePlus size={15} /> Enviar fotos
            </Button>
            <span>ou arraste aqui · JPG, PNG ou WebP · até {MAX_MB} MB · máx. {MAX_FOTOS} fotos</span>
          </div>
          {erroFoto && (
            <p className={styles.erroFoto} role="alert">
              {erroFoto}
            </p>
          )}

          {form.fotos.length > 0 && (
            <ul className={styles.thumbs} aria-label="Fotos enviadas">
              {form.fotos.map((foto, i) => (
                <li key={`${i}-${foto.slice(-24)}`} className={i === 0 ? styles.thumbPrincipal : ""}>
                  <img src={foto} alt={`Foto ${i + 1}`} />
                  {i === 0 ? (
                    <span className={styles.thumbTag}>Principal</span>
                  ) : (
                    <button type="button" className={styles.thumbTornar} onClick={() => tornarPrincipal(i)} title="Usar como foto principal">
                      <Star size={12} /> Principal
                    </button>
                  )}
                  <button type="button" className={styles.thumbRemover} onClick={() => removerFoto(i)} aria-label={`Remover foto ${i + 1}`}>
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ---------- Campos essenciais ---------- */}
        <div>
          <Field label="Nome do animal" htmlFor="nome" required error={erros.nome}>
            <input id="nome" className={controlClass} placeholder="Ex.: Thor" value={form.nome} onChange={(e) => set("nome", e.target.value)} />
          </Field>

          <div className={styles.duas}>
            <Field label="Espécie" htmlFor="especie" required error={erros.especie}>
              <select id="especie" className={controlClass} value={form.especie} onChange={(e) => set("especie", e.target.value)}>
                <option value="">Selecione</option>
                {ESPECIES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Porte" htmlFor="porte" required error={erros.porte}>
              <select id="porte" className={controlClass} value={form.porte} onChange={(e) => set("porte", e.target.value)}>
                <option value="">Selecione</option>
                {PORTES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className={styles.duas}>
            <Field
              label="Idade aproximada"
              htmlFor="idade"
              required
              error={erros.idade}
              hint={faixa ? `Aparecerá no filtro como: ${FAIXAS_ETARIAS.find((x) => x.valor === faixa).label}` : "Ex.: 8 meses, 2 anos"}
            >
              <input id="idade" className={controlClass} placeholder="Ex.: 2 anos" value={form.idade} onChange={(e) => set("idade", e.target.value)} />
            </Field>
            <Field label="Sexo" htmlFor="sexo" required error={erros.sexo}>
              <select id="sexo" className={controlClass} value={form.sexo} onChange={(e) => set("sexo", e.target.value)}>
                <option value="">Selecione</option>
                {SEXOS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Descrição / Sobre o animal"
            htmlFor="descricao"
            required
            error={erros.descricao}
            hint={`${form.descricao.length}/${MAX_DESCRICAO} caracteres · Dica: escreva como se o animal se apresentasse (“Oi, eu sou...”).`}
          >
            <textarea
              id="descricao"
              className={controlClass}
              maxLength={MAX_DESCRICAO}
              placeholder="Conte a história, a personalidade e os cuidados de que ele precisa."
              value={form.descricao}
              onChange={(e) => set("descricao", e.target.value)}
            />
          </Field>

          <fieldset className={styles.statusGrupo}>
            <legend>
              Status <span aria-hidden="true">*</span>
            </legend>
            <div className={styles.statusOpcoes}>
              {Object.entries(STATUS_LABEL).map(([valor, label]) => (
                <label key={valor} className={[styles.statusOpcao, styles[`st-${valor}`], form.status === valor ? styles.statusMarcado : ""].join(" ")}>
                  <input type="radio" name="status" value={valor} checked={form.status === valor} onChange={() => set("status", valor)} />
                  <span className={styles.statusDot} aria-hidden="true" />
                  {label}
                </label>
              ))}
            </div>
            <span className={styles.dica}>Você pode mudar o status a qualquer momento direto na lista de animais.</span>
          </fieldset>
        </div>
      </div>

      {/* ---------- Opcionais ---------- */}
      <details className={styles.opcionais} open={editando || undefined}>
        <summary>Mais informações (opcional) — saúde, temperamento e compatibilidade</summary>
        <div className={styles.opcionaisCorpo}>
          <div className={styles.duas}>
            <Field label="Raça" htmlFor="raca" hint="Deixe em branco se for SRD / vira-lata.">
              <input id="raca" className={controlClass} placeholder="Ex.: Vira-lata" value={form.raca} onChange={(e) => set("raca", e.target.value)} />
            </Field>
            <Field label="Temperamento">
              <div className={styles.chips}>
                {TEMPERAMENTOS.map((t) => (
                  <FilterChip key={t} selected={form.temperamento === t} onClick={() => set("temperamento", form.temperamento === t ? "" : t)}>
                    {t}
                  </FilterChip>
                ))}
              </div>
            </Field>
          </div>
          <div className={styles.checks}>
            <fieldset>
              <legend>Saúde</legend>
              <label>
                <input type="checkbox" checked={form.vacinado} onChange={(e) => set("vacinado", e.target.checked)} /> Vacinado
              </label>
              <label>
                <input type="checkbox" checked={form.castrado} onChange={(e) => set("castrado", e.target.checked)} /> Castrado
              </label>
              <label>
                <input type="checkbox" checked={form.necessidadesEspeciais} onChange={(e) => set("necessidadesEspeciais", e.target.checked)} />{" "}
                Tem necessidades especiais
              </label>
            </fieldset>
            <fieldset>
              <legend>Compatibilidade</legend>
              <label>
                <input type="checkbox" checked={form.compativelCriancas} onChange={(e) => set("compativelCriancas", e.target.checked)} /> Convive bem
                com crianças
              </label>
              <label>
                <input type="checkbox" checked={form.compativelPets} onChange={(e) => set("compativelPets", e.target.checked)} /> Convive bem com
                outros pets
              </label>
            </fieldset>
          </div>
        </div>
      </details>

      {erroSalvar && (
        <p className={styles.resumoErros} role="alert">
          {erroSalvar}
        </p>
      )}

      <div className={styles.rodape}>
        <Button variant="secondary" onClick={cancelar}>
          Cancelar
        </Button>
        <Button type="submit">
          <Save size={16} /> {editando ? "Salvar alterações" : "Salvar animal"}
        </Button>
      </div>
    </form>
  );
}

export function PainelCadastro() {
  const { id } = useParams();
  const dados = useDados();

  return (
    <PainelShell>
      {(abrigo) => {
        if (!id) return <Formulario abrigo={abrigo} />;
        const animal = getAnimalById(dados, id);
        // só a instituição dona pode editar o cadastro
        if (!animal || animal.abrigoId !== abrigo.id) return <AnimalNaoEncontrado />;
        return <Formulario key={animal.id} abrigo={abrigo} animal={animal} />;
      }}
    </PainelShell>
  );
}

function AnimalNaoEncontrado() {
  return (
    <div style={{ textAlign: "center", padding: "var(--space-10) 0" }}>
      <h3>Animal não encontrado</h3>
      <p>Este cadastro não existe ou pertence a outra instituição.</p>
      <Button to="/painel/animais">Voltar para Meus animais</Button>
    </div>
  );
}
