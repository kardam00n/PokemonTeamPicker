"use client";

import { useState, useCallback, useMemo } from "react";
import type { Pokemon, TypeChart } from "@/lib/types";
import { calculateCoverage } from "@/lib/type-coverage";
import SearchBar from "@/components/SearchBar/SearchBar";
import TeamGrid from "@/components/TeamGrid/TeamGrid";
import CoveragePanel from "@/components/CoveragePanel/CoveragePanel";
import styles from "./TeamPicker.module.css";

interface TeamPickerProps {
  pokemonList: Pokemon[];
  typeChart: TypeChart;
}

export default function TeamPicker({ pokemonList, typeChart }: TeamPickerProps) {
  const [team, setTeam] = useState<Pokemon[]>([]);

  const addPokemon = useCallback((pokemon: Pokemon) => {
    setTeam((prev) => {
      if (prev.length >= 6) return prev;
      if (prev.some((p) => p.id === pokemon.id)) return prev;
      return [...prev, pokemon];
    });
  }, []);

  const removePokemon = useCallback((id: number) => {
    setTeam((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const coverage = useMemo(
    () => calculateCoverage(team, typeChart),
    [team, typeChart]
  );

  return (
    <div className={styles.container}>
      {/* Search */}
      <section className={styles.searchSection}>
        <p className={styles.hint}>
          Search for a Pokémon and add up to 6 to your team.
        </p>
        <SearchBar
          pokemonList={pokemonList}
          team={team}
          onAdd={addPokemon}
        />
      </section>

      {/* Team Grid */}
      <TeamGrid team={team} onRemove={removePokemon} />

      {/* Divider */}
      <div className={styles.divider} />

      {/* Coverage Analysis */}
      <CoveragePanel coverage={coverage} teamSize={team.length} />
    </div>
  );
}
