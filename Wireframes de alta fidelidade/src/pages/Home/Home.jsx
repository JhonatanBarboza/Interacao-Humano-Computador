import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Baby,
  Calendar,
  ChevronDown,
  Heart,
  MapPin,
  Newspaper,
  PawPrint,
  RotateCcw,
  Ruler,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { PageShell } from "../../components/PageShell/PageShell";
import { Panel } from "../../components/Panel/Panel";
import { AnimalGrid } from "../../components/AnimalGrid/AnimalGrid";
import { FilterChip } from "../../components/FilterChip/FilterChip";
import { Button } from "../../components/Button/Button";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { PostList } from "../../components/PostList/PostList";
import { controlClass } from "../../components/Field/controlClass";
import {
  FAIXAS_ETARIAS,
  LOCALIZACAO_USUARIO,
  PORTES,
  RAIOS_KM,
  SEXOS,
  TEMPERAMENTOS,
  faixaEtaria,
  getAbrigoById,
  getPosts,
  useDados,
} from "../../data";
import styles from "./Home.module.css";

const FILTROS_AVANCADOS = ["sexo", "criancas", "pets", "especiais"];

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function passaFiltros(animal, abrigo, f) {
  if (animal.status === "adotado") return false;
  if (f.especie && animal.especie !== f.especie) return false;
  if (f.porte && animal.porte !== f.porte) return false;
  if (f.idade && faixaEtaria(animal.idade) !== f.idade) return false;
  if (f.temperamento && animal.temperamento !== f.temperamento) return false;
  if (f.sexo && animal.sexo !== f.sexo) return false;
  if (f.criancas && !animal.compativelCriancas) return false;
  if (f.pets && !animal.compativelPets) return false;
  if (f.especiais && String(animal.necessidadesEspeciais) !== (f.especiais === "sim" ? "true" : "false")) return false;
  if (f.abrigo && animal.abrigoId !== f.abrigo) return false;
  if (f.cidade && abrigo?.cidade !== f.cidade) return false;
  if (f.raio && abrigo && abrigo.distanciaKm > Number(f.raio)) return false;
  if (f.q) {
    const alvo = normalizar(`${animal.nome} ${animal.raca}`);
    if (!alvo.includes(normalizar(f.q.trim()))) return false;
  }
  return true;
}

/** Grupo de chips de seleção única, com a opção "Todos" limpando o filtro. */
function GrupoFiltro({ icon: Icon, label, opcoes, valor, onChange, todosLabel = "Todos" }) {
  return (
    <fieldset className={styles.grupo}>
      <legend className={styles.grupoLabel}>
        <Icon size={16} aria-hidden="true" /> {label}
      </legend>
      <div className={styles.opcoes}>
        <FilterChip selected={!valor} onClick={() => onChange("")}>
          {todosLabel}
        </FilterChip>
        {opcoes.map((op) => (
          <FilterChip key={op.valor} selected={valor === op.valor} onClick={() => onChange(op.valor)}>
            {op.label}
          </FilterChip>
        ))}
      </div>
    </fieldset>
  );
}

const asOpcoes = (lista) => lista.map((v) => ({ valor: v, label: v }));

