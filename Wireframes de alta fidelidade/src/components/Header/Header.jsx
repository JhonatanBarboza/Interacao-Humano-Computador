import { NavLink } from "react-router-dom";
import { Building2, Heart, Home, PawPrint } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";
import { Button } from "../Button/Button";
import styles from "./Header.module.css";

const navLinkClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

export function Header() {
  const { favoritos } = useFavorites();

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.brand}>
        <span className={styles.mark}>
          <PawPrint size={22} />
        </span>
        <span>
          <h1>Patas que Acolhem</h1>
          <span className={styles.tagline}>Mais lares. Mais histórias felizes.</span>
        </span>
      </NavLink>

      <nav className={styles.nav}>
        <NavLink to="/" end className={navLinkClass}>
          <Home size={16} /> Início
        </NavLink>
        <NavLink to="/abrigos" className={navLinkClass}>
          <Building2 size={16} /> Abrigos
        </NavLink>
        <NavLink to="/favoritos" className={navLinkClass}>
          <Heart size={16} /> Favoritos
          {favoritos.length > 0 && <span className={styles.favBadge}>{favoritos.length}</span>}
        </NavLink>
      </nav>

      <div className={styles.actions}>
        <Button to="/abrigos" variant="secondary" size="sm">
          <Heart size={16} /> Quero Ajudar
        </Button>
      </div>
    </header>
  );
}
