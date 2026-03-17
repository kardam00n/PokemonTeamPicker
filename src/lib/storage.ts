"use client";

const TEAM_STORAGE_KEY = "poke-planner-team";

/**
 * Saves the current team of Pokémon IDs to local storage.
 */
export function saveTeamToStorage(pokemonIds: number[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(pokemonIds));
  } catch (error) {
    console.error("Failed to save team to storage:", error);
  }
}

/**
 * Loads the Pokémon team IDs from local storage.
 */
export function loadTeamFromStorage(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(TEAM_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => typeof id === "number");
    }
    return [];
  } catch (error) {
    console.error("Failed to load team from storage:", error);
    return [];
  }
}
