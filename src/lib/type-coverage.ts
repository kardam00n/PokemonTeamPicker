import type { Pokemon, TypeChart, CoverageResult } from "@/lib/types";

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
] as const;

/**
 * Calculate offensive type coverage for a given team.
 *
 * A Pokémon with type X can deal ×2 damage to enemy types that
 * are listed in typeChart[X].
 *
 * Returns an array of CoverageResult for all 18 types,
 * sorted by number of attackers descending, then alphabetically.
 */
export function calculateCoverage(
  team: Pokemon[],
  typeChart: TypeChart
): CoverageResult[] {
  // Map: enemyType → set of pokemon that can hit it super-effectively
  const coverageMap = new Map<string, Set<number>>();
  const attackerMap = new Map<string, Pokemon[]>();

  for (const type of ALL_TYPES) {
    coverageMap.set(type, new Set());
    attackerMap.set(type, []);
  }

  for (const pokemon of team) {
    for (const pokeType of pokemon.types) {
      const effectiveAgainst = typeChart[pokeType] ?? [];
      for (const enemyType of effectiveAgainst) {
        const set = coverageMap.get(enemyType);
        if (set && !set.has(pokemon.id)) {
          set.add(pokemon.id);
          attackerMap.get(enemyType)!.push(pokemon);
        }
      }
    }
  }

  return ALL_TYPES.map((enemyType) => ({
    enemyType,
    attackers: attackerMap.get(enemyType) ?? [],
  })).sort((a, b) => {
    if (b.attackers.length !== a.attackers.length)
      return b.attackers.length - a.attackers.length;
    return a.enemyType.localeCompare(b.enemyType);
  });
}
