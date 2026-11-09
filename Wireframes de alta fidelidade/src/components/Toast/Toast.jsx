import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import styles from "./Toast.module.css";

/**
 * Aviso temporário de confirmação (feedback de ações do painel).
 * `acao` opcional ({ label, onClick }) — usado para "Desfazer".
 */
export function Toast({ mensagem, acao, onClose, duracao = 5000 }) {
  useEffect(() => {
    if (!mensagem) return undefined;
    const t = setTimeout(onClose, duracao);
    return () => clearTimeout(t);
  }, [mensagem, onClose, duracao]);

  if (!mensagem) return null;

  return (
    <div className={styles.toast} role="status">
      <CheckCircle2 size={18} aria-hidden="true" />
      <span>{mensagem}</span>
      {acao && (
        <button
          type="button"
          className={styles.acao}
          onClick={() => {
            acao.onClick();
            onClose();
          }}
        >
          {acao.label}
        </button>
      )}
    </div>
  );
}
