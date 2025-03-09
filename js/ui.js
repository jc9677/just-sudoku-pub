/**
 * Sudoku UI
 * Handles the user interface and interactions
 */
class SudokuUI {
  constructor(game) {
    this.game = game;
    this.boardElement = document.getElementById('game-board');
    this.difficultySelect = document.getElementById('difficulty');
    this.newGameButton = document.getElementById('new-game');
    this.hintButton = document.getElementById('hint');
    this.timerElement = document.getElementById('timer');
    this.messageElement = document.getElementById('message');
    this.numberButtons = document.querySelectorAll('.number');
    
    this.setupEventListeners();
    this.setupGameEventHandlers();
  }

  /**
   * Setup DOM event listeners
   */
  setupEventListeners() {
    // Difficulty selection
    this.difficultySelect.addEventListener('change', () => {
      this.showConfirmationMessage('Start a new game?', () => {
        this.game.newGame(this.difficultySelect.value);
      });
    });
    
    // New game button
    this.newGameButton.addEventListener('click', () => {
      this.showConfirmationMessage('Start a new game?', () => {
        this.game.newGame(this.difficultySelect.value);
      });
    });
    
    // Hint button
    this.hintButton.addEventListener('click', () => {
      this.game.getHint();
    });
    
    // Number buttons
    this.numberButtons.forEach(button => {
      button.addEventListener('click', () => {
        const value = parseInt(button.dataset.number, 10);
        this.game.placeNumber(value);
      });
    });
    
    // Auto-save game when window is closed or refreshed
    window.addEventListener('beforeunload', () => {
      this.game.saveGame();
    });
    
    // Keyboard support
    document.addEventListener('keydown', e => {
      if (this.game.selectedCell) {
        // Numbers 1-9
        if (e.key >= '1' && e.key <= '9') {
          this.game.placeNumber(parseInt(e.key, 10));
        } 
        // Backspace, Delete, or 0
        else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
          this.game.placeNumber(0);
        }
        // Arrow keys
        else if (e.key.startsWith('Arrow')) {
          const [row, col] = this.game.selectedCell;
          let newRow = row;
          let newCol = col;
          
          switch (e.key) {
            case 'ArrowUp':
              newRow = Math.max(0, row - 1);
              break;
            case 'ArrowDown':
              newRow = Math.min(8, row + 1);
              break;
            case 'ArrowLeft':
              newCol = Math.max(0, col - 1);
              break;
            case 'ArrowRight':
              newCol = Math.min(8, col + 1);
              break;
          }
          
          if (newRow !== row || newCol !== col) {
            this.game.selectCell(newRow, newCol);
          }
          
          e.preventDefault();
        }
      }
    });
  }

  /**
   * Setup game event handlers
   */
  setupGameEventHandlers() {
    // Board updated event
    this.game.on('boardUpdated', () => {
      this.renderBoard();
      this.updateNumberButtonStates(); // Add this line
    });
    
    // Cell selected event
    this.game.on('cellSelected', data => {
      this.highlightCell(data.row, data.col);
    });
    
    // Timer updated event
    this.game.on('timerUpdated', data => {
      this.timerElement.textContent = this.game.formatTime(data.time);
    });
    
    // Game won event
    this.game.on('gameWon', data => {
      this.showSuccessMessage(`You solved it in ${this.game.formatTime(data.time)}!`);
    });
    
    // Hint used event
    this.game.on('hintUsed', data => {
      this.flashCellAsHint(data.row, data.col);
    });
  }

  /**
   * Render the Sudoku board
   */
  renderBoard() {
    // Clear the board
    this.boardElement.innerHTML = '';
    
    // Create cells
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        
        // Add value if not empty
        const value = this.game.board[row][col];
        if (value !== 0) {
          cell.textContent = value;
        }
        
        // Add classes for styling
        if (this.game.isInitialCell(row, col)) {
          cell.classList.add('fixed');
        } else if (value !== 0 && !this.game.isCellValueCorrect(row, col)) {
          cell.classList.add('error');
        }
        
        // Add click handler
        cell.addEventListener('click', () => {
          this.game.selectCell(row, col);
        });
        
        // Add cell to the board
        this.boardElement.appendChild(cell);
      }
    }
    
    // Highlight selected cell if there is one
    if (this.game.selectedCell) {
      this.highlightCell(this.game.selectedCell[0], this.game.selectedCell[1]);
    }

    // Add at the end of renderBoard
    this.updateNumberButtonStates();
  }

  /**
   * Highlight a selected cell
   * @param {number} row - Row index
   * @param {number} col - Column index
   */
  highlightCell(row, col) {
    // Remove highlight from all cells
    const cells = this.boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.classList.remove('selected');
      cell.classList.remove('highlighted');
      cell.classList.remove('same-value');
      // Reset text color back to default
      cell.style.color = '';
    });
    
    // Get the index of the selected cell in the flat array
    const selectedIndex = row * 9 + col;
    
    // Highlight the selected cell
    cells[selectedIndex].classList.add('selected');
    
    // Highlight row, column, and box
    for (let i = 0; i < 9; i++) {
      // Highlight row
      cells[row * 9 + i].classList.add('highlighted');
      
      // Highlight column
      cells[i * 9 + col].classList.add('highlighted');
    }
    
    // Highlight box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellIndex = (boxRow + i) * 9 + (boxCol + j);
        cells[cellIndex].classList.add('highlighted');
      }
    }
    
    // Highlight cells with the same value
    const selectedValue = this.game.board[row][col];
    if (selectedValue !== 0) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (this.game.board[r][c] === selectedValue) {
            const index = r * 9 + c;
            cells[index].classList.add('same-value');
            // Set text color to yellow for cells with the same value
            cells[index].style.color = 'yellow';
          }
        }
      }
    }
  }

  /**
   * Show a success message
   * @param {string} message - The message to show
   */
  showSuccessMessage(message) {
    this.messageElement.textContent = message;
    this.messageElement.className = 'message success';
    this.messageElement.classList.remove('hidden');
    
    setTimeout(() => {
      this.messageElement.classList.add('hidden');
    }, 5000);
  }

  /**
   * Show an error message
   * @param {string} message - The message to show
   */
  showErrorMessage(message) {
    this.messageElement.textContent = message;
    this.messageElement.className = 'message error';
    this.messageElement.classList.remove('hidden');
    
    setTimeout(() => {
      this.messageElement.classList.add('hidden');
    }, 5000);
  }

  /**
   * Show a confirmation message with action buttons
   * @param {string} message - The message to show
   * @param {Function} confirmCallback - Callback to run when confirmed
   */
  showConfirmationMessage(message, confirmCallback) {
    // Clear any existing message
    this.messageElement.innerHTML = '';
    
    // Add message text
    const textSpan = document.createElement('span');
    textSpan.textContent = message + ' ';
    this.messageElement.appendChild(textSpan);
    
    // Add confirm button
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Yes';
    confirmButton.addEventListener('click', () => {
      confirmCallback();
      this.messageElement.classList.add('hidden');
    });
    
    // Add cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'No';
    cancelButton.addEventListener('click', () => {
      this.messageElement.classList.add('hidden');
    });
    
    // Add buttons to message
    this.messageElement.appendChild(confirmButton);
    this.messageElement.appendChild(document.createTextNode(' '));
    this.messageElement.appendChild(cancelButton);
    
    // Show message
    this.messageElement.className = 'message';
    this.messageElement.classList.remove('hidden');
  }

  /**
   * Flash a cell as a hint
   * @param {number} row - Row index
   * @param {number} col - Column index
   */
  flashCellAsHint(row, col) {
    const cells = this.boardElement.querySelectorAll('.cell');
    const cellIndex = row * 9 + col;
    const cell = cells[cellIndex];
    
    // Add hint class for animation
    cell.classList.add('hint');
    
    // Remove hint class after animation
    setTimeout(() => {
      cell.classList.remove('hint');
    }, 2000);
  }

  /**
   * Update number button states based on their usage count
   */
  updateNumberButtonStates() {
    // Count occurrences of each number
    const counts = new Array(10).fill(0);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = this.game.board[row][col];
        if (value !== 0) {
          counts[value]++;
        }
      }
    }
    
    // Update button states
    this.numberButtons.forEach(button => {
      const number = parseInt(button.dataset.number, 10);
      button.disabled = counts[number] >= 9;
    });
  }
}