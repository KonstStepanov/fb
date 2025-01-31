import Bird from "./Bird.js";
import Pipes from "./Pipes.js";
import Score from "./Score.js";
import Canvas from "./Canvas.js";

const spriteSrc = "assets/sprite.png";
const soundPaths = {
  SCORE_SND: "audio/score.wav",
  DIE_SND: "audio/fall.wav",
};

class Game {
  #canvasObj;
  #context;
  #sprite;
  #sounds;
  #bird;
  #pipes;
  #score;
  #canvas;
  #state;
  #frames;
  #startBtn;
  #degree;
  #fps;
  #interval;
  #now;
  #then;
  #delta;

  constructor(cvsId) {
    this.#canvasObj = document.getElementById(cvsId);
    this.#context = this.#canvasObj.getContext("2d");

    this.#degree = Math.PI / 180;

    this.#sprite = this.#loadSprite(spriteSrc);
    this.#sounds = this.#loadSounds(soundPaths);

    this.#state = {
      current: 0,
      getReady: 0,
      game: 1,
      over: 2,
    };

    this.#frames = 0;

    this.#startBtn = {
      x: 120,
      y: 263,
      width: 83,
      height: 29,
    };

    this.#score = new Score(this.#context, this.#sounds, this.#canvasObj);
    this.#bird = new Bird(
      this.#context,
      this.#canvasObj,
      this.#sounds,
      this.#degree,
      this.#sprite
    );
    this.#pipes = new Pipes(
      this.#context,
      this.#canvasObj,
      this.#sprite,
      this.#bird,
      this.#sounds,
      this.#score,
      this
    );
    this.#canvas = new Canvas(
      this.#canvasObj,
      this.#context,
      this.#sprite,
      this.#bird,
      this.#pipes,
      this.#score
    );

    this.#fps = 70;
    this.#interval = 1000 / this.#fps;
    this.#then = Date.now();
    this.#now = this.#then;
    this.#delta = 0;

    this.#initEventListeners();
  }

  #loadSprite(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  #loadSounds(paths) {
    const sounds = {};
    for (const [key, path] of Object.entries(paths)) {
      sounds[key] = new Audio(path.toString());
    }
    return sounds;
  }

  #initEventListeners() {
    const controlEvents = ["click", "keydown", "touchstart"];
    controlEvents.forEach((event) => {
      if (event === "keydown") {
        document.addEventListener(event, (e) => {
          if (e.code === "Space") {
            this.#handleStart(e);
          }
        });
      } else {
        this.#canvasObj.addEventListener(event, (evt) =>
          this.#handleStart(evt)
        );
      }
    });
  }

  #handleStart(evt) {
    switch (this.#state.current) {
      case this.#state.getReady:
        this.#startGame();
        break;
      case this.#state.game:
        this.#handleGame(evt);
        break;
      case this.#state.over:
        this.#handleGameOver(evt);
        break;
    }
  }

  #startGame() {
    this.#state.current = this.#state.game;
  }

  #handleGame() {
    if (this.#bird.y - this.#bird.radius > 0) {
      this.#bird.flap();
    }
    this.increaseGameSpeed();
  }

  #handleGameOver(evt) {
    if (this.#isClickWithinButton(evt)) {
      this.#restartGame();
    }
  }

  #isClickWithinButton(evt) {
    if (!evt || evt.type === "keydown" || evt.type === "touchstart") {
      return true;
    }

    const rect = this.#canvasObj.getBoundingClientRect();
    const clickX = evt.clientX - rect.left;
    const clickY = evt.clientY - rect.top;

    return (
      clickX >= this.#startBtn.x &&
      clickX <= this.#startBtn.x + this.#startBtn.width &&
      clickY >= this.#startBtn.y &&
      clickY <= this.#startBtn.y + this.#startBtn.height
    );
  }

  #restartGame() {
    this.#pipes.reset();
    this.#bird.speedReset();
    this.#score.reset();
    this.#state.current = this.#state.getReady;
  }

  increaseGameSpeed() {
    const speedSettings = [
      { score: 10, driveX: 4, frequency: 90 },
      { score: 100, driveX: 8, frequency: 80 },
      { score: 1000, driveX: 16, frequency: 70 },
      { score: 10000, driveX: 32, frequency: 60 },
    ];

    speedSettings.forEach((setting) => {
      if (this.#score.value === setting.score) {
        this.#pipes.driveX = setting.driveX;
        this.#pipes.pipeFrequency = setting.frequency;
      }
    });
  }

  loop() {
    this.#now = Date.now();
    this.#delta = this.#now - this.#then;

    if (this.#delta > this.#interval) {
      this.#then = this.#now - (this.#delta % this.#interval);
      this.#canvas.update(this.#state, this.#frames);
      this.#canvas.draw(this.#state);

      this.#frames++;
    }

    requestAnimationFrame(() => this.loop());
  }

  start() {
    this.loop();
  }
}

const game = new Game("canvas");
game.start();

export default Game;
