# Pokémon Team Picker ⚡️

A modern, fast web application built to help you compose your dream Pokémon team of up to 6 members and analyze their offensive type coverage against all 18 Pokémon types.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![CSS](https://img.shields.io/badge/Vanilla_CSS-1572B6?style=flat-square&logo=css3&logoColor=white)

---

## 🚀 Live Demo

The application is hosted globally on Vercel for instant load times (SSG architecture).

👉 **[Link to hosted app will go here]**

---

## ✨ Features

- **Blazing Fast Search**: Autocompleting search bar querying a local, build-time generated dataset of **1288 Pokémon** (including base species, Mega Evolutions, Regional Forms, and other variations).
- **Interactive Team Grid**: Assemble, review, and adjust a team consisting of up to 6 members.
- **Offensive Type Coverage Analysis**: An interactive dashboard showing exactly which enemy typings your current team can hit for "Super Effective" (2x) damage, including visual indicators of which of your Pokémon acts as the counter.
- **Modern Glassmorphic UI**: Beautiful design tailored completely with vanilla CSS, focusing on dark aesthetics with responsive interactions and dynamic typing colors.

---

## 🛠 Tech Stack & Architecture

- **Framework**: `Next.js` (App Router)
- **Language**: `TypeScript`
- **Styling**: `Vanilla CSS` (CSS Modules + Global variables)
- **Data Source**: Data is pulled from the official [PokéAPI](https://pokeapi.co/).
- **Architecture (SSG)**: To achieve instant load times and reduce external API dependency on client devices, the application uses **Static Site Generation**. During the build process (`prebuild`), a custom script connects to PokéAPI, downloading data for all species, their types, sprites, and the comprehensive type effectiveness chart. This data is bundled organically as local JSON data maps which are served seamlessly and statically to the clients.

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
