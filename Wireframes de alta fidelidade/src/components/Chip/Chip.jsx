import styles from "./Chip.module.css";

/** Rótulo pequeno e arredondado usado em metadados de card (porte, temperamento...). */
export function Chip({ accent = false, children }) {
  return <span className={[styles.chip, accent ? styles.accent : ""].join(" ")}>{children}</span>;
}
