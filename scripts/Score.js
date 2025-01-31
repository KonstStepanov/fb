class Score {
    #context;
    #sounds;
    #best;
    #value;
    #canvas;

    constructor(context, sounds, canvas) {
        this.#context = context;
        this.#sounds = sounds;
        this.#canvas = canvas;
        this.#best = parseInt(localStorage.getItem("best")) || 0;
        this.#value = 0;
    }

    draw(state) {
        this.#context.fillStyle = "#FFFFFF";
        this.#context.strokeStyle = "#000000";

        document.fonts.load('45px Orbitron').then(() => {
            this.#context.font = state.current === state.game ? "45px Orbitron" : "23px Orbitron";
            this.#context.lineWidth = 2;

            if (state.current === state.game) {
                this.#drawCurrentScore();
            } else if (state.current === state.over) {
                this.#drawFinalScore();
            }
        });
    }

    #drawCurrentScore() {
        this.#context.fillText(this.#value, (this.#canvas.width / 2) - 15, 50);
        this.#context.strokeText(this.#value, (this.#canvas.width / 2) - 15, 50);
    }

    #drawFinalScore() {
        this.#drawScore(this.#value, 220, 186);
        this.#drawScore(this.#best, 220, 228);
    }

    #drawScore(score, x, y) {
        this.#context.fillText(score, x, y);
        this.#context.strokeText(score, x, y);
    }

    reset() {
        this.#value = 0;
    }

    get value() {
        return this.#value;
    }

    increment() {
        this.#value++;
        this.#sounds.SCORE_SND.play().then(_ => null);
        this.#best = Math.max(this.#value, this.#best);
        localStorage.setItem("best", this.#best);
    }
}

export default Score;
