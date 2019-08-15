import Scoreboard from "./Scoreboard";
import Player from "./Player";

interface Disc {
  color: string;
}

class Slot {
  displayElement: HTMLDivElement;
  isEmpty: boolean = true;
  row: number;
  col: number;

  disc: Disc = { color: "none" };

  constructor(row: number, col: number, displayElement: HTMLDivElement) {
    this.row = row;
    this.col = col;
    this.displayElement = displayElement;
    this.isEmpty = true;
    displayElement.style.backgroundColor = this.disc.color;
  }

  clicked(color) {
    this.disc.color = color;
    this.isEmpty = false;
    this.displayElement.style.backgroundColor = this.disc.color;
    console.log(this.row, this.col);
  }
}

export default class Board {
  SIZE: number = 8;

  display_grid: HTMLDivElement[][];
  slots_grid: Slot[][];

  inputs: HTMLDivElement[];

  currentPlayer: Player;
  players: Player[] = [];

  scoreBoard: Scoreboard;
  winner: Player | undefined;

  state = {
    currentPlayer: this.currentPlayer
  };

  constructor() {
    this.display_grid = new Array<Array<HTMLDivElement>>();
    this.slots_grid = new Array<Array<Slot>>();
    this.initPlayers();
    this.initBoard();
    this.bindSlotsToGrid();
    this.initInputs();
    this.display();
    this.scoreBoard = new Scoreboard(this.players);
    this.scoreBoard.update();
    this.currentPlayer = this.players[
      Math.floor(Math.random() * this.players.length)
    ];
    this.winner = undefined;
  }

  /**
   * Inits players
   */
  initPlayers() {
    this.players.push(new Player(1, "hsl(0, 85%, 65%)"));
    this.players.push(new Player(2, "hsl(240, 85%, 65%)"));
    this.state = {
      currentPlayer: this.currentPlayer
    };
  }

