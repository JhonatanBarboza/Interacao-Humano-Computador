import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { Building2, ExternalLink, Home, LogOut, Newspaper, PawPrint, Plus } from "lucide-react";
import { getAbrigoById, useDados } from "../../data";
import { useSessao } from "../../hooks/useSessao";
import styles from "./PainelShell.module.css";

const MENU = [
  { to: "/painel", label: "Início", icon: Home, end: true },
  { to: "/painel/animais", label: "Meus animais", icon: PawPrint },
  { to: "/painel/cadastro", label: "Cadastrar animal", icon: Plus },
  { to: "/painel/pagina", label: "Página institucional", icon: Building2 },
  { to: "/painel/posts", label: "Resgates e eventos", icon: Newspaper },
];

const linkClass = ({ isActive }) => (isActive ? `${styles.menuLink} ${styles.ativo}` : styles.menuLink);

/**
 * Layout do painel da instituição. Redireciona para o login se não houver
 * sessão; passa o abrigo logado para a página via render prop.
 */
export function PainelShell({ children }) {
  const { abrigoId, sair } = useSessao();
  const dados = useDados();
  const navigate = useNavigate();
  const abrigo = abrigoId ? getAbrigoById(dados, abrigoId) : null;

  if (!abrigo) return <Navigate to="/login" replace />;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            <PawPrint size={20} />
          </span>
          <div>
            <strong>Patas que Acolhem</strong>
            <span>Painel da Instituição</span>
          </div>
        </div>
        <div className={styles.usuario}>
          <NavLink to={`/abrigo/${abrigo.id}`} target="_blank" className={styles.verPagina}>
            Ver página pública <ExternalLink size={13} />
          </NavLink>
          <span className={styles.abrigoNome}>
            <span className={styles.avatar} aria-hidden="true">
              <Home size={16} />
            </span>
            {abrigo.nome}
          </span>
          <button
            type="button"
            className={styles.sair}
            onClick={() => {
              sair();
              navigate("/login");
            }}
          >
            <LogOut size={15} /> Sair
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <nav className={styles.sidebar} aria-label="Menu do painel">
          {MENU.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <item.icon size={18} aria-hidden="true" /> {item.label}
            </NavLink>
          ))}
          <p className={styles.sidebarRodape}>Juntos por mais lares e menos abandono.</p>
        </nav>
        <main className={styles.conteudo}>{children(abrigo)}</main>
      </div>
    </div>
  );
}
