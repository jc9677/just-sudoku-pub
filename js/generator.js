/**
 * Sudoku Generator
 * Handles the creation of valid Sudoku puzzles at various difficulty levels
 */
class SudokuGenerator {
  constructor() {
    this.size = 9;
    this.boxSize = 3;
  }

  /**
   * Generate a new Sudoku puzzle with the specified difficulty
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   * @returns {Array} 9x9 array representing the puzzle (0 = empty cell)
   */
  generate(difficulty = 'medium') {
    // Start with a solved board
    const solvedBoard = this.generateSolvedBoard();
    
    // Create a copy to remove numbers from
    const puzzle = JSON.parse(JSON.stringify(solvedBoard));
    
    // Determine how many cells to remove based on difficulty
    let cellsToRemove;
    switch(difficulty) {
      case 'easy':
        cellsToRemove = 40; // 41 clues
        break;
      case 'medium':
        cellsToRemove = 50; // 31 clues
        break;
      case 'hard':
        cellsToRemove = 60; // 21 clues
        break;
      default:
        cellsToRemove = 50;
    }
    
    // Randomly remove cells while ensuring the puzzle remains solvable
    this.removeCells(puzzle, cellsToRemove);
    
    return {
      puzzle: puzzle,
      solution: solvedBoard
    };
  }

  /**
   * Generate a completely solved Sudoku board
   * @returns {Array} 9x9 array with all cells filled correctly
   */
  generateSolvedBoard() {
    // Initialize empty board
    const board = Array(this.size).fill().map(() => Array(this.size).fill(0));
    
    // Fill the board using backtracking
    this.fillBoard(board);
    return board;
  }

  /**
   * Fill a Sudoku board using backtracking algorithm
   * @param {Array} board - The board to fill
   * @returns {boolean} Whether the board was successfully filled
   */
  fillBoard(board) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // Skip cells that are already filled
        if (board[row][col] !== 0) continue;
        
        // Try each number 1-9 in random order
        const numbers = this.getShuffledNumbers();
        for (const num of numbers) {
          // Check if this number can be placed here
          if (this.isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            
            // Recursively try to fill the rest of the board
            if (this.fillBoard(board)) {
              return true;
            }
            
            // If we couldn't fill the board with this number, backtrack
            board[row][col] = 0;
          }
        }
        
        // If we tried all numbers and none worked, we need to backtrack
        return false;
      }
    }
    
    // If we got through the entire board, it's filled correctly
    return true;
  }

  /**
   * Check if a number can be placed at the given position
   * @param {Array} board - The current board
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @param {number} num - Number to check
   * @returns {boolean} Whether the placement is valid
   */
  isValidPlacement(board, row, col, num) {
    // Check row
    for (let i = 0; i < this.size; i++) {
      if (board[row][i] === num) return false;
    }
    
    // Check column
    for (let i = 0; i < this.size; i++) {
      if (board[i][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / this.boxSize) * this.boxSize;
    const boxCol = Math.floor(col / this.boxSize) * this.boxSize;
    
    for (let i = 0; i < this.boxSize; i++) {
      for (let j = 0; j < this.boxSize; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    
    return true;
  }

  /**
   * Get an array of numbers 1-9 in random order
   * @returns {Array} Shuffled array of numbers 1-9
   */
  getShuffledNumbers() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    // Fisher-Yates shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    return numbers;
  }

  /**
   * Remove cells from a solved board to create a puzzle
   * @param {Array} board - The solved board to remove cells from
   * @param {number} count - Number of cells to remove
   */
  removeCells(board, count) {
    const positions = [];
    
    // Create a list of all positions
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        positions.push([row, col]);
      }
    }
    
    // Shuffle the positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Remove cells
    for (let i = 0; i < count; i++) {
      if (i < positions.length) {
        const [row, col] = positions[i];
        board[row][col] = 0;
      }
    }
  }
}