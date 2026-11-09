import styles from "./SectionTitle.module.css";

/** Título de bloco com ícone em selo, subtítulo opcional e ação à direita. */
export function SectionTitle({ icon: Icon, title, subtitle, action, as: Tag = "h3" }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.titulo}>
        {Icon && (
          <span className={styles.icon} aria-hidden="true">
            <Icon size={17} />
          </span>
        )}
        <div>
          <Tag className={styles.heading}>{title}</Tag>
          {subtitle && <p className={styles.sub}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
