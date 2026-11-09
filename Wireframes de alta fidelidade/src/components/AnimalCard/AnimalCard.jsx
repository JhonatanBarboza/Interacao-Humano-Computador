import { ArrowRight, Cat, Dog, Heart, Mars, MapPin, PawPrint, Venus } from "lucide-react";
import { getAbrigoById, useDados } from "../../data";
import { useFavorites } from "../../hooks/useFavorites";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { Chip } from "../Chip/Chip";
import { Button } from "../Button/Button";
import styles from "./AnimalCard.module.css";

const ESPECIE_ICON = {
  Cachorro: Dog,
  Gato: Cat,
};

export function AnimalCard({ animal }) {
  const dados = useDados();
  const abrigo = getAbrigoById(dados, animal.abrigoId);
  const { isFavorito, toggleFavorito } = useFavorites();
  const fav = isFavorito(animal.id);
  const EspecieIcon = ESPECIE_ICON[animal.especie] ?? PawPrint;
  const SexoIcon = animal.sexo === "Macho" ? Mars : Venus;
  const foto = animal.fotos?.[0];

  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        {foto ? (
          <img src={foto} alt={`Foto de ${animal.nome}`} loading="lazy" />
        ) : (
          <EspecieIcon className={styles.especieIcon} aria-hidden="true" />
        )}
        <div className={styles.statusOverlay}>
          <StatusBadge status={animal.status} />
        </div>
        <button
          type="button"
          className={[styles.favBtn, fav ? styles.favActive : ""].join(" ")}
          aria-label={fav ? `Remover ${animal.nome} dos favoritos` : `Favoritar ${animal.nome}`}
          aria-pressed={fav}
          title={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorito(animal.id);
          }}
        >
          <Heart size={18} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{animal.nome}</h3>
        <div className={styles.meta}>
          <Chip>
            <EspecieIcon size={12} /> {animal.especie}
          </Chip>
          <Chip>
            <SexoIcon size={12} /> {animal.idade}
          </Chip>
          <Chip>
            <PawPrint size={12} /> {animal.porte}
          </Chip>
          {animal.temperamento && (
            <Chip accent>
              <Heart size={12} fill="currentColor" /> {animal.temperamento}
            </Chip>
          )}
        </div>
        <p className={styles.desc}>{animal.resumo}</p>
        <div className={styles.footer}>
          <span className={styles.local}>
            <MapPin size={13} /> {abrigo ? `${abrigo.nome} · ${abrigo.cidade.replace(/ - [A-Z]{2}$/, "")}` : "—"}
          </span>
          <Button to={`/animal/${animal.id}`} variant="secondary" size="sm" aria-label={`Ver mais sobre ${animal.nome}`}>
            Ver mais <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </article>
  );
}
