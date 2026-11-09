import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

/** Layout padrão das páginas públicas: fundo terracota + Header + conteúdo + Footer. */
export function PageShell({ children }) {
  return (
    <div className="page-shell">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
