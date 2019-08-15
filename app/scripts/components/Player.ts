export default class Player {
  id: number;
  name: string;
  discColor: string;
  private _score: number = 0;

  constructor(id: number, discColor: string) {
    this.name = "Player-" + id;
    this.discColor = discColor;
    this.id = id;
  }

  win() {
    console.log("this.score:", this.score);
    this.score++;
  }

  get score(): number {
    return this._score;
  }

  set score(value: number) {
    this._score = value;
  }
}
