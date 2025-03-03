/**
 * Sudoku Storage
 * Handles saving and loading game state from localStorage
 */
class SudokuStorage {
  constructor() {
    this.storageKey = 'sudoku-game';
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} Whether localStorage is available
   */
  isStorageAvailable() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Save game state to localStorage
   * @param {Object} gameState - Current game state
   * @returns {boolean} Whether the save was successful
   */
  saveGame(gameState) {
    if (!this.isStorageAvailable()) {
      return false;
    }
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(gameState));
      return true;
    } catch (e) {
      console.error('Error saving game:', e);
      return false;
    }
  }

  /**
   * Load game state from localStorage
   * @returns {Object|null} The saved game state, or null if none found
   */
  loadGame() {
    if (!this.isStorageAvailable()) {
      return null;
    }
    
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading saved game:', e);
      return null;
    }
  }

  /**
   * Clear saved game from localStorage
   * @returns {boolean} Whether the clear was successful
   */
  clearSavedGame() {
    if (!this.isStorageAvailable()) {
      return false;
    }
    
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (e) {
      console.error('Error clearing saved game:', e);
      return false;
    }
  }

  /**
   * Save settings to localStorage
   * @param {Object} settings - Settings to save
   * @returns {boolean} Whether the save was successful
   */
  saveSettings(settings) {
    if (!this.isStorageAvailable()) {
      return false;
    }
    
    try {
      localStorage.setItem(this.storageKey + '-settings', JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Error saving settings:', e);
      return false;
    }
  }

  /**
   * Load settings from localStorage
   * @returns {Object|null} The saved settings, or null if none found
   */
  loadSettings() {
    if (!this.isStorageAvailable()) {
      return null;
    }
    
    try {
      const saved = localStorage.getItem(this.storageKey + '-settings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading saved settings:', e);
      return null;
    }
  }
}