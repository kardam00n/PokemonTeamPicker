"use client";

import type { CoverageResult, Pokemon } from "@/lib/types";
import styles from "./CoveragePanel.module.css";
import Image from "next/image";

interface CoveragePanelProps {
  coverage: CoverageResult[];
  teamSize: number;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function MiniSprite({ pokemon }: { pokemon: Pokemon }) {
  if (!pokemon.sprite) return null;
  return (
    <Image
      src={pokemon.sprite}
      alt={pokemon.displayName}
      width={28}
      height={28}
      className={styles.miniSprite}
      title={capitalize(pokemon.displayName)}
    />
  );
}

export default function CoveragePanel({ coverage, teamSize }: CoveragePanelProps) {
  const covered = coverage.filter((r) => r.attackers.length > 0);
  const uncovered = coverage.filter((r) => r.attackers.length === 0);

  if (teamSize === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Type Coverage</h2>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🎯</span>
          <p>Add Pokémon to your team to see coverage analysis.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Type coverage analysis">
      <div className={styles.header}>
        <h2 className={styles.title}>Type Coverage</h2>
        <div className={styles.stats}>
          <span className={styles.statChip}>
            <span className={styles.statNum}>{covered.length}</span>
            <span className={styles.statLabel}>covered</span>
          </span>
          <span className={`${styles.statChip} ${styles.statUncovered}`}>
            <span className={styles.statNum}>{uncovered.length}</span>
            <span className={styles.statLabel}>missing</span>
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        {coverage.map((result, i) => {
          const isCovered = result.attackers.length > 0;
          return (
            <div
              key={result.enemyType}
              className={`${styles.typeCell} ${isCovered ? styles.covered : styles.uncovered}`}
              style={{
                "--type-color": `var(--type-${result.enemyType})`,
                animationDelay: `${i * 20}ms`,
              } as React.CSSProperties}
            >
              <span
                className={styles.typeName}
                style={{ color: `var(--type-${result.enemyType})` }}
              >
                {capitalize(result.enemyType)}
              </span>

              {isCovered ? (
                <div className={styles.attackers}>
                  {result.attackers.map((p) => (
                    <MiniSprite key={p.id} pokemon={p} />
                  ))}
                </div>
              ) : (
                <span className={styles.crossIcon}>✕</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
