import styles from "./PainelCabecalho.module.css";

/** Título + descrição da página do painel, com ação principal à direita. */
export function PainelCabecalho({ titulo, descricao, acao }) {
  return (
    <div className={styles.cabecalho}>
      <div>
        <h2 className={styles.titulo}>{titulo}</h2>
        {descricao && <p className={styles.descricao}>{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}