export function Home() {
  const dados = useDados();
  const [params, setParams] = useSearchParams();
  const f = Object.fromEntries(params);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [avancadosAbertos, setAvancadosAbertos] = useState(() => FILTROS_AVANCADOS.some((k) => f[k]));

  function setFiltro(chave, valor) {
    setParams(
      (atual) => {
        const prox = new URLSearchParams(atual);
        if (valor) prox.set(chave, valor);
        else prox.delete(chave);
        return prox;
      },
      { replace: true },
    );
  }

  function limparFiltros() {
    setParams({}, { replace: true });
  }

  const resultado = dados.animais.filter((a) => passaFiltros(a, getAbrigoById(dados, a.abrigoId), f));
  const cidades = [...new Set(dados.abrigos.map((a) => a.cidade))];
  const abrigoFiltrado = f.abrigo ? getAbrigoById(dados, f.abrigo) : null;
  const temFiltro = params.size > 0;
  const contagem = resultado.length === 1 ? "1 animal encontrado" : `${resultado.length} animais encontrados`;

  return (
    <PageShell>
      <main className="container">
        <div className={styles.layout}>
          <aside className={[styles.filtros, filtrosAbertos ? styles.filtrosAbertos : ""].join(" ")} aria-label="Filtros">
            <button
              type="button"
              className={styles.filtrosToggle}
              aria-expanded={filtrosAbertos}
              onClick={() => setFiltrosAbertos((v) => !v)}
            >
              <SlidersHorizontal size={18} aria-hidden="true" />
              <span>Filtrar animais</span>
              <ChevronDown size={18} className={styles.chevron} aria-hidden="true" />
            </button>
            <h2 className={styles.filtrosTitulo}>
              <SlidersHorizontal size={18} aria-hidden="true" /> Filtrar animais
            </h2>

            <div className={styles.filtrosCorpo}>
              <GrupoFiltro
                icon={PawPrint}
                label="Espécie"
                opcoes={[
                  { valor: "Cachorro", label: "Cães" },
                  { valor: "Gato", label: "Gatos" },
                ]}
                valor={f.especie}
                onChange={(v) => setFiltro("especie", v)}
              />
              <GrupoFiltro icon={Ruler} label="Porte" opcoes={asOpcoes(PORTES)} valor={f.porte} onChange={(v) => setFiltro("porte", v)} />
              <GrupoFiltro
                icon={Calendar}
                label="Idade"
                todosLabel="Todas"
                opcoes={FAIXAS_ETARIAS.map((x) => ({ valor: x.valor, label: x.label }))}
                valor={f.idade}
                onChange={(v) => setFiltro("idade", v)}
              />
              <GrupoFiltro
                icon={Heart}
                label="Temperamento"
                opcoes={asOpcoes(TEMPERAMENTOS)}
                valor={f.temperamento}
                onChange={(v) => setFiltro("temperamento", v)}
              />

              <fieldset className={styles.grupo}>
                <legend className={styles.grupoLabel}>
                  <MapPin size={16} aria-hidden="true" /> Localização
                </legend>
                <select
                  className={controlClass}
                  aria-label="Cidade"
                  value={f.cidade ?? ""}
                  onChange={(e) => setFiltro("cidade", e.target.value)}
                >
                  <option value="">Todas as cidades</option>
                  {cidades.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className={styles.opcoes} style={{ marginTop: "var(--space-3)" }}>
                  <FilterChip selected={!f.raio} onClick={() => setFiltro("raio", "")}>
                    Qualquer distância
                  </FilterChip>
                  {RAIOS_KM.map((km) => (
                    <FilterChip key={km} selected={f.raio === String(km)} onClick={() => setFiltro("raio", String(km))}>
                      Até {km} km
                    </FilterChip>
                  ))}
                </div>
                <p className={styles.dica}>Distância a partir de: {LOCALIZACAO_USUARIO} (simulada)</p>
              </fieldset>

              <button
                type="button"
                className={styles.maisFiltros}
                aria-expanded={avancadosAbertos}
                onClick={() => setAvancadosAbertos((v) => !v)}
              >
                {avancadosAbertos ? "Menos filtros" : "Mais filtros"}
                <ChevronDown size={16} className={avancadosAbertos ? styles.chevronAberto : ""} aria-hidden="true" />
              </button>

              {avancadosAbertos && (
                <>
                  <GrupoFiltro icon={PawPrint} label="Sexo" opcoes={asOpcoes(SEXOS)} valor={f.sexo} onChange={(v) => setFiltro("sexo", v)} />
                  <fieldset className={styles.grupo}>
                    <legend className={styles.grupoLabel}>
                      <Baby size={16} aria-hidden="true" /> Compatibilidade
                    </legend>
                    <div className={styles.opcoes}>
                      <FilterChip selected={!!f.criancas} onClick={() => setFiltro("criancas", f.criancas ? "" : "1")}>
                        Convive com crianças
                      </FilterChip>
                      <FilterChip selected={!!f.pets} onClick={() => setFiltro("pets", f.pets ? "" : "1")}>
                        Convive com outros pets
                      </FilterChip>
                    </div>
                  </fieldset>
                  <GrupoFiltro
                    icon={Heart}
                    label="Necessidades especiais"
                    todosLabel="Indiferente"
                    opcoes={[
                      { valor: "sim", label: "Sim" },
                      { valor: "nao", label: "Não" },
                    ]}
                    valor={f.especiais}
                    onChange={(v) => setFiltro("especiais", v)}
                  />
                </>
              )}

              <div className={styles.filtrosAcoes}>
                <Button variant="primary" block className={styles.verResultados} onClick={() => setFiltrosAbertos(false)}>
                  Ver {contagem}
                </Button>
                <Button variant="ghost" block onClick={limparFiltros} disabled={!temFiltro}>
                  <RotateCcw size={15} /> Limpar filtros
                </Button>
              </div>
            </div>
          </aside>

          <section aria-label="Resultados">
            <div className={styles.busca}>
              <Search size={18} className={styles.buscaIcon} aria-hidden="true" />
              <input
                type="search"
                className={[controlClass, styles.buscaInput].join(" ")}
                placeholder="Buscar por nome ou raça (ex.: Thor, vira-lata...)"
                aria-label="Buscar por nome ou raça"
                value={f.q ?? ""}
                onChange={(e) => setFiltro("q", e.target.value)}
              />
            </div>

            <div className={styles.resultadoHeader}>
              <strong aria-live="polite">{contagem}</strong>
              {abrigoFiltrado && (
                <button type="button" className={styles.tagFiltro} onClick={() => setFiltro("abrigo", "")}>
                  {abrigoFiltrado.nome} <X size={14} aria-label="Remover filtro de abrigo" />
                </button>
              )}
              {temFiltro && (
                <button type="button" className={styles.limparLink} onClick={limparFiltros}>
                  <RotateCcw size={14} /> Limpar filtros
                </button>
              )}
            </div>

            <AnimalGrid
              animais={resultado}
              colunas={2}
              emptyTitle="Nenhum animal encontrado com esses filtros"
              emptyDescription={
                f.raio ? "Tente ampliar a distância ou remover alguns filtros." : "Tente remover alguns filtros ou buscar por outro nome."
              }
              emptyAction={
                <div className={styles.vazioAcoes}>
                  {f.raio && (
                    <Button variant="secondary" onClick={() => setFiltro("raio", "")}>
                      Buscar em qualquer distância
                    </Button>
                  )}
                  <Button onClick={limparFiltros}>
                    <RotateCcw size={15} /> Limpar filtros
                  </Button>
                </div>
              }
            />
          </section>
        </div>

        <Panel className={styles.feed}>
          <SectionTitle
            icon={Newspaper}
            title="Últimos resgates e eventos"
            subtitle="Novidades de todos os abrigos parceiros"
          />
          <PostList posts={getPosts(dados).slice(0, 4)} mostrarAbrigo />
        </Panel>
      </main>
    </PageShell>
  );
}
