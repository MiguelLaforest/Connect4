import Navigation from "./modules/navigation";
import Footer from "./modules/footer";
import Board from "./components/Board";

// let board = new Board();

const winnerDisplay = document.getElementById("winner");
console.log("winnerDisplay:", winnerDisplay);
if (winnerDisplay) {
  winnerDisplay.addEventListener("click", () => {
    console.log("a");
  });
}
