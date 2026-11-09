import { Link } from "react-router-dom";
import styles from "./Button.module.css";

/**
 * Botão do design system. Renderiza <button>, <a> (href externo) ou
 * <Link> (to interno) mantendo a mesma aparência.
 */
export function Button({
  variant = "primary",
  size = "md",
  block = false,
  to,
  href,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    block ? styles.block : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
