import styles from "./FilterChip.module.css";

/** Chip clicável usado nos grupos de filtro (espécie, porte, idade...). */
export function FilterChip({ selected = false, onClick, children }) {
  return (
    <button
      type="button"
      className={[styles.chip, selected ? styles.selected : ""].join(" ")}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
