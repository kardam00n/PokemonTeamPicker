#!/usr/bin/env node
/**
 * fetch-pokemon-data.mjs  (v2)
 * Fetches all Pokémon + alternative forms (regional variants, Mega evolutions,
 * battle-only forms with different types, etc.) from PokeAPI.
 *
 * Strategy:
 *   1. GET /pokemon-species?limit=1025  → all 1025 species (Gen I–IX)
 *   2. For each species, GET /pokemon-species/{id}  → list of varieties
 *   3. For every variety (default + alternatives), GET /pokemon/{name}
 *   4. Filter out cosmetic/irrelevant forms (see SKIP_SUFFIXES)
 *   5. Write pokemon-list.json + type-chart.json to public/data/
 *
 * Output shape per Pokémon:
 *   { id, name, displayName, baseName, formName, types, sprite }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "public", "data");

const POKEAPI = "https://pokeapi.co/api/v2";
const TOTAL_SPECIES = 1025; // Gen I–IX
const CONCURRENCY = 20;

fs.mkdirSync(DATA_DIR, { recursive: true });

// ─── Suffixes to SKIP (cosmetic forms that don't change types meaningfully) ──
// We keep: regional (-alola, -galar, -hisui, -paldea), mega, primal,
//          rotom forms, lycanroc, deoxys, shaymin-sky, etc.
// We skip: gmax (just bigger, same types), -totem (same), -starter (cosmetic),
//          gender diffs (-f), eternamax, etc.
const SKIP_SUFFIXES = [
  "-gmax",
  "-eternamax",
  "-totem",
  "-starter",
  "-original",      // original cap pikachu etc.
  "-partner",
  "-f",             // gender difference (Jellicent-F etc.)
  "-cosplay",
  "-phd",
  "-libre",
  "-pop-star",
  "-belle",
  "-rock-star",
  "-spiky-eared",
  "-world-cap",
  "-original-cap",
  "-alola-cap",
  "-sinnoh-cap",
  "-unova-cap",
  "-kalos-cap",
  "-hoenn-cap",
  "-partner-cap",
  "-cap",           // remaining pikachu caps
];

// ─── Utilities ───────────────────────────────────────────────────────────────

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} → ${url}`);
  return res.json();
}

async function pLimit(tasks, limit) {
  const results = [];
  const executing = new Set();
  for (const task of tasks) {
    const p = Promise.resolve().then(task);
    results.push(p);
    executing.add(p);
    p.finally(() => executing.delete(p));
    if (executing.size >= limit) await Promise.race(executing);
  }
  return Promise.all(results);
}

function shouldSkip(pokemonName) {
  const lower = pokemonName.toLowerCase();
  return SKIP_SUFFIXES.some((suffix) => lower.endsWith(suffix));
}

/**
 * Build a human-readable displayName from the PokeAPI name.
 * e.g. "charizard-mega-x"  → "Charizard (Mega X)"
 *       "vulpix-alola"      → "Vulpix (Alolan)"
 *       "giratina-origin"   → "Giratina (Origin)"
 */
