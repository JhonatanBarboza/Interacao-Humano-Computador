import styles from "./Field.module.css";

/**
 * Rótulo + controle + dica/erro. `required` só desenha o asterisco; a
 * validação fica a cargo do formulário, que passa `error`.
 */
export function Field({ label, htmlFor, required = false, hint, error, children, className = "" }) {
  return (
    <div className={[styles.field, error ? styles.hasError : "", className].join(" ")}>
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label} {required && <span className={styles.req} aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </div>
  );
}