  initInputs() {
    this.inputs = new Array<HTMLDivElement>();

    for (let col = 0; col < this.SIZE; col++) {
      const input = document.createElement("div");

      input.addEventListener("mouseenter", () => {
        input.style.backgroundColor = this.currentPlayer.discColor;
      });
      input.addEventListener("mouseleave", () => {
        input.style.backgroundColor = "#333333";
      });

      input.className = "input";
      input.setAttribute("column", col.toString());
      this.inputs.push(input);
    }

    const inputsDisplay = document.querySelector("#input");

    inputsDisplay.innerHTML = "";
    this.inputs.forEach(input => {
      if (inputsDisplay) inputsDisplay.appendChild(input);

      const col = input.getAttribute("column");
      input.addEventListener("mouseenter", () => {
        this.displayFirstEmptyInColumn(col);
      });
      input.addEventListener("mouseleave", () => {
        this.hideFirstEmptyInColumn(col);
      });
      const insertDisc = () => this.insertDisc(col);
      input.addEventListener("click", () => {
        this.insertDisc(col);
        input.style.backgroundColor = this.currentPlayer.discColor;
        this.displayFirstEmptyInColumn(col);
      });
    });
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
      slot.clicked(this.currentPlayer.discColor);

      const position = { row: slot.row, col: slot.col };
      console.log("position:", position);
      if (this.fourConsecutives(position) || this.full()) {
        this.finished();
      } else {
        this.nextPlayer();
      }
    }
  }
  /**
   * Inits board
   */
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
    this.slots_grid = new Array<Array<Slot>>();
    for (let row = 0; row < this.SIZE; row++) {
      this.slots_grid.push([]);
      for (let col = 0; col < this.SIZE; col++) {
        const slot = new Slot(row, col, this.display_grid[row][col]);

        this.slots_grid[row].push(slot);
      }
    }
  }

  /**
   * Displays board
   */
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

        // board.addEventListener("click", this.display);
        board.appendChild(rowContainer);
      }
    }

    // playerDisplay.innerText = this.currentPlayer.name;
  }

  update() {
    this.state.currentPlayer = this.currentPlayer;
  }

  displayBoard() {
    const board = document.getElementById("board");

    // board.style.zIndex = "1";
    // board.style.opacity = "1";

    this.hideScoreBoard();
  }

  hideBoard() {
    const board = document.getElementById("board");

    // board.style.zIndex = "-1";
    // board.style.opacity = "0";
  }

  displayScoreBoard() {
    const scoreBoard = document.getElementById("winner");

    scoreBoard.style.zIndex = "70";
    scoreBoard.style.opacity = "1";

    this.hideBoard();
  }

  hideScoreBoard() {
    const scoreBoard = document.getElementById("winner");

    scoreBoard.style.zIndex = "-1";
    scoreBoard.style.opacity = "0";
  }

  firstEmptyInColumn(col: number): Slot | undefined {
    for (let row = 0; row < this.SIZE; row++) {
      const slot = this.slots_grid[row][col];
      if (slot.isEmpty) {
        return slot;
      }
    }
    return undefined;
  }

  nextPlayer() {
    // switch (this.currentPlayer.discColor) {
    //   case "blue":
    //     this.currentPlayer = this.players[0];
    //     break;

    //   case "red":
    //     this.currentPlayer = this.players[1];
    //     break;

    //   default:
    //     break;
    // }
    // console.log("this.state.currentPlayer:", this.currentPlayer);
    this.currentPlayer = this.players[
      this.currentPlayer.id % this.players.length
    ];
  }

  fourConsecutives(positition: { row: number; col: number }) {
    if (
      this.fourInRow(positition.row) ||
      this.fourInColumn(positition.col) ||
      this.fourInUpDiagonal(positition) ||
      this.fourInDownDiagonal(positition)
    ) {
      this.winner = this.currentPlayer;
      return true;
    }

    return false;
  }

  fourInRow(row) {
    let consecutives = 0;
    for (let col = 0; col < this.SIZE; col++) {
      const slot = this.slots_grid[row][col];
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

  fourInColumn(col) {
    let consecutives = 0;
    for (let row = 0; row < this.SIZE; row++) {
      const slot = this.slots_grid[row][col];
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

  fourInUpDiagonal(positition: { row: number; col: number }) {
    console.log("positition:", positition);
    if (positition.row >= 3 && positition.col >= 3) {
      const startingcolumn = positition.col - positition.row;
      let row = 0;
      let consecutives = 0;
      for (let col = startingcolumn; col <= positition.col; col++) {
        const slot = this.slots_grid[row++][col];
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
    }
    return false;
  }

  fourInDownDiagonal(positition: { row: number; col: number }) {
    const mirroredCol = this.SIZE - positition.col - 1;
    const mirrored = [ ...this.slots_grid ].map(row => [ ...row ].reverse());

    if (positition.row >= 3 && mirroredCol >= 3) {
      const startingcolumn = mirroredCol - positition.row;
      let row = 0;
      let consecutives = 0;
      for (let col = startingcolumn; col <= this.SIZE - positition.col; col++) {
        const slot = mirrored[row++][col];
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
    }
    return false;
  }

  full() {
    return !this.slots_grid.some(row => row.some(slot => slot.isEmpty));
  }

  finished() {
    if (this.winner) {
      document.getElementById("winner").innerText = this.winner.name + " WINS";
      this.winner.win();
    } else {
      document.getElementById("winner").innerText = "TIE";
    }

    // console.log("finished");
    this.displayScore();
    this.displayScoreBoard();
    this.scoreBoard.update();
  }

  reset() {
    // this.display_grid = [ [ "", "", "" ], [ "", "", "" ], [ "", "", "" ] ];
    this.currentPlayer = this.players[
      Math.floor(Math.random() * this.players.length)
    ];
    this.display();
    this.displayBoard();
  }

  displayScore() {
    // const p1 = document.getElementById("player-1-score");
    // const p2 = document.getElementById("player-2-score");
    // p1.innerText = this.players[0].score.toString();
    // p2.innerText = this.players[1].score.toString();
  }
}
