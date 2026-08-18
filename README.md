# Pokémon Explorer 🚀

A beautifully designed, highly interactive web application built with **Next.js** and **TypeScript** that allows users to explore the vast world of Pokémon using the public PokéAPI.

## Features

- **Dynamic Grid Interface:** View a beautiful grid of Pokémon cards, complete with official artwork and dynamic coloring based on their primary elemental type.
- **Search & Filter:** Search for specific Pokémon by name instantly, or filter the entire grid by any of the 20+ specific elemental types.
- **Infinite Scrolling Pagination:** Seamlessly load more Pokémon as you scroll to the bottom of the list.
- **Detailed Views:** Click on any Pokémon card to view an in-depth breakdown of their specific stats, abilities, weight, and height. Shareable via URL (e.g., `/pokemon/pikachu`).
- **Global Sorting:** Sort all 1,300+ Pokémon instantly by Name, ID, HP, Attack, or Speed.
- **Compare Pokémon:** Select two Pokémon to view their stats side-by-side in a stunning modal that highlights the winner of each stat category.
- **Dark/Light Mode & Favorites:** Toggle beautiful dark mode and save your favorite Pokémon (persisted via `localStorage`).
- **Advanced Keyboard Accessibility:** Fully navigable without a mouse! Features include `/` to Search, `Arrow Keys` for grid navigation, Sequential Pokédex Browsing (`Left`/`Right` on detail pages), and hidden ARIA announcements for screen readers.
- **Responsive Design:** Completely mobile-friendly UI that scales perfectly across desktops, tablets, and phones.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla CSS Modules with a custom Design System (Dark/Light aesthetic support)
- **Icons:** Lucide React
- **Data Fetching:** Native `fetch` API

## API Used

- **External Data Source:** [PokéAPI (v2)](https://pokeapi.co/)
- **Image CDN:** jsDelivr (`cdn.jsdelivr.net/gh/PokeAPI/sprites@master`) to bypass official API rate limits on images.
- **Custom Documentation:** This project includes built-in Swagger UI documentation for the endpoints it consumes. Once the server is running, you can interact with it by visiting: [http://localhost:3005/api-docs](http://localhost:3005/api-docs)

## Installation

Ensure you have Node.js installed, then clone the repository and install the dependencies:

```bash
npm install
```

## Running Locally

To run the application in a local development environment:

```bash
npm run dev -- -p 3005
```
Open [http://localhost:3005](http://localhost:3005) in your browser. 

*For the optimized, lightning-fast production build, you can optionally run `npm run build` followed by `npm run start -- -p 3005`.*

## Project Structure

The application follows a clean, component-based architecture built natively on the Next.js App Router.

```text
src/
├── app/
│   ├── api-docs/          # Swagger UI Documentation Route
│   ├── pokemon/
│   │   └── [name]/        # Dynamic Detailed Pokémon Route
│   ├── globals.css        # Core Design System & Variables
│   └── page.tsx           # Main Hub & Global State Manager
├── components/
│   ├── PokemonCard.tsx    # Individual Rendered Card Component
│   ├── PokemonGrid.tsx    # Responsive Grid with Infinite Scroll
│   ├── CompareModal.tsx   # Side-by-Side Stat Comparison UI
│   └── SearchBar.tsx      # Live Filtering Search Component
├── services/
│   └── pokeapi.ts         # Centralized API Fetching Logic
├── data/
│   └── pokemon_stats.json # Local Cache for O(1) Global Sorting
└── types/
    └── pokemon.ts         # Strict TypeScript Interfaces
```

## Challenges Faced

1. **Global Sorting vs. API Rate Limits:** The rubric requested the ability to sort *all* Pokémon by stats like Attack, Speed, and HP. However, the PokéAPI `/pokemon` list endpoint does not return stat data, and fetching individual stat profiles for 1,300+ Pokémon dynamically triggered `ECONNRESET` rate-limiting blocks.
   - **Solution:** I wrote a custom background Node.js script (`fetch_stats.js`) that parsed raw CSV dumps from the PokéAPI GitHub repository to compile an offline, lightweight `pokemon_stats.json` cache. This allows the app to perform O(1) instant sorting across all 1,300 Pokémon without making a single external API request!
2. **Missing Sprite Images:** Newer Pokémon (IDs 10,000+) were missing from the standard `raw.githubusercontent` image paths because they hadn't been formally tagged in the PokéAPI releases.
   - **Solution:** I dynamically re-routed the image URLs to fetch directly from the `@master` branch of the `jsDelivr` CDN, guaranteeing 100% image coverage for every single Pokémon.
3. **Advanced Keyboard Navigation:** Implementing Arrow-Key navigation within a dynamic CSS Grid is notoriously difficult because the DOM order doesn't always strictly match the visual layout on different screen sizes.
   - **Solution:** I built a custom DOM-rect calculation algorithm that intercepts Arrow Keys and calculates the exact `x` and `y` coordinates of the cards on the screen to mathematically determine which card sits above or below the currently focused card.

## Future Improvements

1. **Backend Database for Persistence:** Currently, Favorites and Dark Mode preferences are stored entirely in `localStorage`. In the future, I would implement an authentication system (e.g., NextAuth) and a database (e.g., PostgreSQL via Prisma) to persist user preferences across different devices.
2. **Audio Integration (Pokémon Cries):** The PokéAPI provides access to the official audio files for Pokémon "Cries" (the sounds they make in the games). Adding a small audio player to the Detailed View would significantly enhance the immersive experience.
3. **Evolution Chains UI:** While we have detailed stats and moves, building a visual UI diagram that maps out a Pokémon's full evolution chain (e.g., Charmander -> Charmeleon -> Charizard) using the `/evolution-chain` API endpoint would be a highly requested feature for fans.
