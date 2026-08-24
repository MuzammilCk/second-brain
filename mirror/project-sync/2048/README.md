---
source: github-api
project: "2048"
language: "JavaScript"
updated: 2026-01-31
synced: 2026-08-24
url: "https://github.com/MuzammilCk/2048"
---

# 2048 Game - Professional Implementation

A clean, maintainable implementation of the popular 2048 game with smooth animations and professional architecture.

## Features

- **Clean Architecture**: Separation of concerns with dedicated classes for game logic, storage, UI rendering, and input handling
- **Smooth Animations**: CSS-based animations for tile movements, merges, and appearances
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Touch Support**: Swipe gestures for mobile gameplay
- **Local Storage**: Automatically saves your best score
- **Multiple Input Methods**: Arrow keys, WASD, Vim keys (hjkl)

## Architecture

### Core Classes

#### `GameManager`
- Central game controller managing game state and logic
- Handles tile movements, merging, and win/lose conditions
- Coordinates between Grid and UI Actuator

#### `Grid`
- Manages the 4x4 game board data structure
- Provides methods for cell operations and queries
- Handles tile insertion and removal

#### `Tile`
- Represents individual game tiles
- Tracks position, value, and merge state
- Maintains previous position for smooth animations

#### `HTMLActuator`
- Handles all DOM manipulation and rendering
- Updates UI in response to game state changes
- Manages animations using CSS classes and requestAnimationFrame

#### `StorageManager`
- Manages localStorage operations
- Persists and retrieves best score

#### `InputManager`
- Handles all user input (keyboard, touch, mouse)
- Maps input events to game actions
- Supports multiple control schemes

## Code Quality

- **Object-Oriented Design**: Proper use of ES6 classes
- **Single Responsibility**: Each class has a clear, focused purpose
- **Configuration Management**: Centralized configuration object
- **Efficient Rendering**: Uses requestAnimationFrame for smooth animations
- **Clean Code**: Well-commented, readable, and maintainable
- **No Global Pollution**: Minimal global scope usage

## How to Play

1. Open `index.html` in your web browser
2. Use arrow keys (or WASD/hjkl) to move tiles
3. Tiles with the same number merge when they touch
4. Goal: Create a 2048 tile!

## Browser Support

Works on all modern browsers that support ES6 classes and CSS animations.

## License

Free to use and modify.
# 2048
