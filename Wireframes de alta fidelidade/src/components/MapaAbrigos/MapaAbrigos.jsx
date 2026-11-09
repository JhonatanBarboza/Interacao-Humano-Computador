import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import styles from "./MapaAbrigos.module.css";

/**
 * Mapa simulado (sem serviço de mapas real): cada abrigo vira um marcador
 * posicionado por `mapaPos`. O marcador ativo mostra nome, resumo e link
 * para a página institucional.
 */
export function MapaAbrigos({ abrigos, ativoId, onSelecionar, compacto = false }) {
  return (
    <div className={[styles.mapa, compacto ? styles.compacto : ""].join(" ")} role="region" aria-label="Mapa dos abrigos">
      <span className={styles.parque} style={{ top: "12%", left: "8%" }} aria-hidden="true" />
      <span className={styles.parque} style={{ top: "60%", left: "48%", width: "22%" }} aria-hidden="true" />
      {abrigos.map((abrigo) => {
        const ativo = abrigo.id === ativoId;
        return (
          <div
            key={abrigo.id}
            className={[styles.marker, ativo ? styles.ativo : ""].join(" ")}
            style={{ top: abrigo.mapaPos.top, left: abrigo.mapaPos.left }}
          >
            {ativo && (
              <div className={styles.popup}>
                <strong>{abrigo.nome}</strong>
                <span>{abrigo.cidade}</span>
                {!compacto && (
                  <>
                    <p>{abrigo.slogan}</p>
                    <Link to={`/abrigo/${abrigo.id}`} className={styles.popupLink}>
                      Ver página <ArrowRight size={13} />
                    </Link>
                  </>
                )}
              </div>
            )}
            <button
              type="button"
              className={styles.pin}
              aria-label={`${abrigo.nome}, ${abrigo.cidade}`}
              aria-pressed={ativo}
              onClick={() => onSelecionar?.(abrigo.id)}
              disabled={!onSelecionar}
            >
              <MapPin size={compacto ? 26 : 30} fill="currentColor" stroke="white" strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
