"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import type { Pokemon, TypeChart } from "@/lib/types";
import { calculateCoverage } from "@/lib/type-coverage";
import { saveTeamToStorage, loadTeamFromStorage } from "@/lib/storage";
import { saveTeamAction, getTeamAction } from "./actions";
import SearchBar from "@/components/SearchBar/SearchBar";
import TeamGrid from "@/components/TeamGrid/TeamGrid";
import CoveragePanel from "@/components/CoveragePanel/CoveragePanel";
import styles from "./TeamBuilder.module.css";

interface TeamBuilderProps {
  pokemonList: Pokemon[];
  typeChart: TypeChart;
  appMode?: "local" | "server";
}

export default function TeamBuilder({ 
  pokemonList, 
  typeChart,
  appMode = "local"
}: TeamBuilderProps) {
  const [team, setTeam] = useState<Pokemon[]>([]);

  // Load team on mount
  useEffect(() => {
    async function loadTeam() {
      let savedIds: number[] = [];
      
      if (appMode === "server") {
        const result = await getTeamAction();
        if (result.success) {
          savedIds = result.ids;
        }
      } else {
        savedIds = loadTeamFromStorage();
      }

      if (savedIds.length > 0) {
        const loadedTeam = savedIds
          .map((id) => pokemonList.find((p) => p.id === id))
          .filter((p): p is Pokemon => p !== undefined);
        setTeam(loadedTeam);
      }
    }
    loadTeam();
  }, [pokemonList, appMode]);

  // Save team to storage whenever it changes
  useEffect(() => {
    const ids = team.map((p) => p.id);
    if (appMode === "server") {
      saveTeamAction(ids);
    } else {
      saveTeamToStorage(ids);
    }
  }, [team, appMode]);

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
