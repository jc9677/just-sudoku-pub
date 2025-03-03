/**
 * Sudoku Solver
 * Contains algorithms to solve Sudoku puzzles and provide hints
 */
class SudokuSolver {
  constructor() {
    this.size = 9;
    this.boxSize = 3;
  }

  /**
   * Solve a Sudoku puzzle using backtracking algorithm
   * @param {Array} board - The puzzle to solve (0 = empty cell)
   * @returns {Array|null} The solved puzzle or null if no solution exists
   */
  solve(board) {
    // Create a deep copy of the board to avoid modifying the original
    const boardCopy = JSON.parse(JSON.stringify(board));
    
    if (this.solveBoard(boardCopy)) {
      return boardCopy;
    }
    
    return null; // No solution found
  }

  /**
   * Recursive backtracking algorithm to solve the board
   * @param {Array} board - The board to solve
   * @returns {boolean} Whether the board was successfully solved
   */
  solveBoard(board) {
    // Find an empty cell
    const emptyCell = this.findEmptyCell(board);
    
    // If no empty cell is found, the puzzle is solved
    if (!emptyCell) {
      return true;
    }
    
    const [row, col] = emptyCell;
    
    // Try each number 1-9
    for (let num = 1; num <= 9; num++) {
      if (this.isValidPlacement(board, row, col, num)) {
        // Place the number
        board[row][col] = num;
        
        // Recursively try to solve the rest of the board
        if (this.solveBoard(board)) {
          return true;
        }
        
        // If we couldn't solve with this number, backtrack
        board[row][col] = 0;
      }
    }
    
    // If no number worked, the puzzle is unsolvable from this state
    return false;
  }

  /**
   * Find the first empty cell in the board
   * @param {Array} board - The current board
   * @returns {Array|null} [row, col] of the empty cell, or null if none found
   */
  findEmptyCell(board) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    
    return null; // No empty cells found
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
      if (board[row][i] === num) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < this.size; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / this.boxSize) * this.boxSize;
    const boxCol = Math.floor(col / this.boxSize) * this.boxSize;
    
    for (let i = 0; i < this.boxSize; i++) {
      for (let j = 0; j < this.boxSize; j++) {
        if (board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Get a hint for the next cell to fill
   * @param {Array} board - The current board
   * @returns {Object|null} An object with row, col, and value of the hint, or null if board is solved
   */
  getHint(board) {
    // Find an empty cell
    const emptyCell = this.findEmptyCell(board);
    
    if (!emptyCell) {
      return null; // Board is already solved
    }
    
    const [row, col] = emptyCell;
    
    // Create a copy of the board to solve
    const boardCopy = JSON.parse(JSON.stringify(board));
    
    // Solve the board
    if (this.solveBoard(boardCopy)) {
      // Return the value from the solved board
      return {
        row: row,
        col: col,
        value: boardCopy[row][col]
      };
    }
    
    return null; // No solution found
  }

  /**
   * Check if the current board state is valid (no contradictions)
   * @param {Array} board - The current board
   * @returns {boolean} Whether the board is in a valid state
   */
  isValidBoard(board) {
    // Check rows
    for (let row = 0; row < this.size; row++) {
      const seen = new Set();
      for (let col = 0; col < this.size; col++) {
        const value = board[row][col];
        if (value !== 0) {
          if (seen.has(value)) {
            return false;
          }
          seen.add(value);
        }
      }
    }
    
    // Check columns
    for (let col = 0; col < this.size; col++) {
      const seen = new Set();
      for (let row = 0; row < this.size; row++) {
        const value = board[row][col];
        if (value !== 0) {
          if (seen.has(value)) {
            return false;
          }
          seen.add(value);
        }
      }
    }
    
    // Check boxes
    for (let boxRow = 0; boxRow < this.size; boxRow += this.boxSize) {
      for (let boxCol = 0; boxCol < this.size; boxCol += this.boxSize) {
        const seen = new Set();
        for (let row = 0; row < this.boxSize; row++) {
          for (let col = 0; col < this.boxSize; col++) {
            const value = board[boxRow + row][boxCol + col];
            if (value !== 0) {
              if (seen.has(value)) {
                return false;
              }
              seen.add(value);
            }
          }
        }
      }
    }
    
    return true;
  }

  /**
   * Check if the board is completely filled and valid
   * @param {Array} board - The current board
   * @returns {boolean} Whether the board is fully solved
   */
  isSolved(board) {
    // Check if all cells are filled
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] === 0) {
          return false;
        }
      }
    }
    
    // Check if the board is valid
    return this.isValidBoard(board);
  }
}