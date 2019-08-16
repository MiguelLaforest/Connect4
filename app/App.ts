import Board from "./scripts/components/Board";

new Board();
const winnerDisplay = document.getElementById("winner-display");

if (winnerDisplay) {
  winnerDisplay.addEventListener("click", () => {
    winnerDisplay.style.display = "none";
    new Board();
  });
}
