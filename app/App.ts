import Board from "./scripts/components/Board";

const board = new Board();
const winnerDisplay = document.getElementById("winner");
console.log("winnerDisplay:", winnerDisplay);
if (winnerDisplay) {
  winnerDisplay.addEventListener("click", () => {
    board.hideScoreBoard();
    new Board();
  });
}
