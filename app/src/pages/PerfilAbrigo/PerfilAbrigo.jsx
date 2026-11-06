import { useRef } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowRight,
  AtSign,
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  HandCoins,
  Heart,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Newspaper,
  Package,
  PawPrint,
  Phone,
  Users,
} from "lucide-react";
import { PageShell } from "../../components/PageShell/PageShell";
import { Panel } from "../../components/Panel/Panel";
import { Button } from "../../components/Button/Button";
import { AnimalCard } from "../../components/AnimalCard/AnimalCard";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { PostList } from "../../components/PostList/PostList";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { getAbrigoById, getAnimaisPorAbrigo, getPosts, linkTelefone, linkWhatsApp, useDados } from "../../data";
import { PaginaNaoEncontrada } from "../PaginaNaoEncontrada/PaginaNaoEncontrada";
import styles from "./PerfilAbrigo.module.css";

export function PerfilAbrigo() {
  const { id } = useParams();
  const dados = useDados();
  const carrossel = useRef(null);
  const abrigo = getAbrigoById(dados, id);

  if (!abrigo) return <PaginaNaoEncontrada />;

  const animais = getAnimaisPorAbrigo(dados, abrigo.id);
  const disponiveis = animais.filter((a) => a.status !== "adotado");
  const adotados = animais.filter((a) => a.status === "adotado");
  const posts = getPosts(dados, abrigo.id);
  const requisitos = (abrigo.requisitos ?? "").split("\n").filter((r) => r.trim());

  function rolar(direcao) {
    const el = carrossel.current;
    el?.scrollBy({ left: direcao * el.clientWidth * 0.8, behavior: "smooth" });
  }

  const impacto = [
    { valor: abrigo.impacto.resgatados, label: "Animais resgatados", icon: PawPrint },
    { valor: abrigo.impacto.adocoes, label: "Adoções realizadas", icon: Heart },
    { valor: abrigo.impacto.voluntarios, label: "Voluntários ativos", icon: Users },
  ];

  return (
    <PageShell>
      <main className="container">
        <section className={styles.hero}>
          <span className={styles.heroIcon} aria-hidden="true">
            <Home size={44} />
          </span>
          <div>
            <h2 className={styles.heroNome}>{abrigo.nome}</h2>
            <p className={styles.heroLocal}>
              <MapPin size={16} aria-hidden="true" /> {abrigo.cidade}
            </p>
            <p className={styles.heroSlogan}>{abrigo.slogan}</p>
          </div>
        </section>

        <div className={styles.duasColunas}>
          <Panel>
            <SectionTitle icon={Building2} title="Sobre a instituição" />
            <p className={styles.texto}>{abrigo.sobre}</p>
            <ul className={styles.contatos}>
              <li>
                <MapPin size={15} aria-hidden="true" /> {abrigo.endereco}
              </li>
              <li>
                <Phone size={15} aria-hidden="true" /> <a href={linkTelefone(abrigo.telefone)}>{abrigo.telefone}</a>
              </li>
              <li>
                <MessageCircle size={15} aria-hidden="true" />{" "}
                <a href={linkWhatsApp(abrigo.telefone)} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <Mail size={15} aria-hidden="true" /> <a href={`mailto:${abrigo.email}`}>{abrigo.email}</a>
              </li>
              {abrigo.instagram && (
                <li>
                  <AtSign size={15} aria-hidden="true" />{" "}
                  <a href={`https://instagram.com/${abrigo.instagram}`} target="_blank" rel="noopener noreferrer">
                    Instagram: @{abrigo.instagram}
                  </a>
                </li>
              )}
            </ul>
          </Panel>

          <Panel id="ajudar">
            <SectionTitle icon={Heart} title="Como ajudar" subtitle="Sua ajuda faz toda a diferença!" />
            <ul className={styles.ajudaLista}>
              <li>
                <span className={styles.ajudaIcon} aria-hidden="true">
                  <HandCoins size={18} />
                </span>
                <div>
                  <h4>Doação em dinheiro</h4>
                  <p>Ajude com custos veterinários, ração e manutenção do abrigo.</p>
                </div>
              </li>
              {abrigo.itensDoacao && (
                <li>
                  <span className={styles.ajudaIcon} aria-hidden="true">
                    <Package size={18} />
                  </span>
                  <div>
                    <h4>Doação de itens</h4>
                    <p>{abrigo.itensDoacao}</p>
                  </div>
                </li>
              )}
              {abrigo.voluntariado && (
                <li>
                  <span className={styles.ajudaIcon} aria-hidden="true">
                    <Users size={18} />
                  </span>
                  <div>
                    <h4>Voluntariado</h4>
                    <p>{abrigo.voluntariado}</p>
                  </div>
                </li>
              )}
            </ul>
            <div className={styles.ajudaAcoes}>
              {abrigo.linkDoacao && (
                <Button href={abrigo.linkDoacao} target="_blank" rel="noopener noreferrer" block>
                  <Heart size={16} /> Quero doar <ExternalLink size={14} />
                </Button>
              )}
              <Button href={linkWhatsApp(abrigo.telefone)} target="_blank" rel="noopener noreferrer" variant="secondary" block>
                <MessageCircle size={16} /> Quero ser voluntário
              </Button>
            </div>
            <p className={styles.nota}>A doação é feita no site da própria instituição.</p>
          </Panel>
        </div>

        <Panel className={styles.bloco}>
          <SectionTitle
            icon={PawPrint}
            title="Animais deste abrigo"
            subtitle="Conheça os animais que estão em busca de um lar"
            action={
              disponiveis.length > 0 && (
                <Button to={`/?abrigo=${abrigo.id}`} variant="secondary" size="sm">
                  Ver todos na busca <ArrowRight size={14} />
                </Button>
              )
            }
          />
          {disponiveis.length === 0 ? (
            <EmptyState title="Nenhum animal disponível no momento" description="Volte em breve ou ajude o abrigo de outras formas." />
          ) : (
            <div className={styles.carrosselWrap}>
              <button type="button" className={[styles.seta, styles.setaEsq].join(" ")} aria-label="Animais anteriores" onClick={() => rolar(-1)}>
                <ChevronLeft size={20} />
              </button>
              <div className={styles.carrossel} ref={carrossel}>
                {disponiveis.map((animal) => (
                  <div className={styles.slide} key={animal.id}>
                    <AnimalCard animal={animal} />
                  </div>
                ))}
              </div>
              <button type="button" className={[styles.seta, styles.setaDir].join(" ")} aria-label="Próximos animais" onClick={() => rolar(1)}>
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {adotados.length > 0 && (
            <div className={styles.adotados}>
              <h4>Já encontraram um lar</h4>
              <ul>
                {adotados.map((a) => (
                  <li key={a.id}>
                    {a.fotos?.[0] ? <img src={a.fotos[0]} alt="" /> : <PawPrint size={18} aria-hidden="true" />}
                    {a.nome}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>

        {requisitos.length > 0 && (
          <Panel className={styles.bloco}>
            <SectionTitle icon={ClipboardList} title="Pré-requisitos para adoção" />
            <ul className={styles.requisitos}>
              {requisitos.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Panel>
        )}

        <div className={[styles.duasColunas, styles.bloco].join(" ")}>
          <Panel>
            <SectionTitle icon={Newspaper} title="Últimos resgates e eventos" />
            <PostList posts={posts.slice(0, 3)} />
          </Panel>
          <Panel>
            <SectionTitle icon={BarChart3} title="Nosso impacto" />
            <div className={styles.impacto}>
              {impacto.map((item) => (
                <div key={item.label} className={styles.impactoBox}>
                  <item.icon size={22} aria-hidden="true" />
                  <strong>{item.valor}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </main>
    </PageShell>
  );
}
