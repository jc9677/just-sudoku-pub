# Sudoku Puzzle Game

A browser-based Sudoku puzzle game with a dark theme and purple accents, designed to be hosted on GitHub Pages.

## Features

- Dark theme with purple accent colors
- Sudoku puzzle generation with three difficulty levels
- Interactive gameplay with keyboard support
- Hint system to help when stuck
- Timer to track solving time
- Auto-save functionality
- Mobile-responsive design

## Play the Game

This game is designed to be hosted on GitHub Pages. Once deployed, you can access it at: 
`https://yourusername.github.io/sudoku-puzzle/`

## Development

### Directory Structure

- `index.html` - Main HTML file
- `css/` - Stylesheets
  - `main.css` - Core styling
  - `theme.css` - Dark theme with purple accents
  - `grid.css` - Sudoku grid styling
- `js/` - JavaScript modules
  - `generator.js` - Puzzle generation algorithm
  - `solver.js` - Solving and hint algorithm
  - `game.js` - Core game logic
  - `ui.js` - User interface handling
  - `storage.js` - Local storage functionality
  - `main.js` - Application entry point

### Local Development

To run the game locally:

1. Clone the repository
2. Open `index.html` in your browser

No build steps are required as the game uses vanilla JavaScript, HTML, and CSS.

## How to Play

1. Select a difficulty level from the dropdown menu
2. Click on a cell to select it
3. Use the number pad buttons or your keyboard (1-9) to enter a number
4. Use the "Clear" button or keyboard's 0, Backspace, or Delete keys to clear a cell
5. If you get stuck, click the "Hint" button for assistance
6. The game will automatically validate your solution when complete

## License

MIT License