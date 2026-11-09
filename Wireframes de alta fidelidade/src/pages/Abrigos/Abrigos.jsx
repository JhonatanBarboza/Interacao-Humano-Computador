import { useState } from "react";
import { ArrowRight, Building2, LogIn, MapPin, PawPrint } from "lucide-react";
import { PageShell } from "../../components/PageShell/PageShell";
import { Panel } from "../../components/Panel/Panel";
import { Button } from "../../components/Button/Button";
import { Chip } from "../../components/Chip/Chip";
import { FilterChip } from "../../components/FilterChip/FilterChip";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { MapaAbrigos } from "../../components/MapaAbrigos/MapaAbrigos";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { controlClass } from "../../components/Field/controlClass";
import { useSessao } from "../../hooks/useSessao";
import { LOCALIZACAO_USUARIO, RAIOS_KM, getAnimaisPorAbrigo, useDados } from "../../data";
import styles from "./Abrigos.module.css";

export function Abrigos() {
  const dados = useDados();
  const { abrigoId } = useSessao();
  const [cidade, setCidade] = useState("");
  const [raio, setRaio] = useState(0);
  const [ativoId, setAtivoId] = useState(null);

  const cidades = [...new Set(dados.abrigos.map((a) => a.cidade))];
  const abrigos = dados.abrigos
    .filter((a) => (!cidade || a.cidade === cidade) && (!raio || a.distanciaKm <= raio))
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

  return (
    <PageShell>
      <main className="container">
        <Panel className={styles.topo}>
          <div className={styles.cabecalho}>
            <SectionTitle
              as="h2"
              icon={Building2}
              title="Abrigos participantes"
              subtitle="Encontre ONGs e abrigos perto de você, conheça o trabalho deles e descubra como ajudar."
            />
            <div className={styles.acessoInstituicao}>
              <Button to={abrigoId ? "/painel" : "/login"}>
                <LogIn size={16} aria-hidden="true" /> {abrigoId ? "Ir para o meu painel" : "Entrar na minha instituição"}
              </Button>
            </div>
          </div>
          <div className={styles.filtros}>
            <select className={controlClass} aria-label="Filtrar por cidade" value={cidade} onChange={(e) => setCidade(e.target.value)}>
              <option value="">Todas as cidades</option>
              {cidades.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className={styles.raios} role="group" aria-label="Raio de distância">
              <FilterChip selected={!raio} onClick={() => setRaio(0)}>
                Qualquer distância
              </FilterChip>
              {RAIOS_KM.map((km) => (
                <FilterChip key={km} selected={raio === km} onClick={() => setRaio(km)}>
                  Até {km} km
                </FilterChip>
              ))}
            </div>
          </div>
          <p className={styles.dica}>Distâncias a partir de: {LOCALIZACAO_USUARIO} (simulada)</p>
        </Panel>

        <div className={styles.layout}>
          <Panel className={styles.mapaPanel}>
            <MapaAbrigos abrigos={abrigos} ativoId={ativoId} onSelecionar={setAtivoId} />
          </Panel>

          <ul className={styles.lista}>
            {abrigos.length === 0 && (
              <EmptyState
                title="Nenhum abrigo nessa região"
                description="Tente ampliar o raio de distância ou escolher outra cidade."
                action={
                  <Button
                    onClick={() => {
                      setCidade("");
                      setRaio(0);
                    }}
                  >
                    Ver todos os abrigos
                  </Button>
                }
              />
            )}
            {abrigos.map((abrigo) => {
              const disponiveis = getAnimaisPorAbrigo(dados, abrigo.id).filter((a) => a.status !== "adotado").length;
              return (
                <li
                  key={abrigo.id}
                  className={[styles.item, abrigo.id === ativoId ? styles.itemAtivo : ""].join(" ")}
                  onMouseEnter={() => setAtivoId(abrigo.id)}
                >
                  <h3 className={styles.itemNome}>{abrigo.nome}</h3>
                  <p className={styles.itemLocal}>
                    <MapPin size={14} aria-hidden="true" /> {abrigo.cidade} · a {abrigo.distanciaKm} km
                  </p>
                  <p className={styles.itemSlogan}>{abrigo.slogan}</p>
                  <div className={styles.itemRodape}>
                    <Chip>
                      <PawPrint size={12} /> {disponiveis} {disponiveis === 1 ? "animal disponível" : "animais disponíveis"}
                    </Chip>
                    <Button to={`/abrigo/${abrigo.id}`} variant="secondary" size="sm">
                      Ver página <ArrowRight size={14} />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </PageShell>
  );
}
