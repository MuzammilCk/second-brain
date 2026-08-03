---
source: project-sync
project: samename
original-path: D:\projects\samename\README.md
synced: 2026-08-03
---

# Spotify Playlist Generator

A production-grade tool to search tracks and create playlists using the Spotify Web API.

## Requirements
- Node.js >= 20.x
- Spotify Developer Account (Client ID & Secret)

## Setup
1. Copy `config/example.env` to `.env` and fill in credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   npm start
   ```

## Architecture
See `ARCHITECTURE.md` (in artifacts) for design details.

## Usage
1. Open `http://localhost:8080/auth/login` to authenticate.
2. Use the endpoints to search and create playlists.