function buildDisplayName(pokemonName, isDefault) {
  if (isDefault) {
    // Just capitalize base name
    return pokemonName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  // Find where the form suffix starts by looking for known base names
  // Strategy: everything after the first dash sequence IS a form name
  // We need the base species name from the variants loop (passed separately)
  return null; // handled by caller with baseName param
}

function prettyFormName(formSuffix) {
  // Map common form tokens → pretty labels
  const TOKENS = {
    alola:   "Alolan",
    alolan:  "Alolan",
    galar:   "Galarian",
    galarian:"Galarian",
    hisui:   "Hisuian",
    hisuian: "Hisuian",
    paldea:  "Paldean",
    paldean: "Paldean",
    mega:    "Mega",
    primal:  "Primal",
    origin:  "Origin",
    sky:     "Sky",
    therian: "Therian",
    resolute:"Resolute",
    black:   "Black",
    white:   "White",
    speed:   "Speed",
    attack:  "Attack",
    defense: "Defense",
    midday:  "Midday",
    midnight:"Midnight",
    dusk:    "Dusk",
    dawn:    "Dawn",
    dusk:    "Dusk",
    ice:     "Ice",
    shadow:  "Shadow",
    heat:    "Heat",
    wash:    "Wash",
    frost:   "Frost",
    fan:     "Fan",
    mow:     "Mow",
    zen:     "Zen",
    incarnate:"Incarnate",
    blade:   "Blade",
    aria:    "Aria",
    pirouette:"Pirouette",
    confined:"Confined",
    unbound: "Unbound",
    complete:"Complete",
    fifty:   "50%",
    "ten":   "10%",
    busted:  "Busted",
    disguised:"Disguised",
    dusk:    "Dusk",
    dawn:    "Dawn",
    amped:   "Amped",
    lowkey:  "Low Key",
    hangry:  "Hangry",
    full:    "Full Belly",
    "curly": "Curly",
    "droopy":"Droopy",
    "stretchy":"Stretchy",
    eternatus:"Eternamax",
    crowned:  "Crowned",
    hero:     "Hero",
    aqua:     "Aqua",
    blaze:    "Blaze",
    x:        "X",
    y:        "Y",
  };

  return formSuffix
    .split("-")
    .map((tok) => TOKENS[tok] ?? (tok.charAt(0).toUpperCase() + tok.slice(1)))
    .join(" ");
}

// ─── Type Chart ──────────────────────────────────────────────────────────────

const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

async function buildTypeChart() {
  console.log("📊 Fetching type chart…");
  const chart = {};
  const typeData = await pLimit(
    ALL_TYPES.map((type) => () => fetchJSON(`${POKEAPI}/type/${type}`)),
    10
  );
  for (const data of typeData) {
    chart[data.name] = data.damage_relations.double_damage_to.map((t) => t.name);
  }
  return chart;
}

// ─── Pokémon + Forms ─────────────────────────────────────────────────────────

async function buildPokemonList() {
  // Step 1: get all species
  console.log(`🔍 Fetching ${TOTAL_SPECIES} species from PokeAPI…`);
  const speciesList = await fetchJSON(
    `${POKEAPI}/pokemon-species?limit=${TOTAL_SPECIES}&offset=0`
  );

  // Step 2: fetch species detail (to get varieties list)
  console.log("⬇︎  Fetching species details (varieties)…");
  let speciesDone = 0;
  const speciesDetails = await pLimit(
    speciesList.results.map((s) => async () => {
      try {
        const detail = await fetchJSON(s.url);
        speciesDone++;
        if (speciesDone % 200 === 0)
          console.log(`   … species ${speciesDone}/${TOTAL_SPECIES}`);
        return detail;
      } catch {
        return null;
      }
    }),
    CONCURRENCY
  );

  // Step 3: collect all (speciesName, pokemonUrl, isDefault) tuples
  const pokemonJobs = [];
  for (const species of speciesDetails.filter(Boolean)) {
    for (const variety of species.varieties) {
      if (shouldSkip(variety.pokemon.name)) continue;
      pokemonJobs.push({
        baseName: species.name,
        pokemonName: variety.pokemon.name,
        url: variety.pokemon.url,
        isDefault: variety.is_default,
      });
    }
  }

  console.log(
    `⬇︎  Fetching ${pokemonJobs.length} Pokémon (base + forms, concurrency=${CONCURRENCY})…`
  );

  let done = 0;
  const results = await pLimit(
    pokemonJobs.map((job) => async () => {
      try {
        const p = await fetchJSON(job.url);
        done++;
        if (done % 100 === 0)
          console.log(`   … ${done}/${pokemonJobs.length}`);

        // Build display name
        let displayName;
        if (job.isDefault) {
          displayName = job.baseName
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        } else {
          const formSuffix = job.pokemonName
            .slice(job.baseName.length + 1); // strip "baseName-"
          const basePretty = job.baseName
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          const formPretty = prettyFormName(formSuffix);
          displayName = `${basePretty} (${formPretty})`;
        }

        const sprite =
          p.sprites?.other?.["official-artwork"]?.front_default ??
          p.sprites?.front_default ??
          null;

        return {
          id: p.id,
          name: p.name,           // slug: "charizard-mega-x"
          displayName,             // pretty: "Charizard (Mega X)"
          baseName: job.baseName,  // "charizard"
          isDefault: job.isDefault,
          types: p.types.map((t) => t.type.name),
          sprite,
        };
      } catch {
        return null;
      }
    }),
    CONCURRENCY
  );

  return results
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by: baseName alphabetically, then default first
      if (a.baseName !== b.baseName) return a.baseName.localeCompare(b.baseName);
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Pokemon Team Picker – data fetch v2 (with forms)\n");

  const [typeChart, pokemonList] = await Promise.all([
    buildTypeChart(),
    buildPokemonList(),
  ]);

  const baseCount = pokemonList.filter((p) => p.isDefault).length;
  const formCount = pokemonList.filter((p) => !p.isDefault).length;

  // 🛡 Security Check: Validate sprite URLs and String Data Formats
  const ALLOWED_SPRITE_ORIGIN = "https://raw.githubusercontent.com/PokeAPI/sprites/";
  const SAFE_STRING_REGEX = /^[a-zA-Z0-9-()%\s]+$/;

  const invalidEntries = pokemonList.filter((p) => {
    // Check sprite origin
    if (p.sprite && !p.sprite.startsWith(ALLOWED_SPRITE_ORIGIN)) return true;
    
    // Check string injection / corruption vectors
    if (p.name.length > 50 || !SAFE_STRING_REGEX.test(p.name)) return true;
    if (p.baseName.length > 50 || !SAFE_STRING_REGEX.test(p.baseName)) return true;
    if (p.displayName.length > 100) return true;
    
    // Check types array
    if (!Array.isArray(p.types) || p.types.length > 3) return true;
    for (const t of p.types) {
      if (t.length > 20 || !SAFE_STRING_REGEX.test(t)) return true;
    }
    
    return false;
  });

  if (invalidEntries.length > 0) {
    console.error("❌ Suspicious data formats or sprite URLs detected in fetched data:");
    console.error(invalidEntries.slice(0, 5)); // Log up to 5 violations
    console.error("Aborting build to prevent potential supply-chain injection.");
    process.exit(1);
  }

  fs.writeFileSync(
    path.join(DATA_DIR, "type-chart.json"),
    JSON.stringify(typeChart, null, 2)
  );
  console.log(`✅ Type chart → public/data/type-chart.json`);

  fs.writeFileSync(
    path.join(DATA_DIR, "pokemon-list.json"),
    JSON.stringify(pokemonList, null, 2)
  );
  console.log(
    `✅ Pokémon list → public/data/pokemon-list.json`,
    `\n   📦 ${baseCount} base forms + ${formCount} alternative forms = ${pokemonList.length} total`
  );

  console.log("\n✨ Data fetch complete!");
}

main().catch((err) => {
  console.error("❌ Fetch failed:", err);
  process.exit(1);
});
