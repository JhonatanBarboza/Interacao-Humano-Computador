import { Link } from "react-router-dom";
import { CalendarHeart, HeartHandshake, Megaphone, PawPrint } from "lucide-react";
import { TIPOS_POST, formatarData, getAbrigoById, useDados } from "../../data";
import styles from "./PostList.module.css";

const TIPO_ICON = { resgate: PawPrint, evento: CalendarHeart, campanha: Megaphone };

/**
 * Feed cronológico de resgates, campanhas e eventos. Na home mostra de
 * qual abrigo é cada post (`mostrarAbrigo`); na página institucional não.
 */
export function PostList({ posts, mostrarAbrigo = false, vazio = "Nenhuma publicação recente." }) {
  const dados = useDados();

  if (!posts.length) return <p className={styles.vazio}>{vazio}</p>;

  return (
    <ul className={styles.lista}>
      {posts.map((post) => {
        const data = formatarData(post.data);
        const Icon = TIPO_ICON[post.tipo] ?? HeartHandshake;
        const abrigo = mostrarAbrigo ? getAbrigoById(dados, post.abrigoId) : null;
        return (
          <li key={post.id} className={styles.item}>
            <time className={styles.data} dateTime={post.data}>
              <span className={styles.dia}>{data.dia}</span>
              <span className={styles.mes}>{data.mes}</span>
            </time>
            {post.fotos?.[0] ? (
              <img className={styles.foto} src={post.fotos[0]} alt="" />
            ) : (
              <span className={styles.tipoIcon} aria-hidden="true">
                <Icon size={20} />
              </span>
            )}
            <div className={styles.corpo}>
              <div className={styles.meta}>
                <span className={[styles.tipo, styles[post.tipo]].join(" ")}>{TIPOS_POST[post.tipo]}</span>
                {abrigo && (
                  <Link to={`/abrigo/${abrigo.id}`} className={styles.abrigo}>
                    {abrigo.nome}
                  </Link>
                )}
              </div>
              <h4 className={styles.titulo}>{post.titulo}</h4>
              <p className={styles.descricao}>{post.descricao}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
