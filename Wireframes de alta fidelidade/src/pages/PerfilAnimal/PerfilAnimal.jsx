import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  Building2,
  Calendar,
  Check,
  ClipboardList,
  FileText,
  Flag,
  Heart,
  HeartPulse,
  Home,
  Mail,
  Mars,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  Scissors,
  Smile,
  Stethoscope,
  Syringe,
  Venus,
  X,
} from "lucide-react";
import { getAbrigoById, getAnimalById, linkTelefone, linkWhatsApp, useDados } from "../../data";
import { useFavorites } from "../../hooks/useFavorites";
import { PageShell } from "../../components/PageShell/PageShell";
import { Panel } from "../../components/Panel/Panel";
import { Button } from "../../components/Button/Button";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { MapaAbrigos } from "../../components/MapaAbrigos/MapaAbrigos";
import { PaginaNaoEncontrada } from "../PaginaNaoEncontrada/PaginaNaoEncontrada";
import styles from "./PerfilAnimal.module.css";

export function PerfilAnimal() {
  const { id } = useParams();
  const dados = useDados();
  const animal = getAnimalById(dados, id);
  const { isFavorito, toggleFavorito } = useFavorites();
  const [fotoAtual, setFotoAtual] = useState(0);

  if (!animal) return <PaginaNaoEncontrada />;

  const abrigo = getAbrigoById(dados, animal.abrigoId);
  const fotos = animal.fotos ?? [];
  const indiceFoto = Math.min(fotoAtual, Math.max(fotos.length - 1, 0));
  const fav = isFavorito(animal.id);
  const temVariasFotos = fotos.length > 1;
  const adotado = animal.status === "adotado";
  const SexoIcon = animal.sexo === "Macho" ? Mars : Venus;
  const requisitos = (abrigo.requisitos ?? "").split("\n").filter((r) => r.trim());

  const dadosObjetivos = [
    { label: "Espécie", value: animal.especie, icon: PawPrint, tone: "terracota" },
    { label: "Porte", value: animal.porte, icon: Flag, tone: "rosa" },
    { label: "Idade", value: animal.idade, icon: Calendar, tone: "laranja" },
    { label: "Sexo", value: animal.sexo, icon: SexoIcon, tone: "azul" },
  ];

  const saude = [
    { label: "Vacinado", ok: animal.vacinado, icon: Syringe },
    { label: "Castrado", ok: animal.castrado, icon: Scissors },
    { label: "Convive com crianças", ok: animal.compativelCriancas, icon: Baby },
    { label: "Convive com outros pets", ok: animal.compativelPets, icon: PawPrint },
  ];

  function fotoAnterior() {
    setFotoAtual((i) => (i - 1 + fotos.length) % fotos.length);
  }

  function proximaFoto() {
    setFotoAtual((i) => (i + 1) % fotos.length);
  }

  return (
    <PageShell>
      <main className="container">
        <div className={styles.topGrid}>
          <div className={styles.galeria}>
            <div className={styles.fotoPrincipal}>
              {fotos.length > 0 && <img src={fotos[indiceFoto]} alt={`Foto ${indiceFoto + 1} de ${fotos.length} de ${animal.nome}`} />}

              <span className={styles.badgeAdocao}>
                <StatusBadge status={animal.status} />
              </span>

              <button
                type="button"
                className={[styles.favBtn, fav ? styles.favBtnActive : ""].join(" ")}
                aria-label={fav ? `Remover ${animal.nome} dos favoritos` : `Adicionar ${animal.nome} aos favoritos`}
                aria-pressed={fav}
                onClick={() => toggleFavorito(animal.id)}
              >
                <Heart size={18} fill={fav ? "currentColor" : "none"} />
              </button>

              {temVariasFotos && (
                <>
                  <button type="button" className={`${styles.navBtn} ${styles.navPrev}`} aria-label="Foto anterior" onClick={fotoAnterior}>
                    ‹
                  </button>
                  <button type="button" className={`${styles.navBtn} ${styles.navNext}`} aria-label="Próxima foto" onClick={proximaFoto}>
                    ›
                  </button>
                  <div className={styles.dots}>
                    {fotos.map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        aria-label={`Ver foto ${i + 1}`}
                        aria-current={i === indiceFoto}
                        className={[styles.dot, i === indiceFoto ? styles.dotActive : ""].join(" ")}
                        onClick={() => setFotoAtual(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.infoCol}>
            <Panel>
              <div className={styles.identidade}>
                <span className={styles.iconeCirculo} aria-hidden="true">
                  <PawPrint size={20} />
                </span>
                <h2 className={styles.nome}>{animal.nome}</h2>
              </div>
              <StatusBadge status={animal.status} variant="full" withDot />
            </Panel>

            <Panel>
              <div className={styles.dadosGrid}>
                {dadosObjetivos.map((dado) => (
                  <div className={styles.dadoItem} key={dado.label}>
                    <span className={[styles.dadoIcon, styles[`tone-${dado.tone}`]].join(" ")} aria-hidden="true">
                      <dado.icon size={18} />
                    </span>
                    <div>
                      <div className={styles.dadoLabel}>{dado.label}</div>
                      <div className={styles.dadoValue}>{dado.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <SectionTitle icon={HeartPulse} title="Saúde e temperamento" />
              <div className={styles.temperamento}>
                <Smile size={18} aria-hidden="true" />
                <span>
                  Temperamento: <strong>{animal.temperamento || "não informado"}</strong>
                </span>
              </div>
              <ul className={styles.saudeLista}>
                {saude.map((item) => (
                  <li key={item.label} className={item.ok ? styles.saudeOk : styles.saudeNao}>
                    <item.icon size={16} aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.ok ? <Check size={16} aria-label="sim" /> : <X size={16} aria-label="não" />}
                  </li>
                ))}
              </ul>
              {animal.necessidadesEspeciais && (
                <p className={styles.especiais}>
                  <Stethoscope size={16} aria-hidden="true" /> Tem necessidades especiais — veja os detalhes em “Sobre mim”.
                </p>
              )}
            </Panel>
          </div>
        </div>

        <Panel>
          <SectionTitle icon={FileText} title="Sobre mim" />
          <p className={styles.descricao}>{animal.descricao}</p>
        </Panel>

        {!adotado && requisitos.length > 0 && (
          <Panel>
            <SectionTitle
              icon={ClipboardList}
              title="Pré-requisitos para adoção"
              subtitle={`Exigidos pelo ${abrigo.nome}. Confira antes de entrar em contato.`}
            />
            <ul className={styles.requisitos}>
              {requisitos.map((r) => (
                <li key={r}>
                  <Check size={15} aria-hidden="true" /> {r}
                </li>
              ))}
            </ul>
          </Panel>
        )}

        {animal.status === "em_processo" && (
          <p className={styles.avisoStatus} role="note">
            {animal.nome} já está em processo de adoção. Você ainda pode falar com o abrigo para entrar na lista de espera.
          </p>
        )}
        {adotado && (
          <p className={styles.avisoStatus} role="note">
            {animal.nome} já encontrou um lar! Que tal conhecer outros animais do {abrigo.nome}?
          </p>
        )}

        <div className={styles.acoes}>
          <Button
            variant="secondary"
            className={[styles.acaoBtn, styles.acaoFavoritar].join(" ")}
            onClick={() => toggleFavorito(animal.id)}
            aria-pressed={fav}
          >
            <Heart size={16} fill={fav ? "currentColor" : "none"} /> {fav ? "Adicionado aos favoritos" : "Adicionar aos favoritos"}
          </Button>
          {adotado ? (
            <Button variant="primary" className={[styles.acaoBtn, styles.acaoFalar].join(" ")} to={`/abrigo/${abrigo.id}`}>
              Ver outros animais do abrigo <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              variant="primary"
              className={[styles.acaoBtn, styles.acaoFalar].join(" ")}
              href={linkWhatsApp(abrigo.telefone)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} /> Falar com o abrigo pelo WhatsApp
            </Button>
          )}
        </div>
        {!adotado && (
          <p className={styles.outrosContatos}>
            Prefere outro canal? <a href={linkTelefone(abrigo.telefone)}>Ligar para {abrigo.telefone}</a> ou{" "}
            <a href={`mailto:${abrigo.email}?subject=${encodeURIComponent(`Interesse em adotar ${animal.nome}`)}`}>enviar e-mail</a>.
          </p>
        )}

        <Panel>
          <SectionTitle icon={Building2} title="Onde estou" />

          <div className={styles.ondeEstou}>
            <div className={styles.abrigoInfo}>
              <span className={styles.abrigoAvatar} aria-hidden="true">
                <Home size={22} />
              </span>
              <div>
                <h4 className={styles.abrigoNome}>{abrigo.nome}</h4>
                <p className={styles.abrigoSlogan}>{abrigo.slogan}</p>
                <ul className={styles.abrigoContato}>
                  <li>
                    <MapPin size={15} aria-hidden="true" /> {abrigo.endereco} · {abrigo.cidade}
                  </li>
                  <li>
                    <Phone size={15} aria-hidden="true" /> <a href={linkTelefone(abrigo.telefone)}>{abrigo.telefone}</a>
                  </li>
                  <li>
                    <Mail size={15} aria-hidden="true" /> <a href={`mailto:${abrigo.email}`}>{abrigo.email}</a>
                  </li>
                </ul>
                <Button to={`/abrigo/${abrigo.id}`} variant="secondary" size="sm" className={styles.abrigoLink}>
                  Conhecer o abrigo <ArrowRight size={14} />
                </Button>
              </div>
            </div>

            <MapaAbrigos abrigos={[abrigo]} ativoId={abrigo.id} compacto />
          </div>
        </Panel>
      </main>
    </PageShell>
  );
}
