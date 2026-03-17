# PokePlanner ⚡️

A modern, fast web application built to help you compose your dream Pokémon team of up to 6 members and analyze their offensive type coverage against all 18 Pokémon types.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![CSS](https://img.shields.io/badge/Vanilla_CSS-1572B6?style=flat-square&logo=css3&logoColor=white)

---

## 🚀 Live Demo

The application is hosted globally on Vercel for instant load times (SSG architecture).

👉 **[PokePlanner](https://poke-planner.vercel.app/)**

---

## ✨ Features

- **Blazing Fast Search**: Autocompleting search bar querying a local, build-time generated dataset of **over 1000 Pokémon** (including base species, Mega Evolutions, Regional Forms, and other variations).
- **Interactive Team Builder**: Assemble, review, and adjust a team consisting of up to 6 members with integrated **Offensive Type Coverage Analysis**.
- **Counter Analyzer**: A dedicated tool to analyze individual Pokémon's defensive weaknesses and resistances, helping you identify the best counters for any threat.
- **Modern Glassmorphic UI**: Beautiful design tailored completely with vanilla CSS, focusing on dark aesthetics with responsive interactions and dynamic typing colors.

---

## 🛠 Tech Stack & Architecture

- **Framework**: `Next.js` (App Router)
- **Language**: `TypeScript`
- **Styling**: `Vanilla CSS` (CSS Modules + Global variables)
- **Persistance**: Dual-mode storage (Client-side `localStorage` or Server-side `JSON` via Next.js Server Actions).
- **Data Source**: Data is pulled from the official [PokéAPI](https://pokeapi.co/).
- **Architecture (SSG)**: To achieve instant load times and reduce external API dependency on client devices, the application uses **Static Site Generation**. During the build process (`prebuild`), a custom script connects to PokéAPI, downloading data for all species, their types, sprites, and the comprehensive type effectiveness chart. This data is bundled organically as local JSON data maps which are served seamlessly and statically to the clients.

---

## 🐳 Self-Hosting (Docker)

You don't need to clone the repository or manually build the application from source. A production-ready Docker image is continuously published to the GitHub Container Registry (`ghcr.io`).

### Supported Architectures
The Docker image is built using a multi-architecture process, meaning it runs natively on both:
- **`linux/amd64`** (Standard PCs, Desktop, Cloud VPS)
- **`linux/arm64`** (Raspberry Pi, Apple Silicon, ARM Servers)

### Quick Start with Docker Compose

An example `docker-compose.yml` file is provided in this repository. To enable server-side persistence (so your team is saved on the server instead of just your browser), use the following configuration:

```yaml
services:
  poke-planner:
    image: ghcr.io/kardam00n/pokeplanner:latest
    container_name: poke-planner
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - APP_MODE=server        # Use 'server' for file-based persistence
      - DATA_PATH=/app/data     # Path inside the container for data
    volumes:
      - ./poke-data:/app/data   # Mount a local folder for persistent storage
```

**Environment Variables:**
- `NODE_ENV=production`: Project optimization.
- `APP_MODE`: 
  - `local` (default): Saves data in the user's browser (`localStorage`).
  - `server`: Saves data in a `team.json` file on the server (ideal for shared/hosted instances).
- `DATA_PATH`: The directory where `team.json` will be stored (only relevant if `APP_MODE=server`).

### Running the container:
1. Copy the code snippet above and save it anywhere as `docker-compose.yml`.
2. Run the following command in the same directory:
   ```bash
   docker compose up -d
   ```
3. Open `http://localhost:3000` in your browser.

---

## 💻 Local Development

Follow these steps to run the application locally on your machine.

### Prerequisites
Make sure you have Node.js (v18+ recommended) and `npm` installed.

### 1. Install dependencies
```bash
npm install
```

### 2. Fetch PokeAPI Data (Required before first run)
Data is ignored from Git directly. You must fetch the local JSON database via the custom Node.js script.
*(Note: This step is automatically run before `npm run build` as well).*
```bash
npm run fetch-data
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🛡️ Content Security Policy

This app utilizes strict security measures via Next.js Headers (`next.config.ts`), including restrictive CSP policies adjusted exclusively for trusted origins to prevent supply-chain and XSS vulnerabilities.
