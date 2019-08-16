import Player from "./Player";

interface Disc {
  color: string;
}

class Slot {
  displayElement: HTMLDivElement;

  isEmpty: boolean = true;

  row: number;
  col: number;

  disc: Disc = { color: "" };

  constructor(row: number, col: number, displayElement: HTMLDivElement) {
    this.row = row;
    this.col = col;
    this.displayElement = displayElement;
  }

  discInserted(color): void {
    this.disc.color = color;
    this.isEmpty = false;
    this.displayElement.style.backgroundColor = this.disc.color;
  }
}

export default class Board {
  SIZE: number = 8;

  display_grid: HTMLDivElement[][];
  slots: Slot[][];

  inputs: HTMLDivElement[] = [];

  currentPlayer: Player;
  players: Player[] = [];

  winner: Player | undefined;

  constructor() {
    this.display_grid = new Array<Array<HTMLDivElement>>();
    this.slots = new Array<Array<Slot>>();
    this.initPlayers();
    this.initBoard();
    this.bindSlotsToGrid();
    this.initInputs();
    this.display();
    this.currentPlayer = this.players[
      Math.floor(Math.random() * this.players.length)
    ];
    this.winner = undefined;
  }

  initPlayers() {
    this.players.push(new Player(1, "hsl(0, 85%, 65%)"));
    this.players.push(new Player(2, "hsl(240, 85%, 65%)"));
  }

  initInputs() {
    const inputsDisplay = document.getElementById("inputs-display");

    if (inputsDisplay) inputsDisplay.innerHTML = "";

    for (let col = 0; col < this.SIZE; col++) {
      const input = document.createElement("div");

      input.className = "input";

      input.onmouseenter = () => {
        input.style.backgroundColor = this.currentPlayer.discColor;
        this.displayFirstEmptyInColumn(col);
      };

      input.addEventListener("mouseleave", () => {
        input.style.backgroundColor = "#333333";
        this.hideFirstEmptyInColumn(col);
      });

      input.addEventListener("click", () => {
        this.insertDisc(col);
        input!.onmouseenter();
      });

      if (inputsDisplay) inputsDisplay.appendChild(input);
    }
  }

  displayFirstEmptyInColumn(col) {
    const slot = this.firstEmptyInColumn(col);
    if (slot) {
      slot.displayElement.style.opacity = "0.5";
      slot.displayElement.style.backgroundColor = this.currentPlayer.discColor;
    }
  }

  hideFirstEmptyInColumn(col) {
    const slot = this.firstEmptyInColumn(col);
    if (slot) {
      slot.displayElement.style.opacity = "1";
      slot.displayElement.style.backgroundColor = "#999999";
    }
  }

  insertDisc(col) {
    const slot = this.firstEmptyInColumn(col);
    if (slot) {
      slot.displayElement.style.opacity = "1";
      slot.discInserted(this.currentPlayer.discColor);

      const { row, col } = slot;
      if (this.fourConsecutives({ row, col }) || this.full()) {
        this.finished();
      } else {
        this.nextPlayer();
      }
    }
  }

  initBoard() {
    this.display_grid = new Array<Array<HTMLDivElement>>();
    for (let row = 0; row < this.SIZE; row++) {
      this.display_grid.push([]);
      for (let col = 0; col < this.SIZE; col++) {
        const slot = document.createElement("div");
        slot.className = "slot";

        this.display_grid[row].push(slot);
      }
    }
  }

  bindSlotsToGrid() {
    this.slots = new Array<Array<Slot>>();
    for (let row = 0; row < this.SIZE; row++) {
      this.slots.push([]);
      for (let col = 0; col < this.SIZE; col++) {
        const slot = new Slot(row, col, this.display_grid[row][col]);

        this.slots[row].push(slot);
      }
    }
  }

  display() {
    const board = document.getElementById("board") || undefined;
    const playerDisplay = document.getElementById("current-player");

    if (board) {
      board.innerHTML = "";
      board.style.opacity = "1";

      for (let row of this.display_grid) {
        const rowContainer = document.createElement("div");

        rowContainer.className = "row";

        for (let slot of row) {
          rowContainer.appendChild(slot);
        }

        board.appendChild(rowContainer);
      }
    }
  }

  firstEmptyInColumn(col: number): Slot | undefined {
    for (let row = 0; row < this.SIZE; row++) {
      const slot = this.slots[row][col];
      if (slot.isEmpty) {
        return slot;
      }
    }
    return undefined;
  }

  nextPlayer() {
    this.currentPlayer = this.players[
      this.currentPlayer.id % this.players.length
    ];
  }

  fourConsecutives(positition) {
    if (
      this.fourInRow(positition) ||
      this.fourInColumn(positition) ||
      this.fourInUpDiagonal(positition) ||
      this.fourInDownDiagonal(positition)
    ) {
      this.winner = this.currentPlayer;
      return true;
    }

    return false;
  }

  fourInRow({ row }) {
    let consecutives = 0;
    for (let col = 0; col < this.SIZE; col++) {
      const slot = this.slots[row][col];
      if (slot) {
        if (slot.disc.color === this.currentPlayer.discColor) {
          consecutives++;
        } else {
          consecutives = 0;
        }
      }
      if (consecutives === 4) {
        return true;
      }
    }
    return false;
  }

  fourInColumn({ col }) {
    let consecutives = 0;
    for (let row = 0; row < this.SIZE; row++) {
      const slot = this.slots[row][col];
      if (slot) {
        if (slot.disc.color === this.currentPlayer.discColor) {
          consecutives++;
        } else {
          consecutives = 0;
        }
      }
      if (consecutives === 4) {
        return true;
      }
    }
    return false;
  }

  fourInUpDiagonal({ row, col }) {
    const startingColumn = col > row ? col - row : 0;
    const startingRow = row > col ? row - col : 0;

    let consecutives = 0;
    for (
      let i = startingRow, j = startingColumn;
      i < this.SIZE && j < this.SIZE;
      i++, j++
    ) {
      const slot = this.slots[i][j];
      if (slot) {
        if (slot.disc.color === this.currentPlayer.discColor) {
          consecutives++;
        } else {
          consecutives = 0;
        }
      }
      if (consecutives === 4) {
        return true;
      }
    }

    return false;
  }

  fourInDownDiagonal({ row, col }) {
    const mirroredCol = this.SIZE - 1 - col;
    const startingColumn = mirroredCol > row ? mirroredCol - row : 0;
    const startingRow = row > mirroredCol ? row - mirroredCol : 0;

    let consecutives = 0;
    let mirrored = [ ...this.slots ].map(row => row.reverse());
    for (
      let i = startingRow, j = startingColumn;
      i < this.SIZE && j < this.SIZE;
      i++, j++
    ) {
      const slot = mirrored[i][j];
      if (slot) {
        if (slot.disc.color === this.currentPlayer.discColor) {
          consecutives++;
        } else {
          consecutives = 0;
        }
      }
      if (consecutives === 4) {
        return true;
      }
    }

    mirrored = [ ...mirrored ].map(row => row.reverse());
    return false;
  }

  full() {
    return !this.slots.some(row => row.some(slot => slot.isEmpty));
  }

  finished() {
    const winnerDisplay = document.getElementById("winner-display");
    if (this.winner && winnerDisplay) {
      winnerDisplay.innerText = this.winner.name + " WINS";
    } else if (winnerDisplay) {
      winnerDisplay.innerText = "TIE";
    }
  }
}
