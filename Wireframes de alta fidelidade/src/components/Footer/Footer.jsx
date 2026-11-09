import { Link } from "react-router-dom";
import { Building2, Heart } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.lema}>
        Juntos por um mundo com mais lares e menos abandono. <Heart size={14} fill="currentColor" className={styles.heart} />
      </p>
      <Link to="/login" className={styles.instituicao}>
        <Building2 size={14} aria-hidden="true" /> É uma ONG ou abrigo? Acesse o painel da instituição
      </Link>
    </footer>
  );
}
