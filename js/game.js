/**
 * Sudoku Game
 * Main game logic that manages the state of the game
 */
class SudokuGame {
  constructor() {
    this.generator = new SudokuGenerator();
    this.solver = new SudokuSolver();
    this.board = [];
    this.solution = [];
    this.initialBoard = [];
    this.currentDifficulty = 'medium';
    this.selectedCell = null;
    this.gameActive = false;
    this.startTime = null;
    this.timerInterval = null;
    this.elapsedTime = 0;
    
    // Event system
    this.events = {};
  }

  /**
   * Initialize a new game with the specified difficulty
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   */
  newGame(difficulty = 'medium') {
    this.currentDifficulty = difficulty;
    
    // Generate a new puzzle
    const { puzzle, solution } = this.generator.generate(difficulty);
    this.board = puzzle;
    this.solution = solution;
    
    // Keep a copy of the initial board for highlighting original cells
    this.initialBoard = JSON.parse(JSON.stringify(puzzle));
    
    // Reset game state
    this.selectedCell = null;
    this.gameActive = true;
    
    // Restart timer
    this.resetTimer();
    this.startTimer();
    
    // Trigger board updated event
    this.trigger('boardUpdated');
    this.trigger('gameStarted');
  }

  /**
   * Place a number in the selected cell
   * @param {number} value - The number to place (1-9, or 0 to clear)
   * @returns {boolean} Whether the placement was successful
   */
  placeNumber(value) {
    if (!this.gameActive || !this.selectedCell) {
      return false;
    }
    
    const [row, col] = this.selectedCell;
    
    // Check if the cell is an initial cell (fixed)
    if (this.initialBoard[row][col] !== 0) {
      return false;
    }
    
    // Place the number
    this.board[row][col] = value;
    
    // Check for win
    if (this.solver.isSolved(this.board)) {
      this.gameWon();
    }
    
    // Trigger board updated event
    this.trigger('boardUpdated');
    this.trigger('cellUpdated', { row, col, value });
    
    return true;
  }

  /**
   * Select a cell on the board
   * @param {number} row - Row index
   * @param {number} col - Column index
   */
  selectCell(row, col) {
    if (!this.gameActive) {
      return;
    }
    
    this.selectedCell = [row, col];
    this.trigger('cellSelected', { row, col });
  }

  /**
   * Get a hint for the current game state
   * @returns {Object|null} Information about the hint, or null if no hint is available
   */
  getHint() {
    if (!this.gameActive) {
      return null;
    }
    
    const hint = this.solver.getHint(this.board);
    
    if (hint) {
      // Auto-fill the hint
      this.board[hint.row][hint.col] = hint.value;
      
      // Check for win
      if (this.solver.isSolved(this.board)) {
        this.gameWon();
      }
      
      // Trigger events
      this.trigger('boardUpdated');
      this.trigger('hintUsed', hint);
      this.trigger('cellUpdated', { row: hint.row, col: hint.col, value: hint.value });
      
      return hint;
    }
    
    return null;
  }

  /**
   * Check if a specific value in a cell is correct according to the solution
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} Whether the current value is correct
   */
  isCellValueCorrect(row, col) {
    // If the cell is empty, it's not considered incorrect
    if (this.board[row][col] === 0) {
      return true;
    }
    
    return this.board[row][col] === this.solution[row][col];
  }

  /**
   * Check if the cell is an initial cell from the puzzle generation
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} Whether the cell is an initial cell
   */
  isInitialCell(row, col) {
    return this.initialBoard[row][col] !== 0;
  }

  /**
   * Handle game win condition
   */
  gameWon() {
    this.gameActive = false;
    this.stopTimer();
    this.trigger('gameWon', { time: this.elapsedTime });
  }

  /**
   * Reset the game timer
   */
  resetTimer() {
    this.stopTimer();
    this.elapsedTime = 0;
    this.startTime = null;
    this.trigger('timerUpdated', { time: this.elapsedTime });
  }

  /**
   * Start the game timer
   */
  startTimer() {
    this.startTime = Date.now() - this.elapsedTime;
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.trigger('timerUpdated', { time: this.elapsedTime });
    }, 1000);
  }

  /**
   * Stop the game timer
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Save the current game state to local storage
   */
  saveGame() {
    const gameState = {
      board: this.board,
      solution: this.solution,
      initialBoard: this.initialBoard,
      currentDifficulty: this.currentDifficulty,
      elapsedTime: this.elapsedTime,
      gameActive: this.gameActive
    };
    
    localStorage.setItem('sudoku-game', JSON.stringify(gameState));
    this.trigger('gameSaved');
  }

  /**
   * Load a saved game from local storage
   * @returns {boolean} Whether a game was successfully loaded
   */
  loadGame() {
    const saved = localStorage.getItem('sudoku-game');
    
    if (saved) {
      try {
        const gameState = JSON.parse(saved);
        
        this.board = gameState.board;
        this.solution = gameState.solution;
        this.initialBoard = gameState.initialBoard;
        this.currentDifficulty = gameState.currentDifficulty;
        this.elapsedTime = gameState.elapsedTime;
        this.gameActive = gameState.gameActive;
        
        // Reset selected cell
        this.selectedCell = null;
        
        // Restart timer if game is active
        this.resetTimer();
        if (this.gameActive) {
          this.startTimer();
        }
        
        this.trigger('boardUpdated');
        this.trigger('gameLoaded');
        
        return true;
      } catch (e) {
        console.error('Error loading saved game:', e);
        return false;
      }
    }
    
    return false;
  }

  /**
   * Format time in MM:SS format
   * @param {number} timeMs - Time in milliseconds
   * @returns {string} Formatted time string
   */
  formatTime(timeMs) {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Subscribe to a game event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
  }

  /**
   * Trigger a game event
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  trigger(event, data = {}) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}