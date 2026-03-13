import type { Pokemon } from "@/lib/types";
import styles from "./PokemonCard.module.css";
import Image from "next/image";

interface PokemonCardProps {
  pokemon: Pokemon;
  onRemove: (id: number) => void;
  index: number;
}

export default function PokemonCard({ pokemon, onRemove, index }: PokemonCardProps) {
  const primaryType = pokemon.types[0];

  return (
    <div
      className={styles.card}
      style={{
        "--type-color": `var(--type-${primaryType})`,
        animationDelay: `${index * 60}ms`,
      } as React.CSSProperties}
    >
      <button
        className={styles.removeBtn}
        onClick={() => onRemove(pokemon.id)}
        aria-label={`Remove ${pokemon.displayName}`}
        title="Remove from team"
      >
        ×
      </button>

      <div className={styles.spriteWrapper}>
        {pokemon.sprite ? (
          <Image
            src={pokemon.sprite}
            alt={pokemon.displayName}
            width={96}
            height={96}
            className={styles.sprite}
            priority={index < 3}
          />
        ) : (
          <div className={styles.spritePlaceholder}>?</div>
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.pokeId}>#{String(pokemon.id).padStart(3, "0")}</span>
        <h3 className={styles.pokeName}>{pokemon.displayName}</h3>
        <div className={styles.types}>
          {pokemon.types.map((t) => (
            <span
              key={t}
              className="type-badge"
              style={{ backgroundColor: `var(--type-${t})` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
