"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import type { Pokemon } from "@/lib/types";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  pokemonList: Pokemon[];
  team: Pokemon[];
  onAdd: (pokemon: Pokemon) => void;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}

export default function SearchBar({ pokemonList, team, onAdd }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().replace(/\s+/g, "-");
    return pokemonList
      .filter((p) => p.name.startsWith(q) || p.baseName.startsWith(q) || p.displayName.toLowerCase().includes(q.replace(/-/g, " ")))
      .slice(0, 10);
  }, [query, pokemonList]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleSelect(pokemon: Pokemon) {
    onAdd(pokemon);
    setQuery("");
    setOpen(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter" && suggestions.length > 0) {
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) handleSelect(suggestions[activeIdx]);
      else if (suggestions.length === 1) handleSelect(suggestions[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  }

  const teamFull = team.length >= 6;
  const teamIds = new Set(team.map((p) => p.id));

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <div className={styles.inputRow}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          ref={inputRef}
          id="pokemon-search"
          className={styles.input}
          type="text"
          placeholder={teamFull ? "Team is full (6/6)" : "Search Pokémon…"}
          value={query}
          disabled={teamFull}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="search-listbox"
        />
        {query && (
          <button
            className={styles.clearBtn}
            onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id="search-listbox"
          role="listbox"
          className={styles.dropdown}
        >
          {suggestions.map((pokemon, i) => {
            const inTeam = teamIds.has(pokemon.id);
            return (
              <li
                key={pokemon.id}
                role="option"
                aria-selected={i === activeIdx}
                className={`${styles.dropdownItem} ${i === activeIdx ? styles.active : ""} ${inTeam ? styles.inTeam : ""}`}
                onMouseDown={(e) => { e.preventDefault(); if (!inTeam) handleSelect(pokemon); }}
                onMouseEnter={() => setActiveIdx(i)}
              >
                {pokemon.sprite && (
                  <Image
                    src={pokemon.sprite}
                    alt=""
                    className={styles.miniSprite}
                    width={36}
                    height={36}
                    unoptimized
                  />
                )}
                <span className={styles.pokeName}>{pokemon.displayName}</span>
                <span className={styles.typePills}>
                  {pokemon.types.map((t) => (
                    <span
                      key={t}
                      className="type-badge"
                      style={{ backgroundColor: `var(--type-${t})` }}
                    >
                      {t}
                    </span>
                  ))}
                </span>
                {inTeam && <span className={styles.inTeamLabel}>In team</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
