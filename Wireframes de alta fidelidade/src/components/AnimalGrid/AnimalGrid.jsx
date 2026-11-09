import { AnimalCard } from "../AnimalCard/AnimalCard";
import { EmptyState } from "../EmptyState/EmptyState";
import styles from "./AnimalGrid.module.css";

/** `colunas` fixa o número de colunas; sem ele a grade se ajusta à largura disponível. */
export function AnimalGrid({ animais, colunas, emptyTitle = "Nenhum animal encontrado", emptyDescription, emptyAction }) {
  if (!animais.length) {
    return (
      <div className={styles.grid}>
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      </div>
    );
  }

  return (
    <div className={styles.grid} style={colunas ? { "--colunas": colunas } : undefined}>
      {animais.map((animal) => (
        <AnimalCard key={animal.id} animal={animal} />
      ))}
    </div>
  );
}
