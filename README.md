# Pokémon Explorer 🚀

A beautifully designed, highly interactive web application built with **Next.js** and **TypeScript** that allows users to explore the vast world of Pokémon using the public [PokéAPI](https://pokeapi.co/).

## ✨ Features

- **Dynamic Grid Interface:** View a beautiful grid of Pokémon cards, complete with official artwork and dynamic coloring based on their primary elemental type.
- **Search & Filter:** Search for specific Pokémon by name instantly, or filter the entire grid by any of the 20+ specific elemental types (including Fairy and Stellar!).
- **Infinite Scrolling Pagination:** Seamlessly load more Pokémon as you scroll to the bottom of the list.
- **Detailed Views:** Click on any Pokémon card to view an in-depth breakdown of their specific stats, abilities, weight, and height.
- **Custom Swagger API Docs:** Features a built-in `/api-docs` route rendering an interactive Swagger UI that precisely documents the subset of PokéAPI endpoints consumed by this application.
- **Responsive Design:** Completely mobile-friendly UI that scales perfectly across desktops, tablets, and phones.

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla CSS Modules with a custom Design System (Dark/Light aesthetic support)
- **Data Fetching:** Native `fetch` API directly consuming PokéAPI

## 🚀 Getting Started

To run this project locally on your machine, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev -- -p 3005
```
Open [http://localhost:3005](http://localhost:3005) in your browser to see the result.

### 3. Production Build (Recommended)
To test the optimized, lightning-fast production build:
```bash
npm run build
npm run start -- -p 3005
```

## 📚 API Documentation
This project includes built-in Swagger UI documentation for the endpoints it consumes. Once the server is running, you can interact with it by visiting:
[http://localhost:3005/api-docs](http://localhost:3005/api-docs)

---
*Built for the Pipeline AI Frontend Engineering Assignment.*
