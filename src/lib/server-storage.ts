import fs from "fs";
import path from "path";

const DATA_PATH = path.resolve(process.env.DATA_PATH || path.join(process.cwd(), "data"));
const TEAM_FILE = path.join(DATA_PATH, "team.json");

/**
 * Ensures the data directory exists.
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH, { recursive: true });
  }
}

/**
 * Saves the current team of Pokémon IDs to a file on the server.
 */
export async function saveTeamToFile(pokemonIds: number[]): Promise<void> {
  try {
    ensureDataDir();
    fs.writeFileSync(TEAM_FILE, JSON.stringify(pokemonIds, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save team to file:", error);
    throw new Error("Failed to save team on server");
  }
}

/**
 * Loads the Pokémon team IDs from a file on the server.
 */
export async function loadTeamFromFile(): Promise<number[]> {
  try {
    if (!fs.existsSync(TEAM_FILE)) {
      return [];
    }
    const content = fs.readFileSync(TEAM_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => typeof id === "number");
    }
    return [];
  } catch (error) {
    console.error("Failed to load team from file:", error);
    return [];
  }
}
