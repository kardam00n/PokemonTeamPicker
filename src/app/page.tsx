import fs from "fs";
import path from "path";
import type { Pokemon, TypeChart } from "@/lib/types";
import TeamPicker from "./TeamPicker";

// Server Component – reads static JSON files at build time (SSG)
function loadData(): { pokemonList: Pokemon[]; typeChart: TypeChart } {
  const dataDir = path.join(process.cwd(), "public", "data");
  const pokemonList: Pokemon[] = JSON.parse(
    fs.readFileSync(path.join(dataDir, "pokemon-list.json"), "utf-8")
  );
  const typeChart: TypeChart = JSON.parse(
    fs.readFileSync(path.join(dataDir, "type-chart.json"), "utf-8")
  );
  return { pokemonList, typeChart };
}

export default function Home() {
  const { pokemonList, typeChart } = loadData();

  return (
    <TeamPicker pokemonList={pokemonList} typeChart={typeChart} />
  );
}
