import styles from "./Panel.module.css";

/** Painel branco arredondado com sombra — bloco de conteúdo padrão das páginas. */
export function Panel({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag className={[styles.panel, className].join(" ")} {...rest}>
      {children}
    </Tag>
  );
}
