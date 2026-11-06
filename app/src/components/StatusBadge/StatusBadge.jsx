import { PawPrint } from "lucide-react";
import { STATUS_BADGE_TONE, STATUS_LABEL } from "../../data";
import styles from "./StatusBadge.module.css";

const SHORT_LABEL = {
  disponivel: "Para adoção",
  em_processo: "Em processo",
  adotado: "Adotado",
};

/**
 * Selo de status de adoção. `variant="full"` usa o rótulo completo
 * (perfil do animal); `variant="short"` (padrão) usa o rótulo curto
 * usado nos cards de listagem.
 */
export function StatusBadge({ status, variant = "short", withDot = false }) {
  const tone = STATUS_BADGE_TONE[status];
  const label = variant === "full" ? STATUS_LABEL[status] : SHORT_LABEL[status];

  return (
    <span className={[styles.badge, styles[tone]].join(" ")}>
      {withDot ? <span className={[styles.dot, styles[`dot-${tone}`]].join(" ")} /> : <PawPrint size={12} />} {label}
    </span>
  );
}
