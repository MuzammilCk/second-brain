---
source: project-sync
project: life
original-path: D:\projects\life\README.md
synced: 2026-08-03
---

# LifeDesk

A GPU-accelerated, interactive Game of Life desktop wallpaper for Windows.

## Features
- **Real Wallpaper**: Runs behind desktop icons using native Windows APIs.
- **High Performance**: Optimized `Uint8Array` engine + Canvas/WebGL rendering. 
- **Interactive**: Draw cells with your mouse directly on the desktop.
- **Customizable**: Change rules (Conway, HighLife, Seeds), speed, and colors.
- **Persistence**: Saves your state and settings automatically.

## Controls
- **Space**: Pause/Resume
- **R**: Reset/Randomize
- **S**: Save State (Snapshot)
- **H**: Toggle Settings UI
- **Mouse Drag**: Draw cells

## Architecture
```mermaid
graph TD
    A[Electron Main Process] -->|Loading User32.dll| B(Native Binding / koffi)
    A -->|Spawns| C[WorkerW / Progman Logic]
    B -->|Finds & Attaches| C
    A -->|Loads| D[Renderer Process]
    D -->|Runs| E[LifeEngine JS]
    E -->|Updates| F[HTML5 Canvas]
    D -->|Input| G[Settings UI]
    G -->|Persists| H[IndexedDB / LocalStorage]
    
    subgraph Core Engine
    E -->|Uses| I[Uint8Array Grid]
    E -->|Uses| J[Lookup Tables]
    end
```
- **Engine**: Decoupled JS class using typed arrays and lookup tables.
- **Renderer**: HTML5 Canvas with optimized batch drawing.
- **Native**: Uses `koffi` to interface with `User32.dll` to find `WorkerW` and `SetParent` logic.

## Build
```bash
npm install
npm start # Dev
npm run dist # Build installer
```
