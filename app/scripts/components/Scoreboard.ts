import Player from "./Player";

export default class Scoreboard {
  players: Player[];
  // container = document.getElementById("scores-display");
  constructor(players: Player[]) {
    this.players = players;
  }
  update() {
    // this.container.innerHTML = this.render();
  }
  render() {
    return this.players
      .map(
        player => /* html */ `
      <div>${player.name} : ${player.score}</div>
    `
      )
      .toString()
      .replace(/,/, "");
  }
}
