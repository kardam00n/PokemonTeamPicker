"use client";

import type { Pokemon } from "@/lib/types";
import PokemonCard from "@/components/PokemonCard/PokemonCard";
import styles from "./TeamGrid.module.css";

interface TeamGridProps {
  team: Pokemon[];
  onRemove: (id: number) => void;
}

export default function TeamGrid({ team, onRemove }: TeamGridProps) {
  const slots = Array.from({ length: 6 }, (_, i) => team[i] ?? null);

  return (
    <section className={styles.section} aria-label="Your team">
      <div className={styles.header}>
        <h2 className={styles.title}>Your Team</h2>
        <span className={styles.counter}>
          <span className={team.length >= 6 ? styles.counterFull : ""}>{team.length}</span>/6
        </span>
      </div>

      <div className={styles.grid}>
        {slots.map((pokemon, i) =>
          pokemon ? (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onRemove={onRemove}
              index={i}
            />
          ) : (
            <div key={`empty-${i}`} className={styles.emptySlot} aria-hidden="true">
              <span className={styles.emptyIcon}>+</span>
              <span className={styles.emptyLabel}>Empty</span>
            </div>
          )
        )}
      </div>
    </section>
  );
}
