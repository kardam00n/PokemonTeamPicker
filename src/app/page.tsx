import type { Pokemon, TypeChart } from "@/lib/types";
import TeamBuilder from "./TeamBuilder";
import { loadStaticData } from "@/lib/data-loader";

export default function Home() {
  const { pokemonList, typeChart } = loadStaticData();
  const appMode = (process.env.APP_MODE as "local" | "server") || "local";

  return (
    <TeamBuilder 
      pokemonList={pokemonList} 
      typeChart={typeChart} 
      appMode={appMode}
    />
  );
}
