/**
 * Main application entry point
 * Initializes the game and UI
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create game instance
  const game = new SudokuGame();
  
  // Create UI instance
  const ui = new SudokuUI(game);
  
  // Create storage instance
  const storage = new SudokuStorage();
  
  // Try to load a saved game
  const savedGameLoaded = game.loadGame();
  
  // If no saved game, start a new one
  if (!savedGameLoaded) {
    game.newGame('medium');
  }
  
  // Load any saved settings
  const savedSettings = storage.loadSettings();
  if (savedSettings) {
    // Apply settings (e.g., difficulty preference)
    if (savedSettings.difficulty) {
      document.getElementById('difficulty').value = savedSettings.difficulty;
    }
  }
  
  // Listen for beforeunload to save game state
  window.addEventListener('beforeunload', () => {
    // Save current game
    game.saveGame();
    
    // Save settings
    const settings = {
      difficulty: document.getElementById('difficulty').value
    };
    storage.saveSettings(settings);
  });
});